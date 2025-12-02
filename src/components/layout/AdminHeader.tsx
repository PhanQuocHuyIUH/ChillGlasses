"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const AdminHeader = () => {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    alert("Đăng xuất thành công!");
    router.push("/login");
  };

  return (
    <header className="bg-cyan-900 shadow fixed top-0 left-0 right-0 w-full flex items-center justify-end px-6 py-4 border-b border-gray-300 z-50">
      {/* Admin Avatar + Name + Dropdown */}
      <div className="relative flex items-center gap-4 text-center">
        <Image
          src="/images/avatar.png"
          alt="Admin Avatar"
          width={55}
          height={55}
          className="rounded-full cursor-pointer"
          onClick={() => setShowDropdown((prev) => !prev)} // Toggle dropdown on click
        />

        <span
          className="font-bold text-lg text-white cursor-pointer"
          onClick={() => setShowDropdown((prev) => !prev)} // Toggle dropdown on click
        >
          Phan Quoc Huy
        </span>

        {/* Dropdown */}
        {showDropdown && (
          <div className="absolute top-16 right-0 bg-white border border-gray-300 rounded-lg shadow-lg w-48 z-50">
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