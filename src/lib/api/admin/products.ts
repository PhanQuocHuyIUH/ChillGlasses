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

const adminProductApi = {
  // =====================================
  // PRODUCT CRUD
  // =====================================

  getAllProducts: async (params: GetProductsParams = {}) => {
    const response = await axiosClient.get<
      ApiResponse<PageResponse<Product>>
    >("/products", { params });
    return response.data;
  },

  getProductById: async (id: number) => {
    const response = await axiosClient.get<ApiResponse<Product>>(
      `/products/${id}`
    );
    return response.data;
  },

  createProduct: async (data: CreateProductRequest) => {
    const response = await axiosClient.post<ApiResponse<Product>>(
      "/products",
      data
    );
    return response.data;
  },

  updateProduct: async (id: number, data: UpdateProductRequest) => {
    const response = await axiosClient.put<ApiResponse<Product>>(
      `/products/${id}`,
      data
    );
    return response.data;
  },

  deleteProduct: async (id: number) => {
    const response = await axiosClient.delete<ApiResponse<void>>(
      `/products/${id}`
    );
    return response.data;
  },

  activateProduct: async (id: number) => {
    const response = await axiosClient.patch<ApiResponse<Product>>(
      `/products/${id}/activate`
    );
    return response.data;
  },

  deactivateProduct: async (id: number) => {
    const response = await axiosClient.patch<ApiResponse<Product>>(
      `/products/${id}/deactivate`
    );
    return response.data;
  },

  // =====================================
  // PRODUCT IMAGES
  // =====================================

  /**
   * Upload images → Cloudinary
   * Save URLs → ProductImageController
   */
  uploadProductImages: async (productId: number, files: File[]) => {
    // 1. Upload images → /api/images/upload-multiple
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const uploadRes = await axiosClient.post(
      `/images/upload-multiple`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    if (!uploadRes.data.success) {
      throw new Error("Upload images failed");
    }

    const imageUrls: string[] = uploadRes.data.imageUrls || [];

    // 2. Save each image to product
    const saveRequests = imageUrls.map((url) =>
      axiosClient.post(`/products/${productId}/images`, null, {
        params: {
          imageUrl: url,
          isPrimary: true,
        },
      })
    );

    await Promise.all(saveRequests);

    return { success: true, imageUrls };
  },

  /**
   * Get all product images
   * GET /api/products/{id}/images
   */
  getProductImages: async (productId: number) => {
    return (
      await axiosClient.get(`/products/${productId}/images`)
    ).data;
  },

  /**
   * Delete image from product (not Cloudinary)
   * DELETE /api/products/images/{id}
   */
  deleteProductImage: async (imageId: number) => {
    return (
      await axiosClient.delete(`/products/images/${imageId}`)
    ).data;
  },

  /**
   * Set image primary
   * PUT /api/products/images/{imageId}/set-primary
   */
  setPrimaryImage: async (imageId: number) => {
    return (
      await axiosClient.put(
        `/products/images/${imageId}/set-primary`
      )
    ).data;
  },

  /**
   * Change display order
   * PUT /api/products/images/{imageId}/display-order
   */
  updateDisplayOrder: async (imageId: number, order: number) => {
    return (
      await axiosClient.put(
        `/products/images/${imageId}/display-order`,
        null,
        { params: { displayOrder: order } }
      )
    ).data;
  },

  /**
   * Delete image from Cloudinary
   * DELETE /api/images?url=...
   */
  deleteCloudImage: async (imageUrl: string) => {
    return (
      await axiosClient.delete(`/images`, {
        params: { url: imageUrl },
      })
    ).data;
  },
};

export default adminProductApi;
