import axiosClient from "../axios";
import type { ApiResponse, Category, CategoryRequest } from "@/types/admin";

/**
 * Admin Category API Service
 * Handles all category management operations
 */
const adminCategoryApi = {
  /**
   * Get all categories
   * GET /api/categories
   */
  getAllCategories: async () => {
    const response = await axiosClient.get<ApiResponse<Category[]>>(
      "/categories"
    );
    return response.data;
  },

  /**
   * Get category by ID
   * GET /api/categories/{id}
   */
  getCategoryById: async (id: number) => {
    const response = await axiosClient.get<ApiResponse<Category>>(
      `/categories/${id}`
    );
    return response.data;
  },

  /**
   * Create new category (Admin only)
   * POST /api/categories
   */
  createCategory: async (data: CategoryRequest) => {
    const response = await axiosClient.post<ApiResponse<Category>>(
      "/categories",
      data
    );
    return response.data;
  },

  /**
   * Update category (Admin only)
   * PUT /api/categories/{id}
   */
  updateCategory: async (id: number, data: CategoryRequest) => {
    const response = await axiosClient.put<ApiResponse<Category>>(
      `/categories/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Delete category (Admin only)
   * DELETE /api/categories/{id}
   */
  deleteCategory: async (id: number) => {
    const response = await axiosClient.delete<ApiResponse<void>>(
      `/categories/${id}`
    );
    return response.data;
  },

  /**
   * Activate category (Admin only)
   * PATCH /api/categories/{id}/activate
   */
  activateCategory: async (id: number) => {
    const response = await axiosClient.patch<ApiResponse<Category>>(
      `/categories/${id}/activate`
    );
    return response.data;
  },

  /**
   * Deactivate category (Admin only)
   * PATCH /api/categories/{id}/deactivate
   */
  deactivateCategory: async (id: number) => {
    const response = await axiosClient.patch<ApiResponse<Category>>(
      `/categories/${id}/deactivate`
    );
    return response.data;
  },
};

export default adminCategoryApi;
