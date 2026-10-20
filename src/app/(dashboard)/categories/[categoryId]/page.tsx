"use client";

import { useRouter, useParams } from "next/navigation";
import { CategoryForm } from "@/components/categories/category-form";
import { useCategory } from "@/hooks/use-categories";
import { updateCategory, CreateCategoryData } from "@/lib/api/categories";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams<{ categoryId: string }>();
  const { category, loading, error } = useCategory(params.categoryId);

  async function handleSubmit(data: Partial<CreateCategoryData>) {
    await updateCategory(params.categoryId, data);
    router.push("/categories");
  }

  if (loading) return <p className="text-sm text-smoke-muted">Chargement...</p>;
  if (error || !category) return <p className="text-sm text-red-400">{error ?? "Catégorie introuvable"}</p>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold text-smoke-white">Modifier la catégorie</h1>
        <p className="text-sm text-smoke-muted mt-1">{category.name}</p>
      </div>

      <CategoryForm initialData={category} onSubmit={handleSubmit} />
    </div>
  );
}