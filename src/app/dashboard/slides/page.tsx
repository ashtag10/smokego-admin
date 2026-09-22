"use client";

import Link from "next/link";
import { useSlides } from "@/hooks/use-slides";
import { deleteSlide } from "@/lib/api/slides";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function SlidesPage() {
  const { slides, loading, error, refetch } = useSlides();

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce slide ?")) return;
    try {
      await deleteSlide(id);
      refetch();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur lors de la suppression");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-smoke-white">Slides</h1>
          <p className="text-sm text-smoke-muted mt-1">
            Le bandeau d&apos;images en haut de la page d&apos;accueil.
          </p>
        </div>

        <Link href="/slides/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouveau slide
          </Button>
        </Link>
      </div>

      {loading && <p className="text-sm text-smoke-muted">Chargement...</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {slides.length === 0 && (
            <p className="text-sm text-smoke-muted col-span-full">
              Aucun slide pour l&apos;instant.
            </p>
          )}

          {slides
            .slice()
            .sort((a, b) => a.position - b.position)
            .map((slide) => (
              <div
                key={slide.id}
                className="bg-smoke-card border border-smoke-border rounded-xl overflow-hidden"
              >
                <div className="relative aspect-[16/6] bg-smoke-dark">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={slide.imageUrl} alt={slide.title ?? "Slide"} className="w-full h-full object-cover" />
                  {!slide.isActive && (
                    <span className="absolute top-2 left-2 rounded-full bg-black/70 px-2 py-1 text-[10px] font-medium text-white">
                      Inactif
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between p-3">
                  <p className="text-xs text-smoke-muted truncate">
                    {slide.title || `Position ${slide.position}`}
                  </p>

                  <div className="flex items-center gap-1 shrink-0">
                    <Link href={`/slides/${slide.id}`}>
                      <button className="p-2 rounded-lg hover:bg-smoke-dark text-smoke-muted hover:text-smoke-white transition-colors">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(slide.id)}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-smoke-muted hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}