"use client";

import { useState, useCallback, useMemo } from "react";
import { Category } from "@/types/category";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateCategoryData } from "@/lib/api/categories";
import { apiClient } from "@/lib/api/client";
import { useCategoryTree } from "@/hooks/use-categories";
import { Upload, X } from "lucide-react";

interface CategoryFormProps {
  initialData?: Category;
  onSubmit: (data: CreateCategoryData) => Promise<void>;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function CategoryForm({ initialData, onSubmit }: CategoryFormProps) {
  const { categories } = useCategoryTree();

  const [form, setForm] = useState<CreateCategoryData>({
    name: initialData?.name ?? "",
    slug: initialData?.slug ?? "",
    parentId: initialData?.parentId ?? null,
    image: initialData?.image ?? undefined,
    position: initialData?.position ?? 0,
  });

  const [slugTouched, setSlugTouched] = useState(!!initialData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(initialData?.image ?? "");
  const [loading, setLoading] = useState(false);

  function updateField<K extends keyof CreateCategoryData>(field: K, value: CreateCategoryData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // Seules les catégories RACINES peuvent être choisies comme parent (pas de 3e niveau)
  const rootCategories = useMemo(
    () => categories.filter((c) => !c.parentId && c.id !== initialData?.id),
    [categories, initialData?.id],
  );

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
    updateField("image", undefined);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = form.image;

      if (imageFile) {
        const fd = new FormData();
        fd.append("file", imageFile);
        const res = await apiClient.post("/media/image", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        imageUrl = res.data.url;
      }

      await onSubmit({ ...form, image: imageUrl });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-smoke-card border border-smoke-border rounded-xl p-6 space-y-5">
      <Input
        label="Nom de la catégorie"
        value={form.name}
        onChange={(e) => {
          const name = e.target.value;
          updateField("name", name);
          if (!slugTouched) updateField("slug", slugify(name));
        }}
        required
      />

      <Input
        label="Slug (URL)"
        value={form.slug}
        onChange={(e) => {
          setSlugTouched(true);
          updateField("slug", e.target.value);
        }}
        required
      />

      <div>
        <label className="block text-sm font-medium text-smoke-white mb-1.5">
          Catégorie parente (laisser vide pour une catégorie racine)
        </label>
        <select
          value={form.parentId ?? ""}
          onChange={(e) => updateField("parentId", e.target.value || null)}
          className="w-full bg-smoke-card border border-smoke-border rounded-lg px-4 py-2.5 text-sm text-smoke-white focus:outline-none focus:border-smoke-gold/50"
        >
          <option value="">Aucune — catégorie racine</option>
          {rootCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <Input
        label="Position (ordre d'affichage)"
        type="number"
        value={form.position ?? 0}
        onChange={(e) => updateField("position", parseInt(e.target.value) || 0)}
      />

      <div>
        <label className="block text-sm font-medium text-smoke-white mb-1.5">Image (optionnel)</label>

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
            <img src={imagePreview} alt="Preview" className="w-full h-full object-contain bg-smoke-dark" />
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
          {loading ? "Publication..." : initialData ? "Mettre à jour" : "Créer la catégorie"}
        </Button>
      </div>
    </form>
  );
}