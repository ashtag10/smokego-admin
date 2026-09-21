import { apiClient, handleApiError } from "./client";
import { Slide } from "@/types/slide";

export interface CreateSlideData {
  title?: string;
  imageUrl: string;
  imageUrlMobile?: string;
  linkUrl?: string;
  position?: number;
  isActive?: boolean;
}

export async function getSlides(): Promise<Slide[]> {
  try {
    const res = await apiClient.get("/slides");
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function getSlide(id: string): Promise<Slide> {
  try {
    const res = await apiClient.get(`/slides/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function createSlide(data: CreateSlideData): Promise<Slide> {
  try {
    const res = await apiClient.post("/slides", data);
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function updateSlide(id: string, data: Partial<CreateSlideData>): Promise<Slide> {
  try {
    const res = await apiClient.put(`/slides/${id}`, data);
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function deleteSlide(id: string): Promise<void> {
  try {
    await apiClient.delete(`/slides/${id}`);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}