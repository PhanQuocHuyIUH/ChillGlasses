"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminOrderApi } from "@/lib/api/admin";
import { Order, OrderStatus } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Loader2, Search } from "lucide-react";

const OrderPage = () => {
  // State management
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  });

  // Filter state
  const [filters, setFilters] = useState({
    search: "",
    status: undefined as OrderStatus | undefined,
    startDate: undefined as string | undefined,
    endDate: undefined as string | undefined,
    page: 0,
    size: 10,
    sortBy: "orderDate",
    sortDir: "DESC" as "ASC" | "DESC",
  });

  // Fetch orders on mount and when filters change
  useEffect(() => {
    fetchOrders();
  }, [filters]);

  // Fetch orders from API
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminOrderApi.getAllOrders(filters);
      setOrders(response.data.content);
      setPagination({
        page: response.data.pageNumber,
        size: response.data.pageSize,
        totalElements: response.data.totalElements,
        totalPages: response.data.totalPages,
      });
    } catch (err: any) {
      console.error("Error fetching orders:", err);
      setError(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // Handle search by order code or customer name
  const handleSearch = (value: string) => {
    setFilters({ ...filters, search: value, page: 0 });
  };

  // Handle status filter
  const handleStatusFilter = (status: string) => {
    setFilters({
      ...filters,
      status: status === "all" ? undefined : (status as OrderStatus),
      page: 0,
    });
  };

  // Handle pagination
  const handleNextPage = () => {
    if (pagination.page < pagination.totalPages - 1) {
      setFilters({ ...filters, page: filters.page + 1 });
    }
  };

  const handlePrevPage = () => {
    if (pagination.page > 0) {
      setFilters({ ...filters, page: filters.page - 1 });
    }
  };

  // Confirm order (PENDING → CONFIRMED)
  const handleConfirmOrder = async (id: number) => {
    if (!confirm("Xác nhận đơn hàng này?")) return;

    setActionLoading(id);
    try {
      await adminOrderApi.confirmOrder(id);
      await fetchOrders();
      alert("Đã xác nhận đơn hàng!");
    } catch (err: any) {
      console.error("Error confirming order:", err);
      alert(err.response?.data?.message || "Failed to confirm order");
    } finally {
      setActionLoading(null);
    }
  };

  // Process order (CONFIRMED → PROCESSING)
  const handleProcessOrder = async (id: number) => {
    if (!confirm("Bắt đầu xử lý đơn hàng này?")) return;

    setActionLoading(id);
    try {
      await adminOrderApi.processOrder(id);
      await fetchOrders();
      alert("Đơn hàng đang được xử lý!");
    } catch (err: any) {
      console.error("Error processing order:", err);
      alert(err.response?.data?.message || "Failed to process order");
    } finally {
      setActionLoading(null);
    }
  };

  // Ship order (PROCESSING → SHIPPING)
  const handleShipOrder = async (id: number) => {
    if (!confirm("Đơn hàng đã giao cho đơn vị vận chuyển?")) return;

    setActionLoading(id);
    try {
      await adminOrderApi.shipOrder(id);
      await fetchOrders();
      alert("Đơn hàng đang được giao!");
    } catch (err: any) {
      console.error("Error shipping order:", err);
      alert(err.response?.data?.message || "Failed to ship order");
    } finally {
      setActionLoading(null);
    }
  };

  // Deliver order (SHIPPING → DELIVERED)
  const handleDeliverOrder = async (id: number) => {
    if (!confirm("Xác nhận đơn hàng đã giao thành công?")) return;

    setActionLoading(id);
    try {
      await adminOrderApi.deliverOrder(id);
      await fetchOrders();
      alert("Đơn hàng đã giao thành công!");
    } catch (err: any) {
      console.error("Error delivering order:", err);
      alert(err.response?.data?.message || "Failed to deliver order");
    } finally {
      setActionLoading(null);
    }
  };

  // Cancel order
  const handleCancelOrder = async (id: number) => {
    const reason = prompt("Nhập lý do hủy đơn hàng:");
    if (!reason || !reason.trim()) return;

    setActionLoading(id);
    try {
      await adminOrderApi.cancelOrder(id, reason);
      await fetchOrders();
      alert("Đã hủy đơn hàng!");
    } catch (err: any) {
      console.error("Error cancelling order:", err);
      alert(err.response?.data?.message || "Failed to cancel order");
    } finally {
      setActionLoading(null);
    }
  };

  // Update payment status
  const handleUpdatePaymentStatus = async (id: number) => {
    if (!confirm("Xác nhận đã nhận thanh toán cho đơn hàng này?")) return;

    setActionLoading(id);
    try {
      await adminOrderApi.updatePaymentStatus(id, "PAID");
      await fetchOrders();
      alert("Đã cập nhật trạng thái thanh toán!");
    } catch (err: any) {
      console.error("Error updating payment status:", err);
      alert(err.response?.data?.message || "Failed to update payment status");
    } finally {
      setActionLoading(null);
    }
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "CONFIRMED":
        return "default";
      case "PROCESSING":
        return "default";
      case "SHIPPING":
        return "default";
      case "DELIVERED":
        return "success";
      case "CANCELLED":
        return "destructive";
      default:
        return "default";
    }
  };

  // Get status display text
  const getStatusText = (status: OrderStatus) => {
    const statusMap: Record<OrderStatus, string> = {
      PENDING: "Chờ xử lý",
      CONFIRMED: "Đã xác nhận",
      PROCESSING: "Đang xử lý",
      SHIPPING: "Đang giao",
      DELIVERED: "Đã giao",
      CANCELLED: "Đã hủy",
      REFUNDED: "Đã hoàn tiền",
    };
    return statusMap[status] || status;
  };

  // Loading state
  if (loading && orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-3 text-lg">Loading orders...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="max-w-2xl mx-auto mt-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center text-red-600">
              <AlertTriangle className="w-8 h-8 mr-3" />
              <div>
                <p className="text-lg font-semibold">Error loading orders</p>
                <p className="text-sm text-gray-600">{error}</p>
              </div>
            </div>
            <Button onClick={fetchOrders} className="mt-4 w-full">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Quản Lý Đơn Hàng</h1>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <Input
                placeholder="Tìm kiếm theo mã đơn hoặc tên khách hàng..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full"
              />
            </div>
            <Select
              value={filters.status || "all"}
              onValueChange={handleStatusFilter}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="PENDING">Chờ xử lý</SelectItem>
                <SelectItem value="CONFIRMED">Đã xác nhận</SelectItem>
                <SelectItem value="PROCESSING">Đang xử lý</SelectItem>
                <SelectItem value="SHIPPING">Đang giao</SelectItem>
                <SelectItem value="DELIVERED">Đã giao</SelectItem>
                <SelectItem value="CANCELLED">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã đơn</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Ngày đặt</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Trạng thái đơn</TableHead>
              <TableHead>Thanh toán</TableHead>
              <TableHead className="text-center">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.orderCode}</TableCell>
                <TableCell>{order.userFullName}</TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell>
                  {order.totalAmount.toLocaleString("vi-VN")}đ
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(order.status)}>
                    {getStatusText(order.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      order.paymentStatus === "PAID"
                        ? "success"
                        : order.paymentStatus === "REFUNDED"
                        ? "default"
                        : "warning"
                    }
                  >
                    {order.paymentStatus === "PAID"
                      ? "Đã thanh toán"
                      : order.paymentStatus === "REFUNDED"
                      ? "Đã hoàn tiền"
                      : "Chưa thanh toán"}
                  </Badge>
                </TableCell>
                <TableCell
                  className="text-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex gap-2 justify-center items-center">
                    {actionLoading === order.id ? (
                      <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    ) : (
                      <>
                        {/* PENDING: Show Confirm + Cancel */}
                        {order.status === "PENDING" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleConfirmOrder(order.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              ✓ Xác nhận
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleCancelOrder(order.id)}
                            >
                              ✕ Hủy
                            </Button>
                          </>
                        )}

                        {/* CONFIRMED: Show Process + Cancel */}
                        {order.status === "CONFIRMED" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleProcessOrder(order.id)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              → Xử lý
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleCancelOrder(order.id)}
                            >
                              ✕ Hủy
                            </Button>
                          </>
                        )}

                        {/* PROCESSING: Show Ship + Cancel */}
                        {order.status === "PROCESSING" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleShipOrder(order.id)}
                              className="bg-purple-600 hover:bg-purple-700"
                            >
                              🚚 Giao hàng
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleCancelOrder(order.id)}
                            >
                              ✕ Hủy
                            </Button>
                          </>
                        )}

                        {/* SHIPPING: Show Deliver */}
                        {order.status === "SHIPPING" && (
                          <Button
                            size="sm"
                            onClick={() => handleDeliverOrder(order.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            ✓ Đã giao
                          </Button>
                        )}

                        {/* DELIVERED/CANCELLED: No actions, show payment status update if needed */}
                        {order.status === "DELIVERED" &&
                          order.paymentStatus === "UNPAID" && (
                            <Button
                              size="sm"
                              onClick={() =>
                                handleUpdatePaymentStatus(order.id)
                              }
                              variant="outline"
                            >
                              💰 Đánh dấu đã thanh toán
                            </Button>
                          )}

                        {(order.status === "DELIVERED" ||
                          order.status === "CANCELLED") &&
                          order.paymentStatus === "PAID" && (
                            <span className="text-sm text-gray-500 italic">
                              Hoàn tất
                            </span>
                          )}
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600">
          Showing {pagination.page * pagination.size + 1} to{" "}
          {Math.min(
            (pagination.page + 1) * pagination.size,
            pagination.totalElements
          )}{" "}
          of {pagination.totalElements} orders
        </p>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={handlePrevPage}
            disabled={pagination.page === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={handleNextPage}
            disabled={pagination.page >= pagination.totalPages - 1}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
