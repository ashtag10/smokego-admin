export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type Role = "CLIENT" | "DRIVER" | "ADMIN";
export type AdminRole = "SUPER_ADMIN" | "CATALOG_ADMIN" | "ORDERS_ADMIN" | "MODERATOR";

export type OrderStatus = 
  | "PENDING" | "ACCEPTED" | "PREPARING" | "PICKED_UP" 
  | "IN_TRANSIT" | "DELIVERED" | "CANCELLED";

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";
export type PaymentMethod = "MTN_MOMO" | "ORANGE_MONEY" | "CARD";

export type DeliveryStatus = 
  | "ACCEPTED" | "PREPARING" | "PICKED_UP" | "IN_TRANSIT" | "DELIVERED";

export type ReservationStatus = 
  | "PENDING" | "CONFIRMED" | "REJECTED" | "COMPLETED" | "CANCELLED";

export type VideoStatus = "PENDING" | "APPROVED" | "REJECTED";