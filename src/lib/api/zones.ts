import { apiClient, handleApiError } from "./client";

export interface Zone {
  id: string;
  name: string;
  city: string;
  district: string;
  fee: number;
  isActive?: boolean;
}

export interface CreateZoneData {
  city: string;
  district: string;
  fee: number;
}

export async function getZones(): Promise<Zone[]> {
  try {
    const res = await apiClient.get("/delivery/zones");
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function createZone(data: CreateZoneData): Promise<Zone> {
  try {
    const res = await apiClient.post("/delivery/zones", data);
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function deleteZone(id: string): Promise<void> {
  try {
    await apiClient.delete(`/delivery/zones/${id}`);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}