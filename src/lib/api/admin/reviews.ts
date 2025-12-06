import axiosClient from "../axios";
import type {
  ApiResponse,
  PageResponse,
  Review,
  ReviewStatus,
  UpdateReviewStatusRequest,
  PaginationParams,
} from "@/types/admin";

export interface GetReviewsParams extends PaginationParams {
  productId?: number;
  status?: ReviewStatus;
  rating?: number;
}

/**
 * Admin Review API Service
 * Handles all review management operations
 */
const adminReviewApi = {
  /**
   * Get all reviews with filtering (Admin only)
   * GET /api/reviews/admin/pending
   */
  getAllReviews: async (params: GetReviewsParams = {}) => {
    const response = await axiosClient.get<ApiResponse<PageResponse<Review>>>(
      "/reviews/admin/pending",
      { params }
    );
    return response.data;
  },

  /**
   * Get review by ID (Admin only)
   * GET /api/reviews/{id} (assuming this exists)
   */
  getReviewById: async (id: number) => {
    const response = await axiosClient.get<ApiResponse<Review>>(
      `/reviews/${id}`
    );
    return response.data;
  },

  /**
   * Update review status (Admin only)
   * PATCH /api/admin/reviews/{id}/status
   */
  updateReviewStatus: async (id: number, data: UpdateReviewStatusRequest) => {
    const response = await axiosClient.patch<ApiResponse<Review>>(
      `/admin/reviews/${id}/status`,
      data
    );
    return response.data;
  },

  /**
   * Approve review (Admin only)
   * POST /api/reviews/{id}/approve
   */
  approveReview: async (id: number) => {
    const response = await axiosClient.post<ApiResponse<Review>>(
      `/reviews/${id}/approve`
    );
    return response.data;
  },

  /**
   * Reject review (Admin only)
   * POST /api/reviews/{id}/reject
   */
  rejectReview: async (id: number, reason?: string) => {
    const response = await axiosClient.post<ApiResponse<Review>>(
      `/reviews/${id}/reject`,
      reason ? { reason } : {}
    );
    return response.data;
  },

  /**
   * Delete review (Admin only)
   * DELETE /api/reviews/{id}
   */
  deleteReview: async (id: number) => {
    const response = await axiosClient.delete<ApiResponse<void>>(
      `/reviews/${id}`
    );
    return response.data;
  },

  /**
   * Get pending reviews count (Admin only)
   * GET /api/admin/reviews/pending/count
   */
  getPendingReviewsCount: async () => {
    const response = await axiosClient.get<ApiResponse<number>>(
      "/admin/reviews/pending/count"
    );
    return response.data;
  },
};

export default adminReviewApi;
