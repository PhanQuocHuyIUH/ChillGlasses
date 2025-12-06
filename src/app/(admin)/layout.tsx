"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/layout/AdminHeader";
import SideBar from "@/components/layout/SideBar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is logged in by checking token in localStorage
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (!token) {
          // No token, redirect to login
          router.push("/login");
          return;
        }

        if (role !== "ADMIN") {
          // User is not admin, redirect to customer page
          alert("Bạn không có quyền truy cập trang Admin!");
          router.push("/");
          return;
        }

        // Verify token with backend
        const response = await fetch("http://localhost:8080/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          // Token invalid or expired
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          router.push("/login");
          return;
        }

        const data = await response.json();
        const userRole = data.data?.role;

        if (userRole !== "ADMIN") {
          alert("Bạn không có quyền truy cập trang Admin!");
          router.push("/");
          return;
        }

        // User is authenticated and has ADMIN role
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error checking auth:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <SideBar />
        <main className="flex-1 ml-64 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
