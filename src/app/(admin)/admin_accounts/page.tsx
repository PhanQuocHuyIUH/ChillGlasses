"use client";

import { useState } from "react";
import AdminHeader from "@/components/layout/AdminHeader";
import SideBar from "@/components/layout/SideBar";

interface User {
  id: number;
  name: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
  status: "active" | "locked";
}

const AdminAccountsManagementPage = () => {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "Nguyễn Văn A", email: "nguyenvana@example.com", role: "CUSTOMER", status: "active" },
    { id: 2, name: "Trần Thị B", email: "tranthib@example.com", role: "ADMIN", status: "locked" },
    { id: 3, name: "Lê Văn C", email: "levanc@example.com", role: "CUSTOMER", status: "active" },
    { id: 4, name: "Phan Quốc Huy", email: "phanquochuy@example.com", role: "ADMIN", status: "active" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState<User>({
    id: 0,
    name: "",
    email: "",
    role: "CUSTOMER",
    status: "active",
  });

  const toggleStatus = (id: number) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id
          ? { ...user, status: user.status === "active" ? "locked" : "active" }
          : user
      )
    );
  };

  const changeRole = (id: number) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id
          ? { ...user, role: user.role === "CUSTOMER" ? "ADMIN" : "CUSTOMER" }
          : user
      )
    );
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      alert("Vui lòng điền đầy đủ thông tin tài khoản!");
      return;
    }

    setUsers((prevUsers) => [
      ...prevUsers,
      { ...newUser, id: Date.now() }, // Assign a unique ID
    ]);
    setShowModal(false); // Close the modal
    setNewUser({ id: 0, name: "", email: "", role: "CUSTOMER", status: "active" }); // Reset form
  };

  return (
    <div>
      <AdminHeader />
      <SideBar />
      <div className="ml-80 p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-8 text-center">Quản Lý Tài Khoản</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 mb-6"
        >
          Thêm tài khoản mới
        </button>
        <table className="w-full bg-white shadow-md rounded-lg border border-gray-300">
          <thead className="bg-gray-200 border-b border-gray-300">
            <tr>
              <th className="text-left px-6 py-4 text-lg border-r border-gray-300">Tên</th>
              <th className="text-left px-6 py-4 text-lg border-r border-gray-300">Email</th>
              <th className="text-left px-6 py-4 text-lg border-r border-gray-300">Vai trò</th>
              <th className="text-left px-6 py-4 text-lg border-r border-gray-300">Trạng thái</th>
              <th className="text-center px-6 py-4 text-lg">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-100">
                <td className="px-6 py-4 border-r border-gray-300">{user.name}</td>
                <td className="px-6 py-4 border-r border-gray-300">{user.email}</td>
                <td className="px-6 py-4 border-r border-gray-300">{user.role}</td>
                <td className="px-6 py-4 border-r border-gray-300">
                  {user.status === "active" ? "Hoạt động" : "Bị khóa"}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => toggleStatus(user.id)}
                    className={`px-4 py-2 rounded-lg ${
                      user.status === "active"
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-green-500 text-white hover:bg-green-600"
                    } mr-2`}
                  >
                    {user.status === "active" ? "Khóa" : "Mở khóa"}
                  </button>
                  <button
                    onClick={() => changeRole(user.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Chỉnh vai trò
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for adding a new user */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Thêm tài khoản mới</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Tên</label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="Nhập tên"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="Nhập email"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Vai trò</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as User["role"] })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="CUSTOMER">CUSTOMER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Trạng thái</label>
              <select
                value={newUser.status}
                onChange={(e) => setNewUser({ ...newUser, status: e.target.value as User["status"] })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="active">Hoạt động</option>
                <option value="locked">Bị khóa</option>
              </select>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={handleAddUser}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAccountsManagementPage;