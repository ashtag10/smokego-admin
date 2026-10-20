"use client";

import { useRouter } from "next/navigation";
import { CategoryForm } from "@/components/categories/category-form";
import { createCategory, CreateCategoryData } from "@/lib/api/categories";

export default function NewCategoryPage() {
  const router = useRouter();

  async function handleSubmit(data: CreateCategoryData) {
    await createCategory(data);
    router.push("/categories");
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold text-smoke-white">Nouvelle catégorie</h1>
        <p className="text-sm text-smoke-muted mt-1">
          Crée une catégorie racine ou une sous-catégorie.
        </p>
      </div>

      <CategoryForm onSubmit={handleSubmit} />
    </div>
  );
}