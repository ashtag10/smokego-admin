import { apiClient, handleApiError } from "./client";
import { Reservation, Table } from "@/types/reservation";
import { PaginatedResponse } from "@/types/common";

export async function getReservations(params?: {
  status?: string;
  date?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<Reservation>> {
  try {
    const res = await apiClient.get("/reservations", { params });
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function getReservation(id: string): Promise<Reservation> {
  try {
    const res = await apiClient.get(`/reservations/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function confirmReservation(id: string): Promise<void> {
  try {
    await apiClient.put(`/reservations/${id}/confirm`);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function rejectReservation(id: string, reason?: string): Promise<void> {
  try {
    await apiClient.put(`/reservations/${id}/reject`, { reason });
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function checkInReservation(token: string): Promise<void> {
  try {
    await apiClient.post("/reservations/check-in", { qrCodeToken: token });
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function getTables(): Promise<Table[]> {
  try {
    const res = await apiClient.get("/reservations/tables");
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function createTable(data: { name: string; capacity: number }): Promise<Table> {
  try {
    const res = await apiClient.post("/reservations/tables", data);
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}