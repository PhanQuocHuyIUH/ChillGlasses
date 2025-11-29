"use client";

import Image from "next/image"; // Import Image from next/image
import { useRouter } from "next/navigation"; // Correct import path for useRouter in Next.js 13

const AdminHeader = () => {
  const router = useRouter();

  // Logout handler
  const handleLogout = () => {
    // Perform logout logic here
    alert("Đăng xuất thành công!");
    router.push("/login"); // Redirect to the login page
  };

  return (
      <div className="bg-amber-50 shadow fixed top-0 w-full flex items-center justify-center px-6 py-4 border-b border-gray-300">
        {/* Admin Name, Avatar, and Logout Button */}
        <div className="flex flex-row items-center gap-6 text-center">
        <Image
            src="/images/avatar.png"
            alt="Admin Avatar"
            width={90}
            height={90}
            className="rounded-full"
        />
        <span className="font-bold text-lg text-gray-800">Phan Quoc Huy</span>
        <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
            Logout
        </button>
        </div>
    </div>
  );
};

export default AdminHeader;