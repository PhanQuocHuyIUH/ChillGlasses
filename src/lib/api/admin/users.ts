import axiosClient from "../axios";
import type {
  ApiResponse,
  PageResponse,
  User,
  UpdateUserRequest,
  PaginationParams,
} from "@/types/admin";

export interface GetUsersParams extends PaginationParams {
  search?: string;
  role?: "ADMIN" | "CUSTOMER";
  isActive?: boolean;
}

/**
 * Admin User API Service
 * Handles all admin operations related to user management
 */
const adminUserApi = {
  /**
   * Get all users with filtering and pagination
   * GET /api/admin/users
   */
  getAllUsers: async (params: GetUsersParams = {}) => {
    const response = await axiosClient.get<ApiResponse<PageResponse<User>>>(
      "/admin/users",
      { params }
    );
    return response.data;
  },

  /**
   * Get user by ID
   * GET /api/admin/users/{id}
   */
  getUserById: async (id: number) => {
    const response = await axiosClient.get<ApiResponse<User>>(
      `/admin/users/${id}`
    );
    return response.data;
  },

  /**
   * Update user information
   * PUT /api/admin/users/{id}
   */
  updateUser: async (id: number, data: UpdateUserRequest) => {
    const response = await axiosClient.put<ApiResponse<User>>(
      `/admin/users/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Lock user account
   * PATCH /api/admin/users/{id}/lock
   */
  lockUser: async (id: number) => {
    const response = await axiosClient.patch<ApiResponse<User>>(
      `/admin/users/${id}/lock`
    );
    return response.data;
  },

  /**
   * Unlock user account
   * PATCH /api/admin/users/{id}/unlock
   */
  unlockUser: async (id: number) => {
    const response = await axiosClient.patch<ApiResponse<User>>(
      `/admin/users/${id}/unlock`
    );
    return response.data;
  },

  /**
   * Change user role
   * PATCH /api/admin/users/{id}/role
   */
  changeUserRole: async (id: number, role: "ADMIN" | "CUSTOMER") => {
    const response = await axiosClient.patch<ApiResponse<User>>(
      `/admin/users/${id}/role`,
      { role }
    );
    return response.data;
  },

  /**
   * Delete user (soft delete)
   * DELETE /api/admin/users/{id}
   */
  deleteUser: async (id: number) => {
    const response = await axiosClient.delete<ApiResponse<void>>(
      `/admin/users/${id}`
    );
    return response.data;
  },
};

export default adminUserApi;
