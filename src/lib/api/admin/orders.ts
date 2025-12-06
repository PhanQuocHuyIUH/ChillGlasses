import axiosClient from "../axios";
import type {
  ApiResponse,
  PageResponse,
  Order,
  OrderStatus,
  UpdateOrderStatusRequest,
  PaginationParams,
} from "@/types/admin";

export interface GetOrdersParams extends PaginationParams {
  status?: OrderStatus;
  search?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Admin Order API Service
 * Handles all order management operations
 */
const adminOrderApi = {
  /**
   * Get all orders with filtering (Admin only)
   * GET /api/orders/admin/all
   */
  getAllOrders: async (params: GetOrdersParams = {}) => {
    const response = await axiosClient.get<ApiResponse<PageResponse<Order>>>(
      "/orders/admin/all",
      { params }
    );
    return response.data;
  },

  /**
   * Get order by ID (Admin only)
   * GET /api/orders/{id}
   */
  getOrderById: async (id: number) => {
    const response = await axiosClient.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data;
  },

  /**
   * Get order by order code (Admin only)
   * GET /api/orders/code/{orderCode}
   */
  getOrderByCode: async (orderCode: string) => {
    const response = await axiosClient.get<ApiResponse<Order>>(
      `/orders/code/${orderCode}`
    );
    return response.data;
  },

  /**
   * Update order status (Admin only)
   * PUT /api/orders/admin/{id}/status
   */
  updateOrderStatus: async (id: number, data: UpdateOrderStatusRequest) => {
    const response = await axiosClient.put<ApiResponse<Order>>(
      `/orders/admin/${id}/status`,
      data
    );
    return response.data;
  },

  /**
   * Cancel order (Admin only)
   * POST /api/orders/{id}/cancel
   */
  cancelOrder: async (id: number, reason: string) => {
    const response = await axiosClient.post<ApiResponse<Order>>(
      `/orders/${id}/cancel`,
      { reason }
    );
    return response.data;
  },

  /**
   * Get order statistics (Admin only)
   * GET /api/admin/orders/statistics
   */
  getOrderStatistics: async (startDate?: string, endDate?: string) => {
    const response = await axiosClient.get<ApiResponse<any>>(
      "/admin/orders/statistics",
      { params: { startDate, endDate } }
    );
    return response.data;
  },

  /**
   * Export orders to Excel (Admin only)
   * GET /api/admin/orders/export
   */
  exportOrders: async (params: GetOrdersParams = {}) => {
    const response = await axiosClient.get("/admin/orders/export", {
      params,
      responseType: "blob",
    });
    return response.data;
  },
};

export default adminOrderApi;
