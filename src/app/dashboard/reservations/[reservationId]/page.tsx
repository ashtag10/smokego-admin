"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getReservation, checkInReservation } from "@/lib/api/reservations";
import { Reservation } from "@/types/reservation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/format";
import { ArrowLeft, QrCode, User, Calendar, Clock, Users, Check } from "lucide-react";
import Link from "next/link";

export default function ReservationDetailPage() {
  const params = useParams();
  const reservationId = params.reservationId as string;
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkInLoading, setCheckInLoading] = useState(false);

  useEffect(() => {
    getReservation(reservationId)
      .then(setReservation)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [reservationId]);

  async function handleCheckIn() {
    if (!reservation?.qrCodeToken) return;
    setCheckInLoading(true);
    try {
      await checkInReservation(reservation.qrCodeToken);
      setReservation((prev) => (prev ? { ...prev, status: "COMPLETED", checkedInAt: new Date().toISOString() } : prev));
    } catch (err) {
      alert("Erreur lors du check-in");
    } finally {
      setCheckInLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-smoke-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!reservation) {
    return <p className="text-smoke-muted">Réservation introuvable</p>;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/reservations">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-smoke-white">Détail réservation</h1>
      </div>

      <div className="bg-smoke-card border border-smoke-border rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Badge
            variant={
              reservation.status === "CONFIRMED"
                ? "success"
                : reservation.status === "PENDING"
                ? "warning"
                : reservation.status === "COMPLETED"
                ? "default"
                : "danger"
            }
          >
            {reservation.status}
          </Badge>
          {reservation.checkedInAt && (
            <span className="text-xs text-smoke-gold flex items-center gap-1">
              <Check className="h-3 w-3" />
              Check-in effectué
            </span>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-smoke-gold" />
            <div>
              <p className="text-smoke-white font-medium">{reservation.userName}</p>
              <p className="text-sm text-smoke-muted">{reservation.userPhone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-smoke-gold" />
            <p className="text-smoke-white">{reservation.date}</p>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-smoke-gold" />
            <p className="text-smoke-white">{reservation.time}</p>
          </div>

          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-smoke-gold" />
            <p className="text-smoke-white">{reservation.peopleCount} personnes</p>
          </div>

          {reservation.tableName && (
            <div className="flex items-center gap-3">
              <QrCode className="h-5 w-5 text-smoke-gold" />
              <p className="text-smoke-white">Table : {reservation.tableName}</p>
            </div>
          )}

          {reservation.message && (
            <div className="bg-smoke-dark rounded-lg p-4">
              <p className="text-sm text-smoke-muted mb-1">Message du client</p>
              <p className="text-smoke-white text-sm">{reservation.message}</p>
            </div>
          )}
        </div>

        {reservation.status === "CONFIRMED" && !reservation.checkedInAt && (
          <Button className="w-full" onClick={handleCheckIn} isLoading={checkInLoading}>
            <QrCode className="h-4 w-4 mr-2" />
            Scanner QR Code (Check-in)
          </Button>
        )}

        <div className="text-xs text-smoke-muted pt-4 border-t border-smoke-border">
          Créée le {formatDate(reservation.createdAt)}
        </div>
      </div>

      {reservation.qrCodeToken && reservation.status === "CONFIRMED" && (
        <div className="bg-smoke-card border border-smoke-border rounded-xl p-6 text-center">
          <p className="text-sm text-smoke-muted mb-4">QR Code de la réservation</p>
          <div className="inline-block bg-white p-4 rounded-xl">
            {/* Remplace par un vrai composant QR Code si tu as une lib */}
            <div className="h-48 w-48 bg-smoke-black flex items-center justify-center">
              <QrCode className="h-24 w-24 text-smoke-white" />
            </div>
          </div>
          <p className="text-xs text-smoke-muted mt-2 font-mono">{reservation.qrCodeToken}</p>
        </div>
      )}
    </div>
  );
}