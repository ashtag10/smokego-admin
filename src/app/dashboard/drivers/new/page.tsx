"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDriver } from "@/lib/api/drivers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewDriverPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await createDriver({
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        password: form.password,
      });
      router.push("/drivers");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-center gap-4">
        <Link href="/drivers">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-smoke-white">Nouveau livreur</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-smoke-card border border-smoke-border rounded-xl p-6 space-y-5">
        <Input
          label="Nom complet"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          required
        />
        <Input
          label="Téléphone"
          type="tel"
          placeholder="+237699123456"
          value={form.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          required
        />
        <Input
          label="Email (optionnel)"
          type="email"
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
        />
        <Input
          label="Mot de passe temporaire"
          type="password"
          value={form.password}
          onChange={(e) => updateField("password", e.target.value)}
          required
        />

        <Button type="submit" className="w-full" isLoading={loading}>
          Créer le compte livreur
        </Button>
      </form>
    </div>
  );
}