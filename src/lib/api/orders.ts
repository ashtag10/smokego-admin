import { apiClient, handleApiError } from "./client";
import { Order } from "@/types/order";
import { PaginatedResponse } from "@/types/common";

export async function getOrders(params?: {
  status?: string;
  paymentStatus?: string;
  date?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<Order>> {
  try {
    const res = await apiClient.get("/orders", { params });
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function getOrder(id: string): Promise<Order> {
  try {
    const res = await apiClient.get(`/orders/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function assignDriver(orderId: string, driverId: string): Promise<void> {
  try {
    await apiClient.put(`/orders/${orderId}/assign-driver`, { driverId });
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function updateOrderStatus(orderId: string, status: string): Promise<void> {
  try {
    await apiClient.put(`/orders/${orderId}/status`, { status });
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}