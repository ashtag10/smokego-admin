"use client";

import { useState, useCallback, useMemo } from "react";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateProductData } from "@/lib/api/products";
import { apiClient } from "@/lib/api/client";
import { useCategoryTree } from "@/hooks/use-categories";
import { Upload, X } from "lucide-react";

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: CreateProductData) => Promise<void>;
}

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function ProductForm({
  initialData,
  onSubmit,
}: ProductFormProps) {
  const { categories, loading: categoriesLoading } = useCategoryTree();

  const [form, setForm] = useState<CreateProductData>({
    name: initialData?.name ?? "",
    description: initialData?.description ?? "",
    price: initialData ? parseFloat(initialData.price) : 0,
    promoPrice: initialData?.promoPrice
      ? parseFloat(initialData.promoPrice)
      : undefined,
    categoryId: initialData?.categoryId ?? "",
    subcategoryId: initialData?.subcategoryId ?? undefined,
    brand: initialData?.brand ?? "",
    images: initialData?.images ?? [],
    stock: initialData?.stock ?? 0,
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    initialData?.images ?? [],
  );

  const [loading, setLoading] = useState(false);

  function updateField<K extends keyof CreateProductData>(
    field: K,
    value: CreateProductData[K],
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  const subcategories = useMemo(() => {
    const parent = categories.find(
      (c) => c.id === form.categoryId,
    );

    return parent?.children ?? [];
  }, [categories, form.categoryId]);

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);

      if (!files.length) return;

      const currentCount = imagePreviews.length;
      const availableSlots = MAX_IMAGES - currentCount;

      if (availableSlots <= 0) {
        alert(`Vous pouvez ajouter au maximum ${MAX_IMAGES} images.`);
        e.target.value = "";
        return;
      }

      const selectedFiles = files.slice(0, availableSlots);

      if (files.length > availableSlots) {
        alert(
          `Vous pouvez ajouter au maximum ${MAX_IMAGES} images. Seules les ${availableSlots} premières seront ajoutées.`,
        );
      }

      const validFiles: File[] = [];

      for (const file of selectedFiles) {
        if (file.size > MAX_FILE_SIZE) {
          alert(
            `L'image "${file.name}" est trop volumineuse. Maximum 5 Mo.`,
          );
          continue;
        }

        if (!file.type.match(/image\/(jpeg|jpg|png|webp)/)) {
          alert(
            `Le fichier "${file.name}" n'est pas valide. Formats acceptés : JPG, PNG, WEBP.`,
          );
          continue;
        }

        validFiles.push(file);
      }

      if (!validFiles.length) {
        e.target.value = "";
        return;
      }

      const newPreviews = validFiles.map((file) =>
        URL.createObjectURL(file),
      );

      setImageFiles((prev) => [...prev, ...validFiles]);
      setImagePreviews((prev) => [...prev, ...newPreviews]);

      e.target.value = "";
    },
    [imagePreviews.length],
  );

  const removeImage = useCallback(
    (index: number) => {
      const isExistingImage =
        index < (initialData?.images?.length ?? 0);

      if (isExistingImage) {
        const updatedImages = [...form.images];
        updatedImages.splice(index, 1);

        const updatedPreviews = [...imagePreviews];
        updatedPreviews.splice(index, 1);

        setImagePreviews(updatedPreviews);
        updateField("images", updatedImages);

        return;
      }

      const existingImagesCount =
        initialData?.images?.length ?? 0;

      const fileIndex = index - existingImagesCount;

      if (fileIndex >= 0) {
        const updatedFiles = [...imageFiles];
        updatedFiles.splice(fileIndex, 1);

        setImageFiles(updatedFiles);
      }

      const updatedPreviews = [...imagePreviews];
      const previewUrl = updatedPreviews[index];

      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }

      updatedPreviews.splice(index, 1);

      setImagePreviews(updatedPreviews);
    },
    [
      form.images,
      imageFiles,
      imagePreviews,
      initialData?.images,
    ],
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (imagePreviews.length === 0) {
      alert("Veuillez ajouter au moins une image.");
      return;
    }

    if (imagePreviews.length > MAX_IMAGES) {
      alert(`Vous pouvez avoir au maximum ${MAX_IMAGES} images.`);
      return;
    }

    setLoading(true);

    try {
      const uploadedUrls: string[] = [...form.images];

      for (const file of imageFiles) {
        const fd = new FormData();
        fd.append("file", file);

        const res = await apiClient.post(
          "/media/image",
          fd,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            timeout: 120000,
          },
        );

        const imageUrl = res.data?.url;

        if (!imageUrl || typeof imageUrl !== "string") {
          throw new Error(
            "Le serveur n'a pas retourné l'URL de l'image.",
          );
        }

        uploadedUrls.push(imageUrl);
      }

      const finalImages = uploadedUrls.slice(0, MAX_IMAGES);

      await onSubmit({
        ...form,
        images: finalImages,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-smoke-card border border-smoke-border rounded-xl p-6 space-y-5"
    >
      <Input
        label="Nom du produit"
        value={form.name}
        onChange={(e) =>
          updateField("name", e.target.value)
        }
        required
      />

      <div>
        <label className="block text-sm font-medium text-smoke-white mb-1.5">
          Description
        </label>

        <textarea
          value={form.description}
          onChange={(e) =>
            updateField("description", e.target.value)
          }
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
          onChange={(e) =>
            updateField(
              "price",
              parseFloat(e.target.value),
            )
          }
          required
        />

        <Input
          label="Prix promo (optionnel)"
          type="number"
          value={form.promoPrice ?? ""}
          onChange={(e) =>
            updateField(
              "promoPrice",
              e.target.value
                ? parseFloat(e.target.value)
                : undefined,
            )
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-smoke-white mb-1.5">
            Catégorie
          </label>

          <select
            value={form.categoryId}
            onChange={(e) => {
              updateField("categoryId", e.target.value);
              updateField(
                "subcategoryId",
                undefined,
              );
            }}
            disabled={categoriesLoading}
            className="w-full bg-smoke-card border border-smoke-border rounded-lg px-4 py-2.5 text-sm text-smoke-white focus:outline-none focus:border-smoke-gold/50"
            required
          >
            <option value="" disabled>
              {categoriesLoading
                ? "Chargement..."
                : "Choisir une catégorie"}
            </option>

            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-smoke-white mb-1.5">
            Sous-catégorie
          </label>

          <select
            value={form.subcategoryId ?? ""}
            onChange={(e) =>
              updateField(
                "subcategoryId",
                e.target.value || undefined,
              )
            }
            disabled={
              !form.categoryId ||
              subcategories.length === 0
            }
            className="w-full bg-smoke-card border border-smoke-border rounded-lg px-4 py-2.5 text-sm text-smoke-white focus:outline-none focus:border-smoke-gold/50 disabled:opacity-40"
          >
            <option value="">
              {subcategories.length === 0
                ? "Aucune sous-catégorie"
                : "Aucune (optionnel)"}
            </option>

            {subcategories.map((sc) => (
              <option key={sc.id} value={sc.id}>
                {sc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Input
        label="Marque"
        value={form.brand}
        onChange={(e) =>
          updateField("brand", e.target.value)
        }
      />

      <Input
        label="Stock"
        type="number"
        value={form.stock}
        onChange={(e) =>
          updateField(
            "stock",
            parseInt(e.target.value),
          )
        }
        required
      />

      {/* IMAGES */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-sm font-medium text-smoke-white">
            Images du produit *
          </label>

          <span className="text-xs text-smoke-muted">
            {imagePreviews.length}/{MAX_IMAGES}
          </span>
        </div>

        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-4">
            {imagePreviews.map((preview, index) => (
              <div
                key={`${preview}-${index}`}
                className="relative aspect-square rounded-xl overflow-hidden border border-smoke-border bg-smoke-dark"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-contain"
                />

                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-xs">
                  {index + 1}
                </div>

                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {imagePreviews.length < MAX_IMAGES && (
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-smoke-border rounded-xl cursor-pointer hover:border-smoke-gold/50 hover:bg-smoke-gold/5 transition-colors">
            <div className="flex flex-col items-center gap-2 text-smoke-muted">
              <Upload className="h-6 w-6" />

              <span className="text-sm">
                Cliquez pour ajouter des images
              </span>

              <span className="text-xs">
                JPG, PNG, WEBP — max 5 Mo/image
              </span>

              <span className="text-xs">
               Jusqu&apos;à {MAX_IMAGES} images
              </span>
            </div>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading
            ? "Publication..."
            : initialData
              ? "Mettre à jour"
              : "Créer le produit"}
        </Button>
      </div>
    </form>
  );
}