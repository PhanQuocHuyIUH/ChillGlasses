"use client";

import AdminHeader from "@/components/layout/AdminHeader";
import SideBar from "@/components/layout/SideBar";
import { useState } from "react";

// npm install react-chartjs-2 chart.js
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const AdminDashBoardPage = () => {
  const [chartType, setChartType] = useState<"bar" | "pie">("bar"); // State to toggle chart type

  const [dashboardData] = useState({
    totalOrdersToday: 120,
    totalRevenueToday: "50,000,000đ",
    newUsersToday: 15,
    revenueByDate: {
      labels: ["01/10", "02/10", "03/10", "04/10", "05/10", "06/10", "07/10"],
      data: [10000000, 15000000, 20000000, 25000000, 30000000, 35000000, 40000000],
    },
    bestSellingProducts: [
      { name: "Sản phẩm 1", sold: 120 },
      { name: "Sản phẩm 2", sold: 100 },
      { name: "Sản phẩm 3", sold: 80 },
      { name: "Sản phẩm 4", sold: 60 },
    ],
  });

  const revenueChartData = {
    labels: dashboardData.revenueByDate.labels,
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: dashboardData.revenueByDate.data,
        backgroundColor: chartType === "bar" 
          ? "rgba(75, 192, 192, 0.6)" 
          : ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#FF6384"],
        borderColor: chartType === "bar" ? "rgba(75, 192, 192, 1)" : undefined,
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen overflow-auto bg-gray-100">
      <AdminHeader />
      <SideBar />
      <div className="ml-100 p-8"> {/* Added margin-left to prevent overlap */}
        <div className="bg-white shadow-md rounded-lg w-full max-w-6xl over mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Dashboard</h1>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 shadow-md rounded-lg p-4 text-center">
              <h2 className="text-lg font-bold mb-1">Tổng đơn hôm nay</h2>
              <p className="text-2xl font-bold text-blue-500">{dashboardData.totalOrdersToday}</p>
            </div>
            <div className="bg-gray-50 shadow-md rounded-lg p-4 text-center">
              <h2 className="text-lg font-bold mb-1">Doanh thu hôm nay</h2>
              <p className="text-2xl font-bold text-green-500">{dashboardData.totalRevenueToday}</p>
            </div>
            <div className="bg-gray-50 shadow-md rounded-lg p-4 text-center">
              <h2 className="text-lg font-bold mb-1">Người dùng mới</h2>
              <p className="text-2xl font-bold text-purple-500">{dashboardData.newUsersToday}</p>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-gray-50 shadow-md rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold">Doanh thu theo ngày</h2>
              <button
                onClick={() => setChartType((prev) => (prev === "bar" ? "pie" : "bar"))}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
              >
                Chuyển sang {chartType === "bar" ? "biểu đồ tròn" : "biểu đồ cột"}
              </button>
            </div>
            {chartType === "bar" ? (
              <Bar data={revenueChartData} />
            ) : (
              <Pie data={revenueChartData} />
            )}
          </div>

          {/* Best-Selling Products */}
          <div className="bg-gray-50 shadow-md rounded-lg p-4">
            <h2 className="text-lg font-bold mb-3">Sản phẩm bán chạy</h2>
            <ul className="space-y-3">
              {dashboardData.bestSellingProducts.map((product, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center border-b pb-1"
                >
                  <span className="text-sm">{product.name}</span>
                  <span className="font-bold text-sm">{product.sold} sản phẩm</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashBoardPage;