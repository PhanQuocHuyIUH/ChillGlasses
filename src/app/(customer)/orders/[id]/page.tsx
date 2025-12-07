"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
    getOrderDetail,
    type OrderDetail,
    type OrderStatus,
} from "@/lib/api/orders";

const formatPrice = (value: number) => {
    return value.toLocaleString("vi-VN");
};

const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString("vi-VN");
};

// Dùng đúng enum status bên BE: PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
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

const OrderDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const orderId = params?.id as string | undefined;

    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 🔍 Load chi tiết đơn từ BE
    useEffect(() => {
        if (!orderId) {
            setError("Thiếu mã đơn hàng trên URL.");
            setLoading(false);
            return;
        }

        const numericId = Number(orderId);
        if (Number.isNaN(numericId)) {
            setError("Mã đơn hàng không hợp lệ.");
            setLoading(false);
            return;
        }

        let isMounted = true;

        const fetchDetail = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getOrderDetail(numericId);
                if (!isMounted) return;
                setOrder(data);
            } catch (err) {
                console.error("Lỗi load chi tiết đơn:", err);
                if (!isMounted) return;
                setError("Không thể tải chi tiết đơn hàng. Vui lòng thử lại.");
                setOrder(null);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchDetail();

        return () => {
            isMounted = false;
        };
    }, [orderId]);

    // 🧮 Tính tiền
    const subtotal = order
        ? order.items.reduce(
            (sum, item) => sum + item.productPrice * item.quantity,
            0
        )
        : 0;

    const shippingFee = order?.shippingFee ?? 0;
    const total = order?.totalAmount ?? subtotal + shippingFee;

    // 🎨 UI trạng thái load / lỗi
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-24 pb-32 px-4">
                <div className="max-w-4xl mx-auto text-center text-gray-500">
                    Đang tải chi tiết đơn hàng...
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gray-50 pt-24 pb-32 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-red-500 mb-4">
                        {error || "Không tìm thấy đơn hàng."}
                    </p>
                    <button
                        onClick={() => router.push("/orders")}
                        className="inline-block px-4 py-2 text-sm bg-black text-white rounded-lg"
                    >
                        Quay lại lịch sử đơn hàng
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 pt-24 pb-32 px-4">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header + status */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">
                            Chi tiết đơn hàng {order.orderCode}
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Ngày đặt: {formatDateTime(order.orderDate)}
                        </p>
                    </div>
                    <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${statusBadgeClass[order.status]}`}
                    >
            {statusLabel[order.status]}
          </span>
                </div>

                {/* Thông tin người đặt + giao hàng */}
                <div className="bg-white shadow p-6 rounded-lg space-y-2">
                    <h2 className="text-lg font-semibold mb-2">Thông tin đơn hàng</h2>
                    <p>
                        <strong>Khách hàng:</strong> {order.userFullName}
                    </p>
                    <p>
                        <strong>Email:</strong> {order.userEmail}
                    </p>
                    <p>
                        <strong>Địa chỉ giao hàng:</strong> {order.shippingAddress}
                    </p>
                    <p>
                        <strong>Phương thức giao hàng:</strong> {order.shippingMethod}
                    </p>
                    <p>
                        <strong>Thanh toán:</strong> {order.paymentMethod} (
                        {order.paymentStatus === "PAID" ? "Đã thanh toán" : "Chưa thanh toán"}
                        )
                    </p>
                    {order.notes && (
                        <p>
                            <strong>Ghi chú:</strong> {order.notes}
                        </p>
                    )}
                </div>

                {/* Danh sách sản phẩm */}
                <div className="bg-white shadow p-6 rounded-lg">
                    <h2 className="text-lg font-semibold mb-4">Sản phẩm</h2>

                    <div className="space-y-4">
                        {order.items.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center gap-4 border-b pb-4 last:border-b-0"
                            >
                                <div className="w-20 h-20 relative bg-gray-100 rounded">
                                    {item.productImage ? (
                                        <Image
                                            src={item.productImage}
                                            alt={item.productName}
                                            fill
                                            className="object-cover rounded"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                            No image
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <p className="font-semibold">{item.productName}</p>
                                    <p className="text-gray-500 text-xs">
                                        Mã sản phẩm: {item.productSlug}
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                        {item.formattedPrice} x {item.quantity}
                                    </p>
                                </div>

                                <p className="font-semibold text-sm">
                                    {item.formattedSubtotal}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tổng tiền */}
                <div className="bg-white shadow p-6 rounded-lg space-y-2">
                    <h2 className="text-lg font-semibold">Tổng tiền</h2>
                    <div className="flex justify-between text-sm">
                        <span>Tạm tính:</span>
                        <span>{formatPrice(subtotal)} đ</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Phí giao hàng:</span>
                        <span>{formatPrice(shippingFee)} đ</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                        <span>Tổng cộng:</span>
                        <span>{formatPrice(total)} đ</span>
                    </div>
                </div>

                {/* Button hủy (chưa nối API, để UI trước) */}
                {order.status === "PENDING" || order.status === "PROCESSING" ? (
                    <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg text-sm">
                        Yêu cầu hủy đơn
                    </button>
                ) : null}
            </div>
        </div>
    );
};

export default OrderDetailPage;
