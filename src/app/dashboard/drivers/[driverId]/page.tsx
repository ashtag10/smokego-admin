"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getDriver, getDriverDeliveries } from "@/lib/api/drivers";
import { Driver, Delivery } from "@/types/driver";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPhone } from "@/lib/utils/format";
import { ArrowLeft, Truck, Star, Clock, Package } from "lucide-react";
import Link from "next/link";

export default function DriverDetailPage() {
  const params = useParams();
  const driverId = params.driverId as string;
  const [driver, setDriver] = useState<Driver | null>(null);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDriver(driverId), getDriverDeliveries(driverId)])
      .then(([d, del]) => {
        setDriver(d);
        setDeliveries(Array.isArray(del) ? del : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [driverId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-smoke-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!driver) {
    return <p className="text-smoke-muted">Livreur introuvable</p>;
  }

  // Le backend ne calcule pas encore ces indicateurs pour un livreur.
  // On dérive ce qu'on peut à partir des livraisons déjà récupérées,
  // et on affiche "—" plutôt qu'un chiffre inventé pour le reste.
  const totalDeliveries = driver.totalDeliveries ?? deliveries.length;
  const averageDeliveryTime = driver.averageDeliveryTime;
  const rating = driver.rating;
  const cancellationRate = driver.cancellationRate;
  const zones = driver.zones ?? [];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/drivers">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-smoke-white">{driver.name}</h1>
        <Badge variant={driver.isActive ? "success" : "danger"}>
          {driver.isActive ? "Actif" : "Inactif"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-smoke-card border border-smoke-border rounded-xl p-6 text-center">
          <Truck className="h-8 w-8 text-smoke-gold mx-auto mb-2" />
          <p className="text-3xl font-bold text-smoke-white">{totalDeliveries}</p>
          <p className="text-sm text-smoke-muted">Livraisons</p>
        </div>
        <div className="bg-smoke-card border border-smoke-border rounded-xl p-6 text-center">
          <Clock className="h-8 w-8 text-smoke-gold mx-auto mb-2" />
          <p className="text-3xl font-bold text-smoke-white">
            {averageDeliveryTime != null ? `${averageDeliveryTime}m` : "—"}
          </p>
          <p className="text-sm text-smoke-muted">Temps moyen</p>
        </div>
        <div className="bg-smoke-card border border-smoke-border rounded-xl p-6 text-center">
          <Star className="h-8 w-8 text-smoke-gold mx-auto mb-2" />
          <p className="text-3xl font-bold text-smoke-white">
            {rating != null ? rating.toFixed(1) : "—"}
          </p>
          <p className="text-sm text-smoke-muted">Note moyenne</p>
        </div>
      </div>

      <div className="bg-smoke-card border border-smoke-border rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-smoke-white">Informations</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-smoke-muted">Téléphone</p>
            <p className="text-smoke-white">{formatPhone(driver.phone)}</p>
          </div>
          <div>
            <p className="text-smoke-muted">Email</p>
            <p className="text-smoke-white">{driver.email ?? "—"}</p>
          </div>
          <div>
            <p className="text-smoke-muted">Zones</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {zones.length === 0 ? (
                <span className="text-smoke-white">—</span>
              ) : (
                zones.map((z) => (
                  <Badge key={z} variant="info">{z}</Badge>
                ))
              )}
            </div>
          </div>
          <div>
            <p className="text-smoke-muted">Taux d&apos;annulation</p>
            <p className="text-smoke-white">
              {cancellationRate != null ? `${(cancellationRate * 100).toFixed(1)}%` : "—"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-smoke-card border border-smoke-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-smoke-border">
          <h2 className="text-lg font-semibold text-smoke-white">Historique des livraisons</h2>
        </div>
        {deliveries.length === 0 ? (
          <div className="px-6 py-8 text-center text-smoke-muted">
            <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Aucune livraison enregistrée</p>
          </div>
        ) : (
          <div className="divide-y divide-smoke-border">
            {deliveries.map((d) => (
              <div key={d.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-smoke-white text-sm font-medium">Commande #{d.orderId.slice(0, 8)}</p>
                  <p className="text-xs text-smoke-muted">{d.zone}</p>
                </div>
                <Badge
                  variant={
                    d.status === "DELIVERED"
                      ? "success"
                      : d.status === "IN_TRANSIT"
                        ? "default"
                        : "info"
                  }
                >
                  {d.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}