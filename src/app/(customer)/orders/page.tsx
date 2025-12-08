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

const formatPrice = (value: number) => {
  return value.toLocaleString("vi-VN") + " đ";
};

// Label tiếng Việt cho enum BE
const statusLabel: Record<OrderStatus, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  PROCESSING: "Đang xử lý",
  SHIPPING: "Đang giao",
  DELIVERED: "Đã giao",
  CANCELLED: "Đã hủy",
  REFUNDED: "Đã hoàn tiền",
};

const statusBadgeClass: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-purple-100 text-purple-700",
  SHIPPING: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  REFUNDED: "bg-gray-100 text-gray-700",
};

type FilterType = "ALL" | OrderStatus;

// ✅ Chính đạo: tin BE, không tự cộng ship, không tự suy shippingFee
const getDisplayTotal = (order: OrderSummary): string => {
  const anyOrder = order as any;

  if (typeof anyOrder.formattedTotalAmount === "string") {
    return anyOrder.formattedTotalAmount;
  }

  if (typeof anyOrder.totalAmount === "number") {
    return formatPrice(anyOrder.totalAmount);
  }

  return "";
};

const OrdersPage = () => {
  const [statusFilter, setStatusFilter] = useState<FilterType>("ALL");
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        let data: OrderSummary[];

        if (statusFilter === "ALL") {
          data = await getMyOrders(0, 20);
        } else {
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

  const filteredOrders = orders;

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
          onClick={() => setStatusFilter("CONFIRMED")}
          className={`px-3 py-1 rounded-full border ${
            statusFilter === "CONFIRMED"
              ? "bg-black text-white border-black"
              : "bg-white text-gray-700 border-gray-300"
          }`}
        >
          Đã xác nhận
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
              {filteredOrders.map((order) => {
                const anyOrder = order as any;
                const hasPromo =
                  typeof anyOrder.promotionCode === "string" &&
                  anyOrder.promotionCode.trim() !== "" &&
                  typeof anyOrder.promotionDiscountAmount === "number" &&
                  anyOrder.promotionDiscountAmount > 0;

                const promoLabel =
                  typeof anyOrder.formattedPromotionDiscountAmount === "string"
                    ? anyOrder.formattedPromotionDiscountAmount
                    : formatPrice(anyOrder.promotionDiscountAmount || 0);

                return (
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
                      <div className="flex flex-col items-end">
                        <span className="font-medium">
                          {getDisplayTotal(order)}
                        </span>
                        {hasPromo && (
                          <span className="mt-0.5 text-xs text-green-700">
                            -{promoLabel} (mã {anyOrder.promotionCode})
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 border-b border-gray-100 text-right">
                      <Link href={`/orders/${order.id}`}>
                        <span className="text-blue-600 hover:underline">
                          Xem chi tiết
                        </span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
