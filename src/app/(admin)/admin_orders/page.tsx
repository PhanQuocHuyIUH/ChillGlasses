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
  const router = useRouter();

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

  // Update order status
  const handleStatusChange = async (id: number, newStatus: OrderStatus) => {
    setActionLoading(id);
    try {
      await adminOrderApi.updateOrderStatus(id, { status: newStatus });
      await fetchOrders(); // Refresh list
      alert("Cập nhật trạng thái đơn hàng thành công!");
    } catch (err: any) {
      console.error("Error updating order status:", err);
      alert(err.response?.data?.message || "Failed to update order status");
    } finally {
      setActionLoading(null);
    }
  };

  // Cancel order
  const handleCancelOrder = async (id: number) => {
    const reason = prompt("Nhập lý do hủy đơn hàng:");
    if (!reason) return;

    setActionLoading(id);
    try {
      await adminOrderApi.cancelOrder(id, reason);
      await fetchOrders();
      alert("Hủy đơn hàng thành công!");
    } catch (err: any) {
      console.error("Error cancelling order:", err);
      alert(err.response?.data?.message || "Failed to cancel order");
    } finally {
      setActionLoading(null);
    }
  };

  // Navigate to order details
  const handleRowClick = (id: number) => {
    // router.push(`/admin_orders/${id}`);
    alert(
      `View order details for ID: ${id} (Details page not implemented yet)`
    );
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
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-center">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow
                key={order.id}
                className="cursor-pointer"
                onClick={() => handleRowClick(order.id)}
              >
                <TableCell className="font-medium">{order.orderCode}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell>
                  {order.totalAmount.toLocaleString("vi-VN")}đ
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(order.orderStatus)}>
                    {getStatusText(order.orderStatus)}
                  </Badge>
                </TableCell>
                <TableCell
                  className="text-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Select
                    value={order.orderStatus}
                    onValueChange={(value) =>
                      handleStatusChange(order.id, value as OrderStatus)
                    }
                    disabled={
                      actionLoading === order.id ||
                      order.orderStatus === "CANCELLED"
                    }
                  >
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Chờ xử lý</SelectItem>
                      <SelectItem value="CONFIRMED">Xác nhận</SelectItem>
                      <SelectItem value="PROCESSING">Xử lý</SelectItem>
                      <SelectItem value="SHIPPING">Giao hàng</SelectItem>
                      <SelectItem value="DELIVERED">Hoàn thành</SelectItem>
                    </SelectContent>
                  </Select>
                  {order.orderStatus !== "CANCELLED" &&
                    order.orderStatus !== "DELIVERED" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={actionLoading === order.id}
                        className="ml-2"
                      >
                        {actionLoading === order.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Hủy"
                        )}
                      </Button>
                    )}
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
