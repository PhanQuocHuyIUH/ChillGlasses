"use client";

import AdminHeader from "@/components/layout/AdminHeader";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Order {
  id: number;
  customer: string;
  orderDate: string;
  total: string;
  status: string;
}

const OrderPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([
    { id: 1, customer: "Nguyễn Văn A", orderDate: "2023-10-01", total: "1.500.000đ", status: "Đang xử lý" },
    { id: 2, customer: "Trần Thị B", orderDate: "2023-10-02", total: "2.000.000đ", status: "Hoàn thành" },
    { id: 3, customer: "Lê Văn C", orderDate: "2023-10-03", total: "3.500.000đ", status: "Đã hủy" },
  ]);

  const handleStatusChange = (id: number, newStatus: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  const handleRowClick = (id: number) => {
    router.push(`/admin/orders/${id}`); // Navigate to the order details page
  };

  return (
    <div>
      <AdminHeader />
      <div className="p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-8 text-center">Quản Lý Đơn Hàng</h1>
        <table className="w-screen bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left px-4 py-2">Mã đơn</th>
              <th className="text-left px-4 py-2">Khách hàng</th>
              <th className="text-left px-4 py-2">Ngày đặt</th>
              <th className="text-left px-4 py-2">Tổng tiền</th>
              <th className="text-left px-4 py-2">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-t hover:bg-gray-100 cursor-pointer"
                onClick={() => handleRowClick(order.id)}
              >
                <td className="px-4 py-2">{order.id}</td>
                <td className="px-4 py-2">{order.customer}</td>
                <td className="px-4 py-2">{order.orderDate}</td>
                <td className="px-4 py-2">{order.total}</td>
                <td className="px-4 py-2">
                  <select
                    value={order.status}
                    onChange={(e) => {
                      e.stopPropagation(); // Prevent row click when changing status
                      handleStatusChange(order.id, e.target.value);
                    }}
                    className="border rounded px-2 py-1"
                  >
                    <option value="Đang xử lý">Đang xử lý</option>
                    <option value="Hoàn thành">Hoàn thành</option>
                    <option value="Đã hủy">Đã hủy</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderPage;