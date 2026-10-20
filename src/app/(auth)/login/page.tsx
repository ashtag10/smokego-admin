"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Crown } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login({ phone, password });

      if (res.user.role !== "ADMIN") {
        setError("Accès réservé aux administrateurs.");
        setLoading(false);
        return;
      }

      // Stocke tokens
      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("refreshToken", res.refreshToken);

      // Cookie pour le middleware
      document.cookie = `accessToken=${res.accessToken}; path=/; max-age=900`; // 15min

      router.push("/overview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-smoke-gold/10 mb-4">
          <Crown className="h-8 w-8 text-smoke-gold" />
        </div>
        <h1 className="text-2xl font-bold text-smoke-white">SmokeGo Admin</h1>
        <p className="text-smoke-muted mt-2">Connectez-vous au dashboard</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Téléphone"
          type="tel"
          placeholder="+237699123456"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <Input
          label="Mot de passe"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p className="text-sm text-smoke-red-light bg-smoke-red/10 px-4 py-2 rounded-lg">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" isLoading={loading}>
          Se connecter
        </Button>
      </form>
    </div>
  );
}