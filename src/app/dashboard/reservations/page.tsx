"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getReservations, confirmReservation, rejectReservation } from "@/lib/api/reservations";
import { Reservation } from "@/types/reservation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import { formatDateShort } from "@/lib/utils/format";
import { CalendarDays, Check, Eye, X, QrCode } from "lucide-react";
import Link from "next/link";

export default function ReservationsPage() {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const loadReservations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getReservations({ status: statusFilter || undefined, limit: 100 });
      setReservations(res.data ?? res ?? []); // ← CORRIGÉ
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  async function handleConfirm(id: string) {
    try {
      await confirmReservation(id);
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "CONFIRMED" } : r))
      );
    } catch (err) {
      alert("Erreur lors de la confirmation");
    }
  }

  async function handleReject() {
    if (!rejectId) return;
    try {
      await rejectReservation(rejectId, rejectReason);
      setReservations((prev) =>
        prev.map((r) => (r.id === rejectId ? { ...r, status: "REJECTED" } : r))
      );
      setRejectId(null);
      setRejectReason("");
    } catch (err) {
      alert("Erreur lors du refus");
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
        <h1 className="text-2xl font-bold text-smoke-white">Réservations</h1>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-smoke-card border border-smoke-border rounded-lg px-4 py-2 text-sm text-smoke-white focus:outline-none focus:border-smoke-gold/50"
          >
            <option value="">Tous</option>
            <option value="PENDING">En attente</option>
            <option value="CONFIRMED">Confirmées</option>
            <option value="REJECTED">Refusées</option>
            <option value="COMPLETED">Terminées</option>
            <option value="CANCELLED">Annulées</option>
          </select>
          <Link href="/dashboard/reservations/settings">
            <Button variant="secondary" size="sm">
              <CalendarDays className="h-4 w-4 mr-2" />
              Paramètres
            </Button>
          </Link>
        </div>
      </div>

      <Table>
        <TableHead>
          <TableHeader>Client</TableHeader>
          <TableHeader>Date</TableHeader>
          <TableHeader>Heure</TableHeader>
          <TableHeader>Personnes</TableHeader>
          <TableHeader>Table</TableHeader>
          <TableHeader>Statut</TableHeader>
          <TableHeader className="text-right">Actions</TableHeader>
        </TableHead>
        <TableBody>
          {(reservations ?? []).map((res) => ( // ← CORRIGÉ
            <TableRow key={res.id}>
              <TableCell>
                <div>
                  <p className="text-smoke-white text-sm">{res.user?.name ?? '—'}</p>
                  <p className="text-xs text-smoke-muted">{res.user?.phone ?? '—'}</p>

                </div>
              </TableCell>
              <TableCell className="text-smoke-white">{res.date}</TableCell>
              <TableCell className="text-smoke-white">{res.time}</TableCell>
              <TableCell className="text-smoke-white">{res.peopleCount}</TableCell>
              <TableCell className="text-smoke-muted">{res.tableName ?? "—"}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    res.status === "CONFIRMED"
                      ? "success"
                      : res.status === "PENDING"
                        ? "warning"
                        : res.status === "REJECTED" || res.status === "CANCELLED"
                          ? "danger"
                          : "default"
                  }
                >
                  {res.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => router.push(`/reservations/${res.id}`)}
                    className="p-2 text-smoke-muted hover:text-smoke-gold transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  {res.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => handleConfirm(res.id)}
                        className="p-2 text-smoke-muted hover:text-green-400 transition-colors"
                        title="Confirmer"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setRejectId(res.id)}
                        className="p-2 text-smoke-muted hover:text-smoke-red transition-colors"
                        title="Refuser"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  )}
                  {res.status === "CONFIRMED" && res.qrCodeToken && (
                    <button
                      onClick={() => router.push(`/reservations/${res.id}`)}
                      className="p-2 text-smoke-muted hover:text-smoke-gold transition-colors"
                      title="Voir QR Code"
                    >
                      <QrCode className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal
        isOpen={!!rejectId}
        onClose={() => {
          setRejectId(null);
          setRejectReason("");
        }}
        title="Refuser la réservation"
        size="sm"
      >
        <div className="space-y-4">
          <Input
            label="Motif (optionnel)"
            placeholder="Créneau complet, fermeture exceptionnelle..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <div className="flex gap-3 justify-end">
            <Button
              variant="ghost"
              onClick={() => {
                setRejectId(null);
                setRejectReason("");
              }}
            >
              Annuler
            </Button>
            <Button variant="danger" onClick={handleReject}>
              Refuser
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}