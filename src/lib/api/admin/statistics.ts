import axiosClient from "../axios";
import type {
  DashboardStats,
  RevenueStats,
  OrderStatusStats,
  TopSellingProduct,
  InventoryReport,
} from "@/types/admin";

/**
 * Admin Statistics API Service
 * Handles all statistics and analytics operations
 */
const adminStatisticsApi = {
  /**
   * Get dashboard statistics (Admin only)
   * GET /api/admin/statistics/dashboard
   */
  getDashboardStats: async () => {
    const response = await axiosClient.get<DashboardStats>(
      "/admin/statistics/dashboard"
    );
    return response.data;
  },

  /**
   * Get revenue by period (Admin only)
   * GET /api/admin/statistics/revenue
   * @param startDate Start date (YYYY-MM-DD)
   * @param endDate End date (YYYY-MM-DD)
   * @param period Period type: daily, weekly, monthly
   */
  getRevenueByPeriod: async (
    startDate: string,
    endDate: string,
    period: "daily" | "weekly" | "monthly" = "daily"
  ) => {
    const response = await axiosClient.get<RevenueStats[]>(
      "/admin/statistics/revenue",
      { params: { startDate, endDate, period } }
    );
    return response.data;
  },

  /**
   * Get orders by status (Admin only)
   * GET /api/admin/statistics/orders/status
   */
  getOrdersByStatus: async () => {
    const response = await axiosClient.get<OrderStatusStats[]>(
      "/admin/statistics/orders/status"
    );
    return response.data;
  },

  /**
   * Get top selling products (Admin only)
   * GET /api/admin/statistics/products/top-selling
   * @param limit Number of products to return (default: 10)
   */
  getTopSellingProducts: async (limit: number = 10) => {
    const response = await axiosClient.get<TopSellingProduct[]>(
      "/admin/statistics/products/top-selling",
      { params: { limit } }
    );
    return response.data;
  },

  /**
   * Get inventory report (Admin only)
   * GET /api/admin/statistics/inventory
   * @param threshold Stock quantity threshold (default: 10)
   */
  getInventoryReport: async (threshold?: number) => {
    const response = await axiosClient.get<InventoryReport[]>(
      "/admin/statistics/inventory",
      { params: { threshold } }
    );
    return response.data;
  },

  /**
   * Get total revenue (Admin only)
   * GET /api/admin/statistics/revenue/total
   */
  getTotalRevenue: async (startDate?: string, endDate?: string) => {
    const response = await axiosClient.get<{ totalRevenue: number }>(
      "/admin/statistics/revenue/total",
      { params: { startDate, endDate } }
    );
    return response.data;
  },

  /**
   * Get order count (Admin only)
   * GET /api/admin/statistics/orders/count
   */
  getOrderCount: async (startDate?: string, endDate?: string) => {
    const response = await axiosClient.get<{ orderCount: number }>(
      "/admin/statistics/orders/count",
      { params: { startDate, endDate } }
    );
    return response.data;
  },
};

export default adminStatisticsApi;
