"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AdminHeader = () => {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ======================
  // LOAD ADMIN PROFILE
  // ======================
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) return;

        const res = await fetch("http://localhost:8080/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok) {
          setAdmin(data.data);
        }
      } catch (err) {
        console.error("Error loading admin", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, []);

  const handleLogout = () => {
    alert("Đăng xuất thành công!");
    sessionStorage.removeItem("token");
    router.push("/login");
  };

  const handleProfile = () => {
    router.push("/admin_profile");
  };

  if (loading) return null; // tránh nhấp nháy

  return (
    <header className="bg-cyan-900 shadow fixed top-0 left-0 right-0 w-full flex items-center justify-end px-6 py-4 border-b border-gray-300 z-50">
      <div className="relative flex items-center gap-4 text-center">

        {/* Avatar */}
        <Image
          src={admin?.avatar || "/default-avatar.png"}
          alt="Admin Avatar"
          width={55}
          height={55}
          className="rounded-full cursor-pointer"
          unoptimized
          onClick={() => setShowDropdown((prev) => !prev)}
        />

        {/* Name */}
        <span
          className="font-bold text-lg text-white cursor-pointer"
          onClick={() => setShowDropdown((prev) => !prev)}
        >
          {admin?.fullName || "Admin"}
        </span>

        {/* Dropdown */}
        {showDropdown && (
          <div className="absolute top-16 right-0 bg-white border border-gray-300 rounded-lg shadow-lg w-48 z-50">
            <button
              onClick={handleProfile}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              My Profile
            </button>

            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;
