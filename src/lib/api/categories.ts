import { apiClient, handleApiError } from "./client";
import { Category } from "@/types/category";

export interface CreateCategoryData {
  name: string;
  slug: string;
  parentId?: string | null;
  image?: string;
  position?: number;
}

export async function getCategories(params?: {
  parentId?: string | null;
  search?: string;
}): Promise<Category[]> {
  try {
    const res = await apiClient.get("/categories", { params });
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function getCategoryTree(): Promise<Category[]> {
  try {
    const res = await apiClient.get("/categories/menu");
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function getCategory(id: string): Promise<Category> {
  try {
    const res = await apiClient.get(`/categories/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function createCategory(
  data: CreateCategoryData,
): Promise<Category> {
  try {
    const res = await apiClient.post("/categories", data);
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function updateCategory(
  id: string,
  data: Partial<CreateCategoryData>,
): Promise<Category> {
  try {
    const res = await apiClient.patch(`/categories/${id}`, data);
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function deleteCategory(id: string): Promise<void> {
  try {
    await apiClient.delete(`/categories/${id}`);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}