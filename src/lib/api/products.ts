import { apiClient, handleApiError } from "./client";
import { Product } from "@/types/product";
import { PaginatedResponse } from "@/types/common";

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  promoPrice?: number;
  promoStart?: string;
  promoEnd?: string;
  category: string;
  brand?: string;
  images: string[];
  stock: number;
  variants?: { name: string; price: number; stock: number }[];
}

export async function getProducts(params?: {
  category?: string;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<Product>> {
  try {
    const res = await apiClient.get("/products", { params });
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function getProduct(id: string): Promise<Product> {
  try {
    const res = await apiClient.get(`/products/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function createProduct(data: CreateProductData): Promise<Product> {
  try {
    const res = await apiClient.post("/products", data);
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function updateProduct(id: string, data: Partial<CreateProductData>): Promise<Product> {
  try {
    const res = await apiClient.put(`/products/${id}`, data);
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    await apiClient.delete(`/products/${id}`);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function updateStock(id: string, adjustment: number, reason: string): Promise<void> {
  try {
    await apiClient.put(`/products/${id}/stock`, { adjustment, reason });
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}