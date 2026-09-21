export type StoryMediaType = "IMAGE" | "VIDEO";

export interface StoryItem {
  id: string;
  mediaType: StoryMediaType;
  mediaUrl: string;
  duration?: number;
  linkUrl?: string | null;
  position: number;
}

export interface Story {
  id: string;
  title: string;
  coverUrl: string;
  position: number;
  isActive: boolean;
  items: StoryItem[];
  createdAt: string;
}