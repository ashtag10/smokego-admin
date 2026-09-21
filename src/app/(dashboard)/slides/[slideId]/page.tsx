"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SlideForm } from "@/components/slides/slide-form";
import { getSlide, updateSlide, CreateSlideData } from "@/lib/api/slides";
import { Slide } from "@/types/slide";

export default function EditSlidePage() {
  const router = useRouter();
  const params = useParams<{ slideId: string }>();

  const [slide, setSlide] = useState<Slide | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSlide(params.slideId)
      .then(setSlide)
      .catch((err) => setError(err instanceof Error ? err.message : "Erreur"))
      .finally(() => setLoading(false));
  }, [params.slideId]);

  async function handleSubmit(data: Partial<CreateSlideData>) {
    await updateSlide(params.slideId, data);
    router.push("/slides");
  }

  if (loading) return <p className="text-sm text-smoke-muted">Chargement...</p>;
  if (error || !slide) return <p className="text-sm text-red-400">{error ?? "Slide introuvable"}</p>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold text-smoke-white">Modifier le slide</h1>
      </div>

      <SlideForm initialData={slide} onSubmit={handleSubmit} />
    </div>
  );
}