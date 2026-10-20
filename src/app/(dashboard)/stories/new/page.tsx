"use client";

import { useRouter } from "next/navigation";
import { StoryForm } from "@/components/stories/story-form";
import { createStory, CreateStoryData } from "@/lib/api/stories";

export default function NewStoryPage() {
  const router = useRouter();

  async function handleSubmit(data: CreateStoryData) {
    await createStory(data);
    router.push("/stories");
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold text-smoke-white">Nouvelle story</h1>
        <p className="text-sm text-smoke-muted mt-1">
          Une story peut contenir plusieurs images/vidéos qui s&apos;enchaînent.
        </p>
      </div>

      <StoryForm onSubmit={handleSubmit} />
    </div>
  );
}