"use client";

import { useEffect, useState } from "react";
import { getLoyaltySettings, updateLoyaltySettings } from "@/lib/api/loyalty";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Coins } from "lucide-react";

export default function PointsSettingsPage() {
  const [pointsPer100FCFA, setPointsPer100FCFA] = useState(1);
  const [vipThreshold, setVipThreshold] = useState(50000);
  const [maxPointsPerOrder, setMaxPointsPerOrder] = useState(1000);
  const [conversionRate, setConversionRate] = useState(100);
  const [maxUsagePercent, setMaxUsagePercent] = useState(20);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const res = await getLoyaltySettings();
      setPointsPer100FCFA(res.pointsPer100FCFA ?? 1);
      setVipThreshold(res.vipThreshold ?? 50000);
      setMaxPointsPerOrder(res.maxPointsPerOrder ?? 1000);
      setConversionRate(res.conversionRate ?? 100);
      setMaxUsagePercent(res.maxUsagePercent ?? 20);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    // ✅ Objet neuf, 5 champs uniquement, aucun risque d'id ou note
    const payload = {
      pointsPer100FCFA,
      vipThreshold,
      maxPointsPerOrder,
      conversionRate,
      maxUsagePercent,
    };

    console.log("Payload envoyé :", JSON.stringify(payload)); // Pour vérifier

    try {
      await updateLoyaltySettings(payload);
      alert("Paramètres mis à jour");
    } catch (err) {
      alert("Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
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
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-bold text-smoke-white flex items-center gap-3">
        <Coins className="h-6 w-6 text-smoke-gold" />
        Paramètres Points
      </h1>

      <form
        onSubmit={handleSave}
        className="bg-smoke-card border border-smoke-border rounded-xl p-6 space-y-5"
      >
        <Input
          label="Points par tranche de 100 FCFA"
          type="number"
          value={pointsPer100FCFA}
          onChange={(e) => setPointsPer100FCFA(parseInt(e.target.value) || 0)}
          required
        />
        <Input
          label="Seuil VIP (FCFA sur 90 jours)"
          type="number"
          value={vipThreshold}
          onChange={(e) => setVipThreshold(parseInt(e.target.value) || 0)}
          required
        />
        <Input
          label="Points max par commande"
          type="number"
          value={maxPointsPerOrder}
          onChange={(e) => setMaxPointsPerOrder(parseInt(e.target.value) || 0)}
          required
        />
        <Input
          label="Taux de conversion (points → FCFA)"
          type="number"
          value={conversionRate}
          onChange={(e) => setConversionRate(parseInt(e.target.value) || 0)}
          required
        />
        <Input
          label="Plafond utilisation points (% de la commande)"
          type="number"
          max={100}
          value={maxUsagePercent}
          onChange={(e) => setMaxUsagePercent(parseInt(e.target.value) || 0)}
          required
        />

        <Button type="submit" className="w-full" isLoading={saving}>
          Enregistrer
        </Button>
      </form>
    </div>
  );
}