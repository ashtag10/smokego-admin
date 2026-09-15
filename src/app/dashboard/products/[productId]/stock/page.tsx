"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProduct, updateStock } from "@/lib/api/products";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function StockPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.productId as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [adjustment, setAdjustment] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProduct(productId)
      .then(setProduct)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [productId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!adjustment || !reason) return;
    try {
      await updateStock(productId, parseInt(adjustment), reason);
      router.push("/dashboard/products");
    } catch (err) {
      alert("Erreur lors de l&apos;ajustement du stock");
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
      <div className="flex items-center gap-4">
        <Link href="/dashboard/products">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-smoke-white">Ajustement stock</h1>
      </div>

      <div className="bg-smoke-card border border-smoke-border rounded-xl p-6">
        <p className="text-smoke-muted mb-4">
          Produit : <span className="text-smoke-white font-medium">{product?.name}</span>
        </p>
        <p className="text-smoke-muted mb-6">
          Stock actuel : <span className="text-smoke-gold font-bold text-lg">{product?.stock}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Ajustement (+ pour ajouter, - pour retirer)"
            type="number"
            placeholder="Ex: -5"
            value={adjustment}
            onChange={(e) => setAdjustment(e.target.value)}
            required
          />

          <Input
            label="Raison"
            type="text"
            placeholder="Ex: Inventaire, casse, réapprovisionnement..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />

          <Button type="submit" className="w-full">
            Valider l&apos;ajustement
          </Button>
        </form>
      </div>
    </div>
  );
}