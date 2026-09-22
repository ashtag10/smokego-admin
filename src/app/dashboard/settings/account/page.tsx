"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";

export default function AccountSettingsPage() {
  const [form, setForm] = useState({
    name: "Admin",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }
    setSaving(true);
    try {
      await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      alert("Profil mis à jour");
    } catch (err) {
      alert("Erreur");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-bold text-smoke-white flex items-center gap-3">
        <User className="h-6 w-6 text-smoke-gold" />
        Mon compte
      </h1>

      <form onSubmit={handleSubmit} className="bg-smoke-card border border-smoke-border rounded-xl p-6 space-y-5">
        <Input label="Nom" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
        <Input label="Email" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />

        <div className="border-t border-smoke-border pt-4">
          <h3 className="text-sm font-medium text-smoke-white mb-3">Changer le mot de passe</h3>
          <div className="space-y-4">
            <Input label="Mot de passe actuel" type="password" value={form.currentPassword} onChange={(e) => setForm((p) => ({ ...p, currentPassword: e.target.value }))} />
            <Input label="Nouveau mot de passe" type="password" value={form.newPassword} onChange={(e) => setForm((p) => ({ ...p, newPassword: e.target.value }))} />
            <Input label="Confirmer le nouveau mot de passe" type="password" value={form.confirmPassword} onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))} />
          </div>
        </div>

        <Button type="submit" className="w-full" isLoading={saving}>
          Mettre à jour
        </Button>
      </form>
    </div>
  );
}