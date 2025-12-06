import axiosClient from "../axios";
import type {
  ApiResponse,
  PageResponse,
  Product,
  ProductFilterRequest,
  CreateProductRequest,
  UpdateProductRequest,
  PaginationParams,
} from "@/types/admin";

export interface GetProductsParams
  extends Omit<PaginationParams, "sortDir">,
    ProductFilterRequest {}

/**
 * Admin Product API Service
 * Handles all product management operations
 */
const adminProductApi = {
  /**
   * Get all products with filters
   * GET /api/products
   */
  getAllProducts: async (params: GetProductsParams = {}) => {
    const response = await axiosClient.get<ApiResponse<PageResponse<Product>>>(
      "/products",
      { params }
    );
    return response.data;
  },

  /**
   * Get product by ID
   * GET /api/products/{id}
   */
  getProductById: async (id: number) => {
    const response = await axiosClient.get<ApiResponse<Product>>(
      `/products/${id}`
    );
    return response.data;
  },

  /**
   * Create new product (Admin only)
   * POST /api/products
   */
  createProduct: async (data: CreateProductRequest) => {
    const response = await axiosClient.post<ApiResponse<Product>>(
      "/products",
      data
    );
    return response.data;
  },

  /**
   * Update product (Admin only)
   * PUT /api/products/{id}
   */
  updateProduct: async (id: number, data: UpdateProductRequest) => {
    const response = await axiosClient.put<ApiResponse<Product>>(
      `/products/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Delete product (Admin only)
   * DELETE /api/products/{id}
   */
  deleteProduct: async (id: number) => {
    const response = await axiosClient.delete<ApiResponse<void>>(
      `/products/${id}`
    );
    return response.data;
  },

  /**
   * Activate product (Admin only)
   * PATCH /api/products/{id}/activate
   */
  activateProduct: async (id: number) => {
    const response = await axiosClient.patch<ApiResponse<Product>>(
      `/products/${id}/activate`
    );
    return response.data;
  },

  /**
   * Deactivate product (Admin only)
   * PATCH /api/products/{id}/deactivate
   */
  deactivateProduct: async (id: number) => {
    const response = await axiosClient.patch<ApiResponse<Product>>(
      `/products/${id}/deactivate`
    );
    return response.data;
  },

  /**
   * Upload product images (Admin only)
   * POST /api/products/{id}/images
   */
  uploadProductImages: async (productId: number, files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await axiosClient.post<ApiResponse<Product>>(
      `/products/${productId}/images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  /**
   * Delete product image (Admin only)
   * DELETE /api/products/images/{imageId}
   */
  deleteProductImage: async (imageId: number) => {
    const response = await axiosClient.delete<ApiResponse<void>>(
      `/products/images/${imageId}`
    );
    return response.data;
  },

  /**
   * Set primary product image (Admin only)
   * PATCH /api/products/images/{imageId}/primary
   */
  setPrimaryImage: async (imageId: number) => {
    const response = await axiosClient.patch<ApiResponse<void>>(
      `/products/images/${imageId}/primary`
    );
    return response.data;
  },
};

export default adminProductApi;
