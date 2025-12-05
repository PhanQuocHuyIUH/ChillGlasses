"use client";

import AdminHeader from "@/components/layout/AdminHeader";
import SideBar from "@/components/layout/SideBar";
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
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      <div className="flex">
        <SideBar /> {/* Sidebar with fixed width */}
        <div className="flex-1 ml-100 p-8"> {/* Adjusted to take remaining space */}
          <h1 className="text-4xl font-bold mb-8 text-center">Quản Lý Đơn Hàng</h1>
          <table className="w-full bg-white shadow-md rounded-lg border border-gray-300">
            <thead className="bg-gray-200 border-b border-gray-300">
              <tr>
                <th className="text-left px-6 py-4 text-lg border-r border-gray-300">Mã đơn</th>
                <th className="text-left px-6 py-4 text-lg border-r border-gray-300">Khách hàng</th>
                <th className="text-left px-6 py-4 text-lg border-r border-gray-300">Ngày đặt</th>
                <th className="text-left px-6 py-4 text-lg border-r border-gray-300">Tổng tiền</th>
                <th className="text-left px-6 py-4 text-lg">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleRowClick(order.id)}
                >
                  <td className="px-6 py-4 text-lg border-r border-gray-300">{order.id}</td>
                  <td className="px-6 py-4 text-lg border-r border-gray-300">{order.customer}</td>
                  <td className="px-6 py-4 text-lg border-r border-gray-300">{order.orderDate}</td>
                  <td className="px-6 py-4 text-lg border-r border-gray-300">{order.total}</td>
                  <td className="px-6 py-4 text-lg">
                    <select
                      value={order.status}
                      onChange={(e) => {
                        e.stopPropagation(); // Prevent row click when changing status
                        handleStatusChange(order.id, e.target.value);
                      }}
                      className="border rounded px-2 py-1 text-lg"
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
    </div>
  );
};

export default OrderPage;