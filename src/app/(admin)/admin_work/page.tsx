"use client";

import AdminHeader from "@/components/layout/AdminHeader";
import Link from "next/link"; // Import Link from next/link

const DashBoard = () => {
  const sections = [
    { name: "Dashboard", path: "/admin_dashboard" },
    { name: "Sản phẩm", path: "/admin_products" },
    { name: "Danh mục", path: "/admin_categories" },
    { name: "Đơn hàng", path: "/admin_orders" },
    { name: "Khách hàng", path: "/admin_customers" },
    { name: "Đánh giá", path: "/admin_ratings" },
    { name: "Tài khoản", path: "/admin_accounts" },
  ];

  return (
    <div>
      <AdminHeader />
      <div className="h-screen flex justify-center bg-gray-100">
        <div className="text-center ml-120 mt-30">
          <h1 className="text-3xl font-bold mb-8">Các mục làm việc của Quản Trị Viên</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full mx-auto">
            {sections.map((section) => (
              <Link
                key={section.path}
                href={section.path} // Use Link for navigation
                className="bg-linear-to-r from-blue-500 to-indigo-500 text-white font-semibold text-2xl py-6 px-4 rounded-lg shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-indigo-600 transition duration-300 transform hover:scale-105 text-center block"
              >
                {section.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;