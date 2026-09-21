"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { logout } from "@/lib/api/auth";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  Video,
  CalendarDays,
  Crown,
  MapPin,
  Users,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
  FileVideo,
  CheckCircle,
  Flag,
  FolderTree,
  Images,
  Clapperboard,
} from "lucide-react";

interface NavItem {
  href?: string;
  label: string;
  icon: React.ElementType;
  children?: {
    href: string;
    label: string;
    icon: React.ElementType;
  }[];
}

const navItems: NavItem[] = [
  {
    href: "/overview",
    label: "Tableau de bord",
    icon: LayoutDashboard,
  },

  {
    href: "/products",
    label: "Produits",
    icon: Package,
  },

  {
    href: "/categories",
    label: "Catégories",
    icon: FolderTree,
  },

  {
    href: "/slides",
    label: "Slides",
    icon: Images,
  },

  {
    href: "/stories",
    label: "Stories",
    icon: Clapperboard,
  },

  {
    href: "/orders",
    label: "Commandes",
    icon: ShoppingCart,
  },

  {
    href: "/drivers",
    label: "Livreurs",
    icon: Truck,
  },

  {
    label: "Communauté",
    icon: Video,
    children: [
      {
        href: "/community/moderation-queue",
        label: "File de modération",
        icon: FileVideo,
      },
      {
        href: "/community/published",
        label: "Publiées",
        icon: CheckCircle,
      },
      {
        href: "/community/new-video",
        label: "Nouvelle vidéo",
        icon: Video,
      },
      {
        href: "/community/reports",
        label: "Signalements",
        icon: Flag,
      },
    ],
  },

  {
    href: "/reservations",
    label: "Réservations",
    icon: CalendarDays,
  },

  {
    href: "/loyalty/vip-settings",
    label: "Fidélité",
    icon: Crown,
  },

  {
    href: "/zones",
    label: "Zones",
    icon: MapPin,
  },

  {
    href: "/team",
    label: "Équipe",
    icon: Users,
  },

  {
    href: "/settings/lounge",
    label: "Paramètres",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [openMenu, setOpenMenu] = useState<string | null>("Communauté");
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  // ─── Déconnexion ─────────────────────────────────────────────
  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken") ?? "";

    // 1. Révoquer le refresh token côté backend (best-effort)
    if (refreshToken) {
      try {
        await logout(refreshToken);
      } catch (e) {
        console.warn(
          "Logout backend a échoué, on nettoie quand même :",
          e
        );
      }
    }

    // 2. Nettoyer le localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    // 3. Supprimer le cookie accessToken
    document.cookie = "accessToken=; path=/; max-age=0";

    // 4. Rediriger vers la connexion
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      {/* ─── Mobile Hamburger ─────────────────────────────────── */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-smoke-dark border border-smoke-border text-smoke-white"
        aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
      >
        {mobileOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>

      {/* ─── Overlay mobile ───────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ─── Sidebar ──────────────────────────────────────────── */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-smoke-dark border-r border-smoke-border flex flex-col transition-transform duration-300",
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* ─── Logo / Header ──────────────────────────────────── */}
        <div className="p-6 border-b border-smoke-border flex items-center justify-between">
          <h1 className="text-xl font-bold gold-gradient-text">
            SmokeGo Admin
          </h1>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-smoke-muted hover:text-smoke-white transition-colors"
            aria-label="Fermer le menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ─── Navigation ─────────────────────────────────────── */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const hasChildren = !!item.children;
            const isOpen = openMenu === item.label;

            const parentActive =
              hasChildren &&
              item.children?.some((child) => isActive(child.href));

            return (
              <div key={item.label}>
                {/* Parent avec sous-menu */}
                {hasChildren ? (
                  <button
                    onClick={() =>
                      setOpenMenu(isOpen ? null : item.label)
                    }
                    className={cn(
                      "flex items-center justify-between w-full gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                      parentActive
                        ? "bg-smoke-gold/10 text-smoke-gold border border-smoke-gold/20"
                        : "text-smoke-muted hover:text-smoke-white hover:bg-smoke-card"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </div>

                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>
                ) : (
                  /* Parent simple */
                  <Link
                    href={item.href!}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                      isActive(item.href!)
                        ? "bg-smoke-gold/10 text-smoke-gold border border-smoke-gold/20"
                        : "text-smoke-muted hover:text-smoke-white hover:bg-smoke-card"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                )}

                {/* ─── Sous-menu ──────────────────────────────── */}
                {hasChildren && isOpen && (
                  <div className="ml-4 mt-1 space-y-1 border-l border-smoke-border pl-4">
                    {item.children!.map((child) => {
                      const ChildIcon = child.icon;

                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors",
                            isActive(child.href)
                              ? "text-smoke-gold bg-smoke-gold/5"
                              : "text-smoke-muted hover:text-smoke-white hover:bg-smoke-card"
                          )}
                        >
                          <ChildIcon className="h-4 w-4" />
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* ─── Déconnexion ────────────────────────────────────── */}
        <div className="p-4 border-t border-smoke-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-smoke-muted hover:text-smoke-red hover:bg-smoke-red/10 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
}