"use client";

import { useState } from "react";
import Link from "next/link";

type OrderStatus = "PENDING" | "SHIPPING" | "COMPLETED" | "CANCELLED";

type Order = {
    id: string;
    code: string;
    createdAt: string; // đã format sẵn, tránh dùng toLocaleDateString để khỏi lỗi hydration
    total: number;
    status: OrderStatus;
};

const formatPrice = (value: number) => {
    return value.toLocaleString("vi-VN");
};

const statusLabel: Record<OrderStatus, string> = {
    PENDING: "Chờ xác nhận",
    SHIPPING: "Đang giao",
    COMPLETED: "Đã giao",
    CANCELLED: "Đã hủy",
};

const statusBadgeClass: Record<OrderStatus, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    SHIPPING: "bg-blue-100 text-blue-700",
    COMPLETED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
};

const OrdersPage = () => {
    const [statusFilter, setStatusFilter] = useState<"ALL" | OrderStatus>("ALL");

    const orders: Order[] = [
        {
            id: "1",
            code: "CG-20241201-001",
            createdAt: "01/12/2024",
            total: 2400000,
            status: "PENDING",
        },
        {
            id: "2",
            code: "CG-20241128-002",
            createdAt: "28/11/2024",
            total: 1750000,
            status: "SHIPPING",
        },
        {
            id: "3",
            code: "CG-20241120-003",
            createdAt: "20/11/2024",
            total: 3200000,
            status: "COMPLETED",
        },
        {
            id: "4",
            code: "CG-20241110-004",
            createdAt: "10/11/2024",
            total: 980000,
            status: "CANCELLED",
        },
    ];

    const filteredOrders =
        statusFilter === "ALL"
            ? orders
            : orders.filter((order) => order.status === statusFilter);

    return (
        <div className="min-h-screen max-w-5xl mx-auto px-4 pt-24 pb-16">
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
                    onClick={() => setStatusFilter("SHIPPING")}
                    className={`px-3 py-1 rounded-full border ${
                        statusFilter === "SHIPPING"
                            ? "bg-black text-white border-black"
                            : "bg-white text-gray-700 border-gray-300"
                    }`}
                >
                    Đang giao
                </button>

                <button
                    onClick={() => setStatusFilter("COMPLETED")}
                    className={`px-3 py-1 rounded-full border ${
                        statusFilter === "COMPLETED"
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
            <div className="bg-white shadow rounded-lg overflow-hidden">
                {filteredOrders.length === 0 ? (
                    <div className="p-4 text-sm text-gray-600">
                        Không có đơn hàng nào với trạng thái này.
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left px-4 py-2">Mã đơn</th>
                            <th className="text-left px-4 py-2">Ngày đặt</th>
                            <th className="text-left px-4 py-2">Trạng thái</th>
                            <th className="text-right px-4 py-2">Tổng tiền</th>
                            <th className="text-right px-4 py-2">Chi tiết</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredOrders.map((order) => (
                            <tr
                                key={order.id}
                                className="border-t hover:bg-gray-50 transition-colors"
                            >
                                <td className="px-4 py-2">
                                    <span className="font-medium">{order.code}</span>
                                </td>
                                <td className="px-4 py-2">{order.createdAt}</td>
                                <td className="px-4 py-2">
                    <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs ${statusBadgeClass[order.status]}`}
                    >
                      {statusLabel[order.status]}
                    </span>
                                </td>
                                <td className="px-4 py-2 text-right">
                                    {formatPrice(order.total)} đ
                                </td>
                                <td className="px-4 py-2 text-right">
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
