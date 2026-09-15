import { apiClient, handleApiError } from "./client";
import { Driver, Delivery } from "@/types/driver";
import { PaginatedResponse } from "@/types/common";

export interface CreateDriverData {
  name: string;
  phone: string;
  email?: string;
  password: string;
}

export async function getDrivers(): Promise<Driver[]> {
  try {
    const res = await apiClient.get("/users?role=DRIVER");
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function getDriver(id: string): Promise<Driver> {
  try {
    const res = await apiClient.get(`/users/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function createDriver(data: CreateDriverData): Promise<Driver> {
  try {
    // ✅ Appelle POST /users (admin) au lieu de /auth/register
    const res = await apiClient.post("/users", { ...data, role: "DRIVER" });
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function updateDriver(id: string, data: Partial<CreateDriverData>): Promise<Driver> {
  try {
    const res = await apiClient.put(`/users/${id}`, data);
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function toggleDriverStatus(id: string, isActive: boolean): Promise<void> {
  try {
    await apiClient.put(`/users/${id}`, { isActive });
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function getDriverDeliveries(driverId: string): Promise<Delivery[]> {
  try {
    const res = await apiClient.get(`/delivery?driverId=${driverId}`);
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}