"use client";

import { useEffect, useState } from "react";
import { getDashboardStats } from "@/lib/api/admin";
import { formatPrice } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  CalendarDays,
  Video,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const CHART_COLORS = ["#D4AF37", "#60A5FA", "#4ADE80", "#C084FC", "#FB923C", "#F87171"];

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  ACCEPTED: "Acceptée",
  PREPARING: "Préparation",
  PICKED_UP: "Récupérée",
  IN_TRANSIT: "En livraison",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

// Normalise une donnée qui peut arriver soit en tableau [{...}],
// soit en objet { clé: valeur } — évite les crashs .map is not a function.
function toEntries(value: any): { key: string; count: number }[] {
  if (Array.isArray(value)) {
    return value.map((v) => ({
      key: v.status ?? v.category ?? v.name ?? "?",
      count: v.count ?? v.revenue ?? v.value ?? 0,
    }));
  }
  if (value && typeof value === "object") {
    return Object.entries(value).map(([key, count]) => ({
      key,
      count: typeof count === "number" ? count : 0,
    }));
  }
  return [];
}

export default function OverviewPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then((res: any) => {
        console.log(" Dashboard raw response:", res);

        // Gère les deux cas : res.data (axios) ou res direct
        const data = res?.data ?? res ?? {};
        console.log(" Dashboard data:", data);
        console.log(" Videos object:", data?.videos);
        console.log(" Products object:", data?.products);
        console.log(" Revenue object:", data?.revenue);
        console.log(" Orders object:", data?.orders);

        setStats(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-smoke-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!stats || typeof stats !== "object") {
    return <div className="text-smoke-red">Erreur: stats invalides</div>;
  }

  const cards = [
    {
      title: "Clients",
      value: stats?.customers?.total ?? 0,
      sub: `+${stats?.customers?.new ?? 0} nouveaux`,
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      title: "Commandes",
      value: stats?.orders?.total ?? 0,
      sub: "Ce mois",
      icon: ShoppingCart,
      color: "text-smoke-gold",
      bg: "bg-smoke-gold/10",
    },
    {
      title: "Revenus",
      value: formatPrice(stats?.revenue?.total ?? 0),
      sub: "Total",
      icon: DollarSign,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      title: "Produits",
      value: stats?.products?.total ?? 0,
      sub: "En catalogue",
      icon: Package,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      title: "Réservations",
      value: stats?.reservations?.total ?? 0,
      sub: `${stats?.reservations?.confirmationRate ?? 0}% confirmées`,
      icon: CalendarDays,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
    },
    {
      title: "Vidéos",
      value: stats?.videos?.pendingModeration ?? 0,
      sub: "En modération",
      icon: Video,
      color: "text-red-400",
      bg: "bg-red-500/10",
    },
  ];

  // ── Données pour les graphes (défensif : tableau OU objet) ──
  const revenueData = toEntries(stats?.revenue?.byCategory).map((e) => ({
    name: e.key,
    revenu: e.count,
  }));

  const ordersData = toEntries(stats?.orders?.byStatus).map((e) => ({
    name: STATUS_LABELS[e.key] ?? e.key,
    value: e.count,
  }));

  const topProductsData = (Array.isArray(stats?.products?.top) ? stats.products.top : [])
    .slice(0, 6)
    .map((p: any) => ({
      name: p.productName ?? p.name ?? "?",
      vendus: p.totalSold ?? p.sold ?? 0,
    }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold text-smoke-white">Tableau de bord</h1>
        <Badge variant="info">Aujourd&apos;hui</Badge>
      </div>

      {/* Cartes de synthèse */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-smoke-card border border-smoke-border rounded-xl p-3 sm:p-6 hover:border-smoke-gold/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-smoke-muted truncate">{card.title}</p>
                  <p className="text-lg sm:text-2xl font-bold text-smoke-white mt-1 sm:mt-2 truncate">
                    {card.value}
                  </p>
                  <p className="text-[11px] sm:text-xs text-smoke-muted mt-1 truncate">{card.sub}</p>
                </div>
                <div className={`p-2 sm:p-3 rounded-lg shrink-0 ${card.bg}`}>
                  <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${card.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Graphiques d'activité */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-smoke-card border border-smoke-border rounded-xl p-4 sm:p-6">
          <h2 className="text-sm font-semibold text-smoke-white mb-4">Revenus par catégorie</h2>
          {revenueData.length === 0 ? (
            <p className="text-sm text-smoke-muted">Aucune donnée pour l&apos;instant.</p>
          ) : (
            <div className="h-64 sm:h-72 -ml-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#8b8b8b", fontSize: 11 }}
                    axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#8b8b8b", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={48}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#1a1a1a",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    formatter={((value: any) => formatPrice(Number(value))) as any}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Bar dataKey="revenu" radius={[6, 6, 0, 0]}>
                    {revenueData.map((_: any, i: number) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-smoke-card border border-smoke-border rounded-xl p-4 sm:p-6">
          <h2 className="text-sm font-semibold text-smoke-white mb-4">Commandes par statut</h2>
          {ordersData.length === 0 ? (
            <p className="text-sm text-smoke-muted">Aucune donnée pour l&apos;instant.</p>
          ) : (
            <div className="h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ordersData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius="45%"
                    outerRadius="75%"
                    paddingAngle={2}
                  >
                    {ordersData.map((_: any, i: number) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#1a1a1a",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, color: "#8b8b8b" }} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-smoke-card border border-smoke-border rounded-xl p-4 sm:p-6 lg:col-span-2">
          <h2 className="text-sm font-semibold text-smoke-white mb-4">Top produits vendus</h2>
          {topProductsData.length === 0 ? (
            <p className="text-sm text-smoke-muted">Aucune donnée pour l&apos;instant.</p>
          ) : (
            <div className="h-64 sm:h-72 -ml-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topProductsData}
                  layout="vertical"
                  margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: "#8b8b8b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: "#8b8b8b", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={110}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#1a1a1a",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="vendus" radius={[0, 6, 6, 0]} fill="#D4AF37" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}