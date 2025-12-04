"use client";

import { useState } from "react";
import AdminHeader from "@/components/layout/AdminHeader";
import SideBar from "@/components/layout/SideBar";

interface Customer {
  id: number;
  name: string;
  phone: string;
  address: string;
  email: string;
}

const CustomerPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([
    { id: 1, name: "Nguyễn Văn A", phone: "0123456789", address: "Hà Nội", email: "nguyenvana@example.com" },
    { id: 2, name: "Trần Thị B", phone: "0987654321", address: "Hồ Chí Minh", email: "tranthib@example.com" },
  ]);

  const [form, setForm] = useState<Customer>({
    id: 0,
    name: "",
    phone: "",
    address: "",
    email: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddCustomer = () => {
    if (!form.name || !form.phone || !form.address || !form.email) return;

    setCustomers([
      ...customers,
      { ...form, id: Date.now() },
    ]);

    setForm({ id: 0, name: "", phone: "", address: "", email: "" });
  };

  const handleEditCustomer = (customer: Customer) => {
    setForm(customer);
    setIsEditing(true);
  };

  const handleUpdateCustomer = () => {
    setCustomers(
      customers.map((c) =>
        c.id === form.id ? form : c
      )
    );

    setForm({ id: 0, name: "", phone: "", address: "", email: "" });
    setIsEditing(false);
  };

  const handleDeleteCustomer = (id: number) => {
    setCustomers(customers.filter((c) => c.id !== id));
  };

  return (
    <div>
      <AdminHeader />
      <SideBar />
      <div className="ml-80 p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-center">Quản Lý Khách Hàng</h1>

        {/* Form */}
        <div className="bg-white p-6 rounded shadow mb-8 max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-center">
            {isEditing ? "Chỉnh sửa khách hàng" : "Thêm khách hàng mới"}
          </h2>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              placeholder="Tên khách hàng"
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleInputChange}
              placeholder="Số điện thoại"
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleInputChange}
              placeholder="Địa chỉ"
              className="border p-2 rounded w-full"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="border p-2 rounded w-full"
            />
            {isEditing ? (
              <button
                onClick={handleUpdateCustomer}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Cập nhật
              </button>
            ) : (
              <button
                onClick={handleAddCustomer}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Thêm
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <table className="w-full bg-white shadow-md rounded-lg border border-gray-300">
          <thead className="bg-gray-200 border-b border-gray-300">
            <tr>
              <th className="text-left px-6 py-4 text-lg border-r border-gray-300">Tên</th>
              <th className="text-left px-6 py-4 text-lg border-r border-gray-300">Số điện thoại</th>
              <th className="text-left px-6 py-4 text-lg border-r border-gray-300">Địa chỉ</th>
              <th className="text-left px-6 py-4 text-lg border-r border-gray-300">Email</th>
              <th className="text-center px-6 py-4 text-lg">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-100">
                <td className="px-6 py-4 border-r border-gray-300">{customer.name}</td>
                <td className="px-6 py-4 border-r border-gray-300">{customer.phone}</td>
                <td className="px-6 py-4 border-r border-gray-300">{customer.address}</td>
                <td className="px-6 py-4 border-r border-gray-300">{customer.email}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleEditCustomer(customer)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 mr-2"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteCustomer(customer.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerPage;