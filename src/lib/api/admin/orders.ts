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
  paymentStatus?: "UNPAID" | "PAID" | "REFUNDED";
}

/**
 * Admin Order API Service
 * Handles all order management operations with new dedicated admin endpoints
 */
const adminOrderApi = {
  /**
   * Get all orders with advanced filtering (Admin only)
   * GET /api/admin/orders
   */
  getAllOrders: async (params: GetOrdersParams = {}) => {
    const response = await axiosClient.get<ApiResponse<PageResponse<Order>>>(
      "/admin/orders",
      { params }
    );
    return response.data;
  },

  /**
   * Get order by ID (Admin only)
   * GET /api/admin/orders/{id}
   */
  getOrderById: async (id: number) => {
    const response = await axiosClient.get<ApiResponse<Order>>(
      `/admin/orders/${id}`
    );
    return response.data;
  },

  /**
   * Update order status (Admin only)
   * PUT /api/admin/orders/{id}/status
   */
  updateOrderStatus: async (id: number, data: UpdateOrderStatusRequest) => {
    const response = await axiosClient.put<ApiResponse<Order>>(
      `/admin/orders/${id}/status`,
      data
    );
    return response.data;
  },

  /**
   * Update payment status (Admin only)
   * PUT /api/admin/orders/{id}/payment-status
   */
  updatePaymentStatus: async (
    id: number,
    paymentStatus: "UNPAID" | "PAID" | "REFUNDED"
  ) => {
    const response = await axiosClient.put<ApiResponse<Order>>(
      `/admin/orders/${id}/payment-status`,
      null,
      { params: { paymentStatus } }
    );
    return response.data;
  },

  /**
   * Confirm order - PENDING → CONFIRMED (Admin only)
   * POST /api/admin/orders/{id}/confirm
   */
  confirmOrder: async (id: number) => {
    const response = await axiosClient.post<ApiResponse<Order>>(
      `/admin/orders/${id}/confirm`
    );
    return response.data;
  },

  /**
   * Start processing order - CONFIRMED → PROCESSING (Admin only)
   * POST /api/admin/orders/{id}/process
   */
  processOrder: async (id: number) => {
    const response = await axiosClient.post<ApiResponse<Order>>(
      `/admin/orders/${id}/process`
    );
    return response.data;
  },

  /**
   * Ship order - PROCESSING → SHIPPING (Admin only)
   * POST /api/admin/orders/{id}/ship
   */
  shipOrder: async (id: number) => {
    const response = await axiosClient.post<ApiResponse<Order>>(
      `/admin/orders/${id}/ship`
    );
    return response.data;
  },

  /**
   * Deliver order - SHIPPING → DELIVERED (Admin only)
   * POST /api/admin/orders/{id}/deliver
   */
  deliverOrder: async (id: number) => {
    const response = await axiosClient.post<ApiResponse<Order>>(
      `/admin/orders/${id}/deliver`
    );
    return response.data;
  },

  /**
   * Cancel order (Admin only)
   * POST /api/admin/orders/{id}/cancel
   */
  cancelOrder: async (id: number, reason: string) => {
    const response = await axiosClient.post<ApiResponse<Order>>(
      `/admin/orders/${id}/cancel`,
      null,
      { params: { reason } }
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
   * Get order count by status (Admin only)
   * GET /api/admin/orders/count-by-status
   */
  getOrderCountByStatus: async () => {
    const response = await axiosClient.get<
      ApiResponse<Record<OrderStatus, number>>
    >("/admin/orders/count-by-status");
    return response.data;
  },
};

export default adminOrderApi;
