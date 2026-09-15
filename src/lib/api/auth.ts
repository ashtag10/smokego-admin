import { apiClient, handleApiError } from "./client";

export interface LoginCredentials {
  phone?: string;
  email?: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    role: string;
    adminRole?: string;
    isActive: boolean;
  };
  accessToken: string;
  refreshToken: string;
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const res = await apiClient.post<AuthResponse>("/auth/login", credentials);
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function logout(refreshToken: string): Promise<void> {
  try {
    await apiClient.post("/auth/logout", {}, {
      headers: { "x-refresh-token": refreshToken },
    });
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}