"use client";

import { useState, useCallback } from "react";
import { Product, ProductCategory } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateProductData } from "@/lib/api/products";
import { apiClient } from "@/lib/api/client"; 
import { Upload, X } from "lucide-react";

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: CreateProductData) => Promise<void>;
}

const CATEGORIES: ProductCategory[] = ["CHICHA", "SAVEUR", "ACCESSOIRE", "PACK"];

export function ProductForm({ initialData, onSubmit }: ProductFormProps) {
  const [form, setForm] = useState<CreateProductData>({
    name: initialData?.name ?? "",
    description: initialData?.description ?? "",
    price: initialData ? parseFloat(initialData.price) : 0,
    promoPrice: initialData?.promoPrice ? parseFloat(initialData.promoPrice) : undefined,
    category: initialData?.category ?? "CHICHA",
    brand: initialData?.brand ?? "",
    images: initialData?.images ?? [],
    stock: initialData?.stock ?? 0,
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null); 
  const [imagePreview, setImagePreview] = useState(initialData?.images?.[0] ?? ""); 
  const [loading, setLoading] = useState(false);

  function updateField<K extends keyof CreateProductData>(field: K, value: CreateProductData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image trop volumineuse (max 5 Mo)");
      return;
    }
    if (!file.type.match(/image\/(jpeg|jpg|png|webp)/)) {
      alert("Format accepté : JPG, PNG, WEBP");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }, []);

  const clearImage = useCallback(() => {
    setImageFile(null);
    setImagePreview("");
    updateField("images", []);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = form.images[0];

      
      if (imageFile) {
        const fd = new FormData();
        fd.append("file", imageFile);
        const res = await apiClient.post("/media/image", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        imageUrl = res.data.url;
      }

      await onSubmit({ ...form, images: imageUrl ? [imageUrl] : [] });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-smoke-card border border-smoke-border rounded-xl p-6 space-y-5">
      <Input
        label="Nom du produit"
        value={form.name}
        onChange={(e) => updateField("name", e.target.value)}
        required
      />

      <div>
        <label className="block text-sm font-medium text-smoke-white mb-1.5">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          rows={4}
          className="w-full bg-smoke-card border border-smoke-border rounded-lg px-4 py-2.5 text-sm text-smoke-white placeholder:text-smoke-muted focus:outline-none focus:border-smoke-gold/50 focus:ring-1 focus:ring-smoke-gold/20 resize-none"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Prix (FCFA)"
          type="number"
          value={form.price}
          onChange={(e) => updateField("price", parseFloat(e.target.value))}
          required
        />
        <Input
          label="Prix promo (optionnel)"
          type="number"
          value={form.promoPrice ?? ""}
          onChange={(e) => updateField("promoPrice", e.target.value ? parseFloat(e.target.value) : undefined)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-smoke-white mb-1.5">Catégorie</label>
          <select
            value={form.category}
            onChange={(e) => updateField("category", e.target.value as ProductCategory)}
            className="w-full bg-smoke-card border border-smoke-border rounded-lg px-4 py-2.5 text-sm text-smoke-white focus:outline-none focus:border-smoke-gold/50"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <Input
          label="Marque"
          value={form.brand}
          onChange={(e) => updateField("brand", e.target.value)}
        />
      </div>

      <Input
        label="Stock"
        type="number"
        value={form.stock}
        onChange={(e) => updateField("stock", parseInt(e.target.value))}
        required
      />

      {/* ← REMPLACÉ : zone d'upload d'image */}
      <div>
        <label className="block text-sm font-medium text-smoke-white mb-1.5">
          Image du produit *
        </label>

        {!imagePreview ? (
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-smoke-border rounded-xl cursor-pointer hover:border-smoke-gold/50 hover:bg-smoke-gold/5 transition-colors">
            <div className="flex flex-col items-center gap-2 text-smoke-muted">
              <Upload className="h-6 w-6" />
              <span className="text-sm">Clique pour ajouter une image</span>
              <span className="text-xs">JPG, PNG, WEBP — max 5 Mo</span>
            </div>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        ) : (
          <div className="relative w-full h-40 rounded-xl overflow-hidden border border-smoke-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-contain bg-smoke-dark"
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Publication..." : initialData ? "Mettre à jour" : "Créer le produit"}
        </Button>
      </div>
    </form>
  );
}