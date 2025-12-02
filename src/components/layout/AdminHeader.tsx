"use client";

import Image from "next/image"; // Import Image from next/image
import { useRouter } from "next/navigation"; // Correct import path for useRouter in Next.js 13
import { useState } from "react";

const AdminHeader = () => {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false); // State to control dropdown visibility

  // Logout handler
  const handleLogout = () => {
    alert("Đăng xuất thành công!");
    router.push("/login"); // Redirect to the login page
  };

  return (
    <div className="bg-cyan-900 shadow fixed top-0 w-screen flex items-center justify-end px-6 py-4 border-b border-gray-300">
      {/* Admin Name, Avatar, and Dropdown Menu */}
      <div
        className="relative flex items-center gap-6 text-center"
        onMouseEnter={() => setShowDropdown(true)} // Show dropdown on hover
        onMouseLeave={() => setShowDropdown(false)} // Hide dropdown when hover ends
      >
        <Image
          src="/images/avatar.png"
          alt="Admin Avatar"
          width={90}
          height={90}
          className="rounded-full cursor-pointer"
        />
        <span className="font-bold text-lg text-white">Phan Quoc Huy</span>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute top-20 right-0 bg-white border border-gray-300 rounded-lg shadow-lg w-48">
            <button
              onClick={() => router.push("/profile")} // Navigate to profile page
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
    </div>
  );
};

export default AdminHeader;