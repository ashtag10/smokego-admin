"use client";

import { useEffect, useState } from "react";
import { getLoyaltySettings, updateLoyaltySettings, evaluateVip } from "@/lib/api/loyalty";
import { LoyaltySettings } from "@/lib/api/loyalty";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Crown, RefreshCw } from "lucide-react";

export default function VipSettingsPage() {
  const [settings, setSettings] = useState<LoyaltySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const res = await getLoyaltySettings();
      setSettings(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      
      await updateLoyaltySettings({
        vipThreshold: settings.vipThreshold,
      });
      alert("Paramètres VIP mis à jour");
    } catch (err) {
      alert("Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  }

  async function handleEvaluate() {
    setEvaluating(true);
    try {
      await evaluateVip();
      alert("Réévaluation VIP lancée");
    } catch (err) {
      alert("Erreur lors de la réévaluation");
    } finally {
      setEvaluating(false);
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-smoke-white flex items-center gap-3">
          <Crown className="h-6 w-6 text-smoke-gold" />
          Paramètres VIP
        </h1>
        <Button variant="secondary" size="sm" onClick={handleEvaluate} isLoading={evaluating}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Réévaluer tous
        </Button>
      </div>

      <form onSubmit={handleSave} className="bg-smoke-card border border-smoke-border rounded-xl p-6 space-y-5">
        <Input
          label="Seuil VIP (FCFA sur 90 jours)"
          type="number"
          value={settings?.vipThreshold ?? 50000}
          onChange={(e) => setSettings((p) => p ? { ...p, vipThreshold: parseInt(e.target.value) } : p)}
          required
        />
        
       

        <Button type="submit" className="w-full" isLoading={saving}>
          Enregistrer
        </Button>
      </form>
    </div>
  );
}