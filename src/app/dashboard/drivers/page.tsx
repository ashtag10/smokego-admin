"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getDrivers, toggleDriverStatus } from "@/lib/api/drivers";
import { Driver } from "@/types/driver";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils/cn";
import { formatPhone } from "@/lib/utils/format";
import { Plus, Eye, Power, PowerOff, Truck } from "lucide-react";
import Image from "next/image";

export default function DriversPage() {
  const router = useRouter();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDrivers();
  }, []);

  async function loadDrivers() {
    try {
      const res: any = await getDrivers();
      const items = res.users ?? res.drivers ?? res.data ?? (Array.isArray(res) ? res : []);
      setDrivers(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleStatus(driver: Driver) {
    try {
      await toggleDriverStatus(driver.id, !driver.isActive);
      setDrivers((prev) =>
        prev.map((d) => (d.id === driver.id ? { ...d, isActive: !d.isActive } : d))
      );
    } catch (err) {
      alert("Erreur lors du changement de statut");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-smoke-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-smoke-white">Livreurs</h1>
        <Link href="/dashboard/drivers/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau livreur
          </Button>
        </Link>
      </div>

      <Table>
        <TableHead>
          <TableHeader>Nom</TableHeader>
          <TableHeader>Téléphone</TableHeader>
          <TableHeader>Zones</TableHeader>
          <TableHeader>Livraisons</TableHeader>
          <TableHeader>Statut</TableHeader>
          <TableHeader className="text-right">Actions</TableHeader>
        </TableHead>
        <TableBody>
          {(drivers ?? []).map((driver) => (
            <TableRow key={driver.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  {driver.avatarUrl ? (
                    <Image
                      src={driver.avatarUrl}
                      alt={driver.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-smoke-gold/10 flex items-center justify-center">
                      <Truck className="h-5 w-5 text-smoke-gold" />
                    </div>
                  )}
                  <span className="text-smoke-white font-medium">{driver.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-smoke-muted">{formatPhone(driver.phone)}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {(driver.zones ?? []).map((zone) => (
                    <Badge key={zone} variant="info" className="text-xs">
                      {zone}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <span className="text-smoke-white">{driver.totalDeliveries ?? 0}</span>
              </TableCell>
              <TableCell>
                <Badge variant={driver.isActive ? "success" : "danger"}>
                  {driver.isActive ? "Actif" : "Inactif"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => router.push(`/drivers/${driver.id}`)}
                    className="p-2 text-smoke-muted hover:text-smoke-gold transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleToggleStatus(driver)}
                    className={cn(
                      "p-2 transition-colors",
                      driver.isActive
                        ? "text-smoke-muted hover:text-smoke-red"
                        : "text-smoke-muted hover:text-green-400"
                    )}
                    title={driver.isActive ? "Désactiver" : "Activer"}
                  >
                    {driver.isActive ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}