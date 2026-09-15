import { apiClient, handleApiError } from "./client";

export interface LoyaltySettings {
  id?: string;
  pointsPer100FCFA: number;
  vipThreshold: number;
  maxPointsPerOrder: number;
  conversionRate: number;
  maxUsagePercent: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  note?: string;
}

export async function getLoyaltySettings(): Promise<LoyaltySettings> {
  try {
    const res = await apiClient.get("/loyalty/settings");
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function updateLoyaltySettings(data: {
  pointsPer100FCFA?: number;
  vipThreshold?: number;
  maxPointsPerOrder?: number;
  conversionRate?: number;
  maxUsagePercent?: number;
}): Promise<LoyaltySettings> {
  try {
    const res = await apiClient.post("/loyalty/settings", data);
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function evaluateVip(): Promise<void> {
  try {
    await apiClient.post("/loyalty/evaluate-all");
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function revokeVip(userId: string): Promise<void> {
  try {
    await apiClient.post(`/loyalty/revoke-vip/${userId}`);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}