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

  return (
    <div>
      <AdminHeader />
      <SideBar /> {/* Sidebar with fixed width */}
      <div className="ml-80 p-8 bg-gray-100 min-h-screen"> {/* Added margin-left */}
        <h1 className="text-3xl font-bold mb-8 text-center">Quản Lý Tài Khoản</h1>
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
    </div>
  );
};

export default AdminAccountsManagementPage;