"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { StoryForm } from "@/components/stories/story-form";
import { getStory, updateStory, CreateStoryData } from "@/lib/api/stories";
import { Story } from "@/types/story";

export default function EditStoryPage() {
  const router = useRouter();
  const params = useParams<{ storyId: string }>();

  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getStory(params.storyId)
      .then(setStory)
      .catch((err) => setError(err instanceof Error ? err.message : "Erreur"))
      .finally(() => setLoading(false));
  }, [params.storyId]);

  async function handleSubmit(data: Partial<CreateStoryData>) {
    await updateStory(params.storyId, data as CreateStoryData);
    router.push("/stories");
  }

  if (loading) return <p className="text-sm text-smoke-muted">Chargement...</p>;
  if (error || !story) return <p className="text-sm text-red-400">{error ?? "Story introuvable"}</p>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold text-smoke-white">Modifier la story</h1>
      </div>

      <StoryForm initialData={story} onSubmit={handleSubmit} />
    </div>
  );
}