import { apiClient, handleApiError } from "./client";
import { Video, Report } from "@/types/video";
import { PaginatedResponse } from "@/types/common";

export async function getVideos(params?: {
  status?: string;
  isAdminVideo?: boolean;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<Video>> {
  try {
    const res = await apiClient.get("/videos/feed", { params });
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function createVideo(data: {
  videoUrl: string;
  thumbnail: string;
  description?: string;
  hashtags?: string[];
  isAdminVideo?: boolean;
}): Promise<Video> {
  try {
    const res = await apiClient.post("/videos", data);
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

// ← CORRIGÉ : appelle les vraies routes du backend
export async function approveVideo(id: string): Promise<void> {
  try {
    await apiClient.put(`/videos/${id}/approve`);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function rejectVideo(id: string, reason?: string): Promise<void> {
  try {
    await apiClient.put(`/videos/${id}/reject`, { reason });
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function pinVideo(id: string, pinnedUntil?: string): Promise<void> {
  try {
    await apiClient.put(`/videos/${id}/pin`, { pinnedUntil });
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function deleteVideo(id: string): Promise<void> {
  try {
    await apiClient.delete(`/videos/${id}`);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function getReports(): Promise<Report[]> {
  try {
    const res = await apiClient.get("/community/reports");
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function resolveReport(id: string, action: "RESOLVED" | "DISMISSED"): Promise<void> {
  try {
    await apiClient.put(`/community/reports/${id}`, { status: action });
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function getModerationQueue(limit = 50): Promise<Video[]> {
  try {
    const res = await apiClient.get(`/videos/moderation-queue?limit=${limit}`);
    return res.data?.videos ?? res.data ?? [];
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}