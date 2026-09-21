"use client";

import Link from "next/link";
import { useCategoryTree } from "@/hooks/use-categories";
import { deleteCategory } from "@/lib/api/categories";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, ChevronRight } from "lucide-react";

export default function CategoriesPage() {
  const { categories, loading, error, refetch } = useCategoryTree();

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Supprimer la catégorie "${name}" ? Cette action est irréversible.`)) return;
    try {
      await deleteCategory(id);
      refetch();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur lors de la suppression");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-smoke-white">Catégories</h1>
          <p className="text-sm text-smoke-muted mt-1">
            Gère les catégories et sous-catégories affichées dans le menu du site.
          </p>
        </div>

        <Link href="/categories/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle catégorie
          </Button>
        </Link>
      </div>

      {loading && <p className="text-sm text-smoke-muted">Chargement...</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}

      {!loading && !error && (
        <div className="bg-smoke-card border border-smoke-border rounded-xl overflow-hidden">
          {categories.length === 0 ? (
            <p className="p-6 text-sm text-smoke-muted">Aucune catégorie pour l'instant.</p>
          ) : (
            <ul className="divide-y divide-smoke-border">
              {categories.map((category) => (
                <li key={category.id}>
                  {/* CATÉGORIE RACINE */}
                  <div className="flex items-center justify-between px-5 py-4">
                    <div className="flex items-center gap-3 min-w-0">
                      {category.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={category.image}
                          alt={category.name}
                          className="h-10 w-10 rounded-lg object-cover border border-smoke-border shrink-0"
                        />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-smoke-white truncate">{category.name}</p>
                        <p className="text-xs text-smoke-muted truncate">/{category.slug}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link href={`/categories/${category.id}`}>
                        <button className="p-2 rounded-lg hover:bg-smoke-dark text-smoke-muted hover:text-smoke-white transition-colors">
                          <Pencil className="h-4 w-4" />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(category.id, category.name)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-smoke-muted hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* SOUS-CATÉGORIES */}
                  {category.children && category.children.length > 0 && (
                    <ul className="bg-smoke-dark/40">
                      {category.children.map((child) => (
                        <li
                          key={child.id}
                          className="flex items-center justify-between pl-10 pr-5 py-3 border-t border-smoke-border/50"
                        >
                          <div className="flex items-center gap-2 min-w-0 text-smoke-muted">
                            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                            <span className="text-sm text-smoke-white truncate">{child.name}</span>
                            <span className="text-xs text-smoke-muted truncate">/{child.slug}</span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <Link href={`/categories/${child.id}`}>
                              <button className="p-2 rounded-lg hover:bg-smoke-dark text-smoke-muted hover:text-smoke-white transition-colors">
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                            </Link>
                            <button
                              onClick={() => handleDelete(child.id, child.name)}
                              className="p-2 rounded-lg hover:bg-red-500/10 text-smoke-muted hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}