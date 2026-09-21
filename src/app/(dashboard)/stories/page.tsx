"use client";

import Link from "next/link";
import { useStories } from "@/hooks/use-stories";
import { deleteStory } from "@/lib/api/stories";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function StoriesPage() {
  const { stories, loading, error, refetch } = useStories();

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette story ?")) return;
    try {
      await deleteStory(id);
      refetch();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur lors de la suppression");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-smoke-white">Stories</h1>
          <p className="text-sm text-smoke-muted mt-1">
            Les vignettes vidéo/image affichées sous la navbar du site.
          </p>
        </div>

        <Link href="/stories/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle story
          </Button>
        </Link>
      </div>

      {loading && <p className="text-sm text-smoke-muted">Chargement...</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {stories.length === 0 && (
            <p className="text-sm text-smoke-muted col-span-full">Aucune story pour l'instant.</p>
          )}

          {stories
            .slice()
            .sort((a, b) => a.position - b.position)
            .map((story) => (
              <div key={story.id} className="bg-smoke-card border border-smoke-border rounded-xl overflow-hidden">
                <div className="relative aspect-[3/4] bg-smoke-dark">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={story.coverUrl} alt={story.title} className="w-full h-full object-cover" />
                  {!story.isActive && (
                    <span className="absolute top-2 left-2 rounded-full bg-black/70 px-2 py-1 text-[10px] font-medium text-white">
                      Inactive
                    </span>
                  )}
                  <span className="absolute bottom-2 right-2 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white">
                    {story.items.length} élément{story.items.length > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5">
                  <p className="text-xs text-smoke-muted truncate">{story.title}</p>

                  <div className="flex items-center gap-1 shrink-0">
                    <Link href={`/stories/${story.id}`}>
                      <button className="p-1.5 rounded-lg hover:bg-smoke-dark text-smoke-muted hover:text-smoke-white transition-colors">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(story.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-smoke-muted hover:text-red-400 transition-colors"
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