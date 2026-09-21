import { apiClient, handleApiError } from "./client";
import { Story, StoryMediaType } from "@/types/story";

export interface CreateStoryItemData {
  mediaType: StoryMediaType;
  mediaUrl: string;
  duration?: number;
  linkUrl?: string;
  position?: number;
}

export interface CreateStoryData {
  title: string;
  coverUrl: string;
  position?: number;
  isActive?: boolean;
  items: CreateStoryItemData[];
}

export async function getStories(): Promise<Story[]> {
  try {
    const res = await apiClient.get("/stories");
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function getStory(id: string): Promise<Story> {
  try {
    const res = await apiClient.get(`/stories/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function createStory(data: CreateStoryData): Promise<Story> {
  try {
    const res = await apiClient.post("/stories", data);
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function updateStory(
  id: string,
  data: Partial<CreateStoryData>,
): Promise<Story> {
  try {
    const res = await apiClient.patch(`/stories/${id}`, data);
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function deleteStory(id: string): Promise<void> {
  try {
    await apiClient.delete(`/stories/${id}`);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}