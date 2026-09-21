"use client";

import { useRouter } from "next/navigation";
import { SlideForm } from "@/components/slides/slide-form";
import { createSlide, CreateSlideData } from "@/lib/api/slides";

export default function NewSlidePage() {
  const router = useRouter();

  async function handleSubmit(data: CreateSlideData) {
    await createSlide(data);
    router.push("/slides");
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold text-smoke-white">Nouveau slide</h1>
        <p className="text-sm text-smoke-muted mt-1">Ajoute une image au bandeau de la page d'accueil.</p>
      </div>

      <SlideForm onSubmit={handleSubmit} />
    </div>
  );
}