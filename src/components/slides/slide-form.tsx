"use client";

import { useState, useCallback } from "react";
import { Slide } from "@/types/slide";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateSlideData } from "@/lib/api/slides";
import { apiClient } from "@/lib/api/client";
import { Upload, X } from "lucide-react";

interface SlideFormProps {
  initialData?: Slide;
  onSubmit: (data: CreateSlideData) => Promise<void>;
}

export function SlideForm({ initialData, onSubmit }: SlideFormProps) {
  const [form, setForm] = useState<CreateSlideData>({
    title: initialData?.title ?? "",
    imageUrl: initialData?.imageUrl ?? "",
    imageUrlMobile: initialData?.imageUrlMobile ?? "",
    linkUrl: initialData?.linkUrl ?? "",
    position: initialData?.position ?? 0,
    isActive: initialData?.isActive ?? true,
  });

  const [desktopFile, setDesktopFile] = useState<File | null>(null);
  const [desktopPreview, setDesktopPreview] = useState(initialData?.imageUrl ?? "");

  const [mobileFile, setMobileFile] = useState<File | null>(null);
  const [mobilePreview, setMobilePreview] = useState(initialData?.imageUrlMobile ?? "");

  const [loading, setLoading] = useState(false);

  function updateField<K extends keyof CreateSlideData>(field: K, value: CreateSlideData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const validateAndSet = (
    file: File | undefined,
    setFile: (f: File | null) => void,
    setPreview: (u: string) => void,
  ) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Image trop volumineuse (max 5 Mo)");
      return;
    }
    if (!file.type.match(/image\/(jpeg|jpg|png|webp)/)) {
      alert("Format accepté : JPG, PNG, WEBP");
      return;
    }
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDesktopChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    validateAndSet(e.target.files?.[0], setDesktopFile, setDesktopPreview);
  }, []);

  const handleMobileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    validateAndSet(e.target.files?.[0], setMobileFile, setMobilePreview);
  }, []);

  async function uploadIfNeeded(file: File | null, existingUrl: string) {
    if (!file) return existingUrl;
    const fd = new FormData();
    fd.append("file", file);
    const res = await apiClient.post("/media/image", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.url as string;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const imageUrl = await uploadIfNeeded(desktopFile, form.imageUrl);
      const imageUrlMobile = await uploadIfNeeded(mobileFile, form.imageUrlMobile ?? "");

      await onSubmit({ ...form, imageUrl, imageUrlMobile: imageUrlMobile || undefined });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-smoke-card border border-smoke-border rounded-xl p-6 space-y-5">
      <Input
        label="Titre (optionnel, non affiché sur le site)"
        value={form.title ?? ""}
        onChange={(e) => updateField("title", e.target.value)}
      />

      <Input
        label="Lien au clic (optionnel)"
        value={form.linkUrl ?? ""}
        onChange={(e) => updateField("linkUrl", e.target.value)}
        placeholder="/shop?collection=packs"
      />

      <Input
        label="Position (ordre d'affichage)"
        type="number"
        value={form.position ?? 0}
        onChange={(e) => updateField("position", parseInt(e.target.value) || 0)}
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          checked={form.isActive ?? true}
          onChange={(e) => updateField("isActive", e.target.checked)}
          className="h-4 w-4 rounded border-smoke-border text-smoke-gold"
        />
        <label htmlFor="isActive" className="text-sm text-smoke-white">
          Slide actif (visible sur le site)
        </label>
      </div>

      {/* IMAGE DESKTOP */}
      <div>
        <label className="block text-sm font-medium text-smoke-white mb-1.5">
          Image desktop *
        </label>
        {!desktopPreview ? (
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-smoke-border rounded-xl cursor-pointer hover:border-smoke-gold/50 hover:bg-smoke-gold/5 transition-colors">
            <div className="flex flex-col items-center gap-2 text-smoke-muted">
              <Upload className="h-6 w-6" />
              <span className="text-sm">Format large (ex: 1920×600)</span>
              <span className="text-xs">JPG, PNG, WEBP — max 5 Mo</span>
            </div>
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleDesktopChange} className="hidden" />
          </label>
        ) : (
          <div className="relative w-full h-32 rounded-xl overflow-hidden border border-smoke-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={desktopPreview} alt="Preview desktop" className="w-full h-full object-cover bg-smoke-dark" />
            <button
              type="button"
              onClick={() => {
                setDesktopFile(null);
                setDesktopPreview("");
                updateField("imageUrl", "");
              }}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* IMAGE MOBILE */}
      <div>
        <label className="block text-sm font-medium text-smoke-white mb-1.5">
          Image mobile (optionnel — sinon la version desktop sera utilisée)
        </label>
        {!mobilePreview ? (
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-smoke-border rounded-xl cursor-pointer hover:border-smoke-gold/50 hover:bg-smoke-gold/5 transition-colors">
            <div className="flex flex-col items-center gap-2 text-smoke-muted">
              <Upload className="h-6 w-6" />
              <span className="text-sm">Format portrait (ex: 800×1000)</span>
              <span className="text-xs">JPG, PNG, WEBP — max 5 Mo</span>
            </div>
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleMobileChange} className="hidden" />
          </label>
        ) : (
          <div className="relative w-full max-w-[200px] h-40 rounded-xl overflow-hidden border border-smoke-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mobilePreview} alt="Preview mobile" className="w-full h-full object-cover bg-smoke-dark" />
            <button
              type="button"
              onClick={() => {
                setMobileFile(null);
                setMobilePreview("");
                updateField("imageUrlMobile", "");
              }}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Publication..." : initialData ? "Mettre à jour" : "Créer le slide"}
        </Button>
      </div>
    </form>
  );
}