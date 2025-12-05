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
  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddCustomer = () => {
    if (!form.name || !form.phone || !form.address || !form.email) {
      alert("Vui lòng điền đầy đủ thông tin khách hàng!");
      return;
    }

    setCustomers([
      ...customers,
      { ...form, id: Date.now() },
    ]);

    setForm({ id: 0, name: "", phone: "", address: "", email: "" });
    setShowModal(false);
  };

  const handleEditCustomer = (customer: Customer) => {
    setForm(customer);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleUpdateCustomer = () => {
    setCustomers(
      customers.map((c) =>
        c.id === form.id ? form : c
      )
    );

    setForm({ id: 0, name: "", phone: "", address: "", email: "" });
    setIsEditing(false);
    setShowModal(false);
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

        {/* Add Customer Button */}
        <button
          onClick={() => {
            setForm({ id: 0, name: "", phone: "", address: "", email: "" });
            setIsEditing(false);
            setShowModal(true);
          }}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 mb-6"
        >
          Thêm khách hàng mới
        </button>

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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4 text-center">
              {isEditing ? "Chỉnh sửa khách hàng" : "Thêm khách hàng mới"}
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Tên khách hàng</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Nhập tên khách hàng"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Số điện thoại</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Nhập số điện thoại"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Địa chỉ</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Nhập địa chỉ"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Nhập email"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={isEditing ? handleUpdateCustomer : handleAddCustomer}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {isEditing ? "Cập nhật" : "Thêm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerPage;