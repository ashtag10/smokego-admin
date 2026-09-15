"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Store } from "lucide-react";

export default function LoungeSettingsPage() {
  const [form, setForm] = useState({
    name: "SmokeGo Lounge",
    address: "",
    phone: "",
    openingHours: "14:00 - 02:00",
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("/api/admin/settings/lounge", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      alert("Paramètres enregistrés");
    } catch (err) {
      alert("Erreur");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-bold text-smoke-white flex items-center gap-3">
        <Store className="h-6 w-6 text-smoke-gold" />
        Paramètres du lounge
      </h1>

      <form onSubmit={handleSubmit} className="bg-smoke-card border border-smoke-border rounded-xl p-6 space-y-5">
        <Input
          label="Nom du lounge"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          required
        />
        <Input
          label="Adresse"
          value={form.address}
          onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
        />
        <Input
          label="Téléphone"
          value={form.phone}
          onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
        />
        <Input
          label="Horaires d'ouverture"
          value={form.openingHours}
          onChange={(e) => setForm((p) => ({ ...p, openingHours: e.target.value }))}
        />

        <Button type="submit" className="w-full" isLoading={saving}>
          Enregistrer
        </Button>
      </form>
    </div>
  );
}