import { apiClient, handleApiError } from "./client";

export interface TeamMember {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  adminRole: string;
  isActive: boolean;
  createdAt: string;
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const res = await apiClient.get("/users", { params: { role: "ADMIN" } });
    const data = res.data;
    return Array.isArray(data) ? data : data.users ?? data.data ?? [];
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}