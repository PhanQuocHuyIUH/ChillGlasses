"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    getMyOrders,
    getMyOrdersByStatus,
    type OrderStatus,
    type OrderSummary,
} from "@/lib/api/orders";

const formatDate = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("vi-VN");
};

// Label tiếng Việt cho enum BE
const statusLabel: Record<OrderStatus, string> = {
    PENDING: "Chờ xác nhận",
    PROCESSING: "Đang xử lý",
    SHIPPED: "Đang giao",
    DELIVERED: "Đã giao",
    CANCELLED: "Đã hủy",
};

const statusBadgeClass: Record<OrderStatus, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    PROCESSING: "bg-purple-100 text-purple-700",
    SHIPPED: "bg-blue-100 text-blue-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
};

type FilterType = "ALL" | OrderStatus;

const OrdersPage = () => {
    const [statusFilter, setStatusFilter] = useState<FilterType>("ALL");
    const [orders, setOrders] = useState<OrderSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 🧠 Load danh sách đơn hàng từ BE theo filter
    useEffect(() => {
        let isMounted = true;

        const fetchOrders = async () => {
            try {
                setLoading(true);
                setError(null);

                let data: OrderSummary[];

                if (statusFilter === "ALL") {
                    // gọi GET /api/orders/my-orders (phân trang)
                    data = await getMyOrders(0, 20);
                } else {
                    // gọi GET /api/orders/my-orders/status/{status}
                    data = await getMyOrdersByStatus(statusFilter);
                }

                if (!isMounted) return;
                setOrders(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Lỗi load orders:", err);
                if (!isMounted) return;
                setError("Không tải được danh sách đơn hàng. Vui lòng thử lại.");
                setOrders([]);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchOrders();

        return () => {
            isMounted = false;
        };
    }, [statusFilter]);

    const filteredOrders = orders; // API đã filter sẵn rồi

    return (
        <div className="min-h-screen max-w-6xl mx-auto px-4 pt-24 pb-16">
            <h1 className="text-2xl font-semibold mb-6">Lịch sử đơn hàng</h1>

            {/* Filter trạng thái */}
            <div className="mb-4 flex flex-wrap gap-2 text-sm">
                <button
                    onClick={() => setStatusFilter("ALL")}
                    className={`px-3 py-1 rounded-full border ${
                        statusFilter === "ALL"
                            ? "bg-black text-white border-black"
                            : "bg-white text-gray-700 border-gray-300"
                    }`}
                >
                    Tất cả
                </button>

                <button
                    onClick={() => setStatusFilter("PENDING")}
                    className={`px-3 py-1 rounded-full border ${
                        statusFilter === "PENDING"
                            ? "bg-black text-white border-black"
                            : "bg-white text-gray-700 border-gray-300"
                    }`}
                >
                    Chờ xác nhận
                </button>

                <button
                    onClick={() => setStatusFilter("PROCESSING")}
                    className={`px-3 py-1 rounded-full border ${
                        statusFilter === "PROCESSING"
                            ? "bg-black text-white border-black"
                            : "bg-white text-gray-700 border-gray-300"
                    }`}
                >
                    Đang xử lý
                </button>

                <button
                    onClick={() => setStatusFilter("SHIPPED")}
                    className={`px-3 py-1 rounded-full border ${
                        statusFilter === "SHIPPED"
                            ? "bg-black text-white border-black"
                            : "bg-white text-gray-700 border-gray-300"
                    }`}
                >
                    Đang giao
                </button>

                <button
                    onClick={() => setStatusFilter("DELIVERED")}
                    className={`px-3 py-1 rounded-full border ${
                        statusFilter === "DELIVERED"
                            ? "bg-black text-white border-black"
                            : "bg-white text-gray-700 border-gray-300"
                    }`}
                >
                    Đã giao
                </button>

                <button
                    onClick={() => setStatusFilter("CANCELLED")}
                    className={`px-3 py-1 rounded-full border ${
                        statusFilter === "CANCELLED"
                            ? "bg-black text-white border-black"
                            : "bg-white text-gray-700 border-gray-300"
                    }`}
                >
                    Đã hủy
                </button>
            </div>

            {/* Danh sách đơn */}
            <div className="bg-white shadow-md border border-gray-200 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="p-6 text-center text-gray-500 text-sm">
                        Đang tải đơn hàng...
                    </div>
                ) : error ? (
                    <div className="p-6 text-center text-red-500 text-sm">{error}</div>
                ) : filteredOrders.length === 0 ? (
                    <div className="p-6 text-sm text-gray-600">
                        Không có đơn hàng nào với trạng thái này.
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left px-5 py-3 border-b border-gray-200">
                                Mã đơn
                            </th>
                            <th className="text-left px-5 py-3 border-b border-gray-200">
                                Ngày đặt
                            </th>
                            <th className="text-left px-5 py-3 border-b border-gray-200">
                                Trạng thái
                            </th>
                            <th className="text-left px-5 py-3 border-b border-gray-200">
                                Thanh toán
                            </th>
                            <th className="text-right px-5 py-3 border-b border-gray-200">
                                Tổng tiền
                            </th>
                            <th className="text-right px-5 py-3 border-b border-gray-200">
                                Chi tiết
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredOrders.map((order) => (
                            <tr
                                key={order.id}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td className="px-5 py-3 border-b border-gray-100">
                                    <span className="font-medium">{order.orderCode}</span>
                                </td>
                                <td className="px-5 py-3 border-b border-gray-100">
                                    {formatDate(order.orderDate)}
                                </td>
                                <td className="px-5 py-3 border-b border-gray-100">
                    <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                            statusBadgeClass[order.status]
                        }`}
                    >
                      {statusLabel[order.status]}
                    </span>
                                </td>
                                <td className="px-5 py-3 border-b border-gray-100">
                    <span className="text-xs uppercase tracking-wide text-gray-500">
                      {order.paymentMethod}
                    </span>
                                </td>
                                <td className="px-5 py-3 border-b border-gray-100 text-right">
                                    {order.formattedTotalAmount}
                                </td>
                                <td className="px-5 py-3 border-b border-gray-100 text-right">
                                    <Link href={`/orders/${order.id}`}>
                      <span className="text-blue-600 hover:underline">
                        Xem chi tiết
                      </span>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;
