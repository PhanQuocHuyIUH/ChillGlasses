"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminStatisticsApi } from "@/lib/api/admin";
import type { DashboardStats, TopSellingProduct } from "@/types/admin";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  AlertTriangle,
  TrendingUp,
  Clock,
  Star,
} from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashBoardPage = () => {
  // State for dashboard data
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [topProducts, setTopProducts] = useState<TopSellingProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");

  // Fetch dashboard stats on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  /**
   * Fetch all dashboard data from API
   * - Dashboard statistics (users, orders, revenue, etc.)
   * - Top selling products
   */
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch dashboard stats
      const dashboardStats = await adminStatisticsApi.getDashboardStats();
      setStats(dashboardStats);

      // Fetch top 5 selling products
      const productsData = await adminStatisticsApi.getTopSellingProducts(5);
      setTopProducts(productsData);
    } catch (err: any) {
      console.error("Error fetching dashboard data:", err);

      // Better error handling
      let errorMsg = "Không thể tải dữ liệu dashboard";

      if (err.response) {
        const status = err.response.status;
        if (status === 401) {
          errorMsg = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
        } else if (status === 403) {
          errorMsg =
            "Bạn không có quyền truy cập. Vui lòng đăng nhập với tài khoản ADMIN.";
        } else if (status === 404) {
          errorMsg = "Không tìm thấy API endpoint. Vui lòng kiểm tra backend.";
        } else {
          errorMsg =
            err.response.data?.message || `Lỗi ${status}: ${err.message}`;
        }
      } else if (err.request) {
        errorMsg =
          "Không thể kết nối đến server. Vui lòng kiểm tra backend có đang chạy không.";
      } else {
        errorMsg = err.message || "Đã xảy ra lỗi không xác định";
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Chart data for revenue visualization (dummy data - can be replaced with real revenue API)
  const revenueToday = stats?.revenueToday ?? 0;
  const revenueChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Revenue (VNĐ)",
        data: stats
          ? [
              revenueToday * 0.8,
              revenueToday * 0.9,
              revenueToday,
              revenueToday * 1.1,
              revenueToday * 1.2,
              revenueToday * 1.3,
              revenueToday * 1.4,
            ]
          : [],
        backgroundColor:
          chartType === "bar"
            ? "rgba(34, 197, 94, 0.6)"
            : [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
                "#FF6384",
              ],
        borderColor: chartType === "bar" ? "rgba(34, 197, 94, 1)" : undefined,
        borderWidth: 2,
      },
    ],
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              <div>
                <p className="font-semibold">Error loading dashboard</p>
                <p className="text-sm">{error}</p>
                <button
                  onClick={fetchDashboardData}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                >
                  Retry
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here&apos;s what&apos;s happening today.
        </p>
      </div>

      {/* Stats Cards Row 1 - Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Users Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Users
            </CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {(stats?.totalUsers ?? 0).toLocaleString()}
            </div>
            <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />+{stats?.newUsersToday ?? 0} new
              today
            </p>
          </CardContent>
        </Card>

        {/* Total Orders Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Orders
            </CardTitle>
            <ShoppingCart className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {(stats?.totalOrders ?? 0).toLocaleString()}
            </div>
            <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              {stats?.ordersToday ?? 0} orders today
            </p>
          </CardContent>
        </Card>

        {/* Total Revenue Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {(stats?.totalRevenue ?? 0).toLocaleString()}đ
            </div>
            <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              {(stats?.revenueToday ?? 0).toLocaleString()}đ today
            </p>
          </CardContent>
        </Card>

        {/* Total Products Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Products
            </CardTitle>
            <Package className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {stats?.totalProducts ?? 0}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {stats?.activeProducts ?? 0} active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards Row 2 - Alerts & Pending */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Low Stock Alert */}
        <Card className="border-yellow-200 bg-yellow-50 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-yellow-800">
              Low Stock Products
            </CardTitle>
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-900">
              {stats?.lowStockProducts ?? 0}
            </div>
            <p className="text-sm text-yellow-700 mt-2">Requires attention</p>
          </CardContent>
        </Card>

        {/* Pending Orders */}
        <Card className="border-blue-200 bg-blue-50 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              Pending Orders
            </CardTitle>
            <Clock className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">
              {stats?.pendingOrders ?? 0}
            </div>
            <p className="text-sm text-blue-700 mt-2">Awaiting processing</p>
          </CardContent>
        </Card>

        {/* Pending Reviews */}
        <Card className="border-purple-200 bg-purple-50 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">
              Pending Reviews
            </CardTitle>
            <Star className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">
              {stats?.pendingReviews ?? 0}
            </div>
            <p className="text-sm text-purple-700 mt-2">Needs approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                Revenue Overview
              </CardTitle>
              <button
                onClick={() =>
                  setChartType((prev) => (prev === "bar" ? "pie" : "bar"))
                }
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {chartType === "bar" ? "Pie Chart" : "Bar Chart"}
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              {chartType === "bar" ? (
                <Bar
                  data={revenueChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: true, position: "top" },
                    },
                  }}
                />
              ) : (
                <Pie
                  data={revenueChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: true, position: "bottom" },
                    },
                  }}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Selling Products */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Top Selling Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topProducts.length > 0 ? (
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div
                    key={product.productId}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {product.productName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {product.categoryName}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {product.totalQuantitySold} sold
                      </p>
                      <p className="text-sm text-green-600">
                        {product.totalRevenue.toLocaleString()}đ
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No sales data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashBoardPage;
