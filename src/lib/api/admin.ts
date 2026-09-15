import { apiClient, handleApiError } from "./client";

export interface DashboardStats {
  totalCustomers: number;
  newCustomers: number;
  totalRevenue: number;
  revenueByCategory: { category: string; revenue: number }[];
  totalOrders: number;
  ordersByStatus: { status: string; count: number }[];
  totalReservations: number;
  reservationConfirmationRate: number;
  reservationNoShowRate: number;
  avgDeliveryTime: number;
  topProducts: { productId: string; productName: string; totalSold: number; revenue: number }[];
  driverPerformance: { driverId: string; driverName: string; deliveries: number; avgTime: number }[];
  videosPending: number;
  videosPublished: number;
  avgEngagement: number;
}

export async function getDashboardStats(from?: string, to?: string): Promise<DashboardStats> {
  try {
    const res = await apiClient.get("/admin/stats/dashboard", { params: { from, to } });
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function getRevenueByCategory(from?: string, to?: string): Promise<{ category: string; revenue: number }[]> {
  try {
    const res = await apiClient.get("/admin/stats/revenue-by-category", { params: { from, to } });
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function getTopProducts(limit = 10): Promise<{ productId: string; productName: string; totalSold: number; revenue: number }[]> {
  try {
    const res = await apiClient.get("/admin/stats/top-products", { params: { limit } });
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function getDriverPerformance(): Promise<{ driverId: string; driverName: string; deliveries: number; avgTime: number }[]> {
  try {
    const res = await apiClient.get("/admin/stats/driver-performance");
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function getAuditLog(params?: {
  userId?: string;
  entityType?: string;
  action?: string;
  page?: number;
  limit?: number;
}): Promise<{ id: string; action: string; entityType: string; userId: string; userName: string; oldValue: unknown; newValue: unknown; createdAt: string }[]> {
  try {
    const res = await apiClient.get("/admin/audit-log", { params });
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}