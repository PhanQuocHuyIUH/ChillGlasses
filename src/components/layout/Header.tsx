"use client";

import { useEffect, useState } from "react";
import { FaSearch, FaShoppingCart, FaUserCircle } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/images/logo_chill_glasses.jpg";
import { useRouter } from "next/navigation";
// ❌ BỎ requireLogin vì giỏ khách vãng lai không cần bắt login
// import { requireLogin } from "@/lib/authClient";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (token) setIsLoggedIn(true);
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/results?search=${searchTerm}`);
    }
  };

  // ✅ Sửa lại: luôn cho vào /cart, không requireLogin nữa
  const handleCartClick = () => {
    router.push("/cart");
  };

  return (
      <header className="bg-white text-black w-full fixed h-20 top-0 z-50 shadow-md">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
                src={logo}
                alt="Logo Chill Glasses"
                width={120}
                height={60}
                priority
                className="h-auto w-auto md:h-16"
            />
          </Link>

          {/* Menu */}
          <nav>
            <ul className="hidden md:flex space-x-6">

              {/* Gọng kính cận dropdown */}
              <li className="relative group cursor-pointer">

                {/* Nút chính */}
                <Link href="/products/gong-kinh-can">
                  <button className="hover:bg-gray-100 hover:text-blue-500 font-bold px-8 py-2 rounded">
                    GỌNG KÍNH CẬN
                  </button>
                </Link>

                {/* Dropdown */}
                <ul className="absolute left-0 mt-1 bg-white border rounded shadow-lg z-50 hidden group-hover:block">
                  <li>
                    <Link
                        href="/products/gong-kinh-can/gong-kinh-mat-meo"
                        className="block px-8 py-2 hover:bg-gray-100 hover:text-blue-500 font-bold whitespace-nowrap"
                    >
                      GỌNG KÍNH MẮT MÈO
                    </Link>
                  </li>

                  <li>
                    <Link
                        href="/products/gong-kinh-can/gong-kinh-titan"
                        className="block px-8 py-2 hover:bg-gray-100 hover:text-blue-500 font-bold whitespace-nowrap"
                    >
                      GỌNG KÍNH TITAN CAO CẤP
                    </Link>
                  </li>
                </ul>

              </li>

              {/* Kính râm dropdown */}
              <li className="relative group cursor-pointer">
                <Link href="/products/kinh-ram">
                  <button className="hover:bg-gray-100 hover:text-blue-500 font-bold px-8 py-2 rounded">
                    KÍNH RÂM
                  </button>
                </Link>

                <ul className="absolute left-0 bg-white border rounded shadow-lg z-50 hidden group-hover:block">
                  <li>
                    <Link
                        href="/products/kinh-ram/kinh-ram-can"
                        className="block px-8 py-2 hover:bg-gray-100 hover:text-blue-500 font-bold whitespace-nowrap"
                    >
                      KÍNH RÂM CẬN
                    </Link>
                  </li>
                </ul>

              </li>

              {/* Tròng kính dropdown */}
              <li className="relative group cursor-pointer">
                <Link href="/products/trong-kinh">
                  <button className="hover:bg-gray-100 hover:text-blue-500 font-bold px-8 py-2 rounded">
                    TRÒNG KÍNH
                  </button>
                </Link>

                <ul className="absolute left-0 bg-white border rounded shadow-lg z-50 hidden group-hover:block">
                  <li>
                    <Link
                        href="/products/trong-kinh/trong-doi-mau"
                        className="block px-8 py-2 hover:bg-gray-100 hover:text-blue-500 font-bold whitespace-nowrap"
                    >
                      TRÒNG ĐỔI MÀU
                    </Link>
                  </li>
                </ul>
              </li>

              <li>
                <Link href="/products">
                  <button className="hover:bg-gray-100 hover:text-blue-500 font-bold px-8 py-2 rounded">
                    KHUYẾN MÃI
                  </button>
                </Link>
              </li>

              <li>
                <Link href="/about-us">
                  <button className="hover:bg-gray-100 hover:text-blue-500 font-bold px-8 py-2 rounded">
                    GIỚI THIỆU
                  </button>
                </Link>
              </li>

            </ul>
          </nav>

          {/* Search + Cart + Login */}
          <div className="flex items-center space-x-4">

            {/* Search */}
            <div className="flex items-center border border-gray-300 rounded-md px-2 py-1">
              <FaSearch className="text-gray-500" />
              <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch(); // <-- Nhấn Enter trong input để tìm
                    }
                  }}
                  className="outline-none px-2 text-sm"
              />
              <button
                  onClick={handleSearch}
                  className="ml-2 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
              >
                Tìm
              </button>
            </div>

            {/* Cart */}
            <button
                type="button"
                onClick={handleCartClick}
                className="text-gray-500 hover:text-black"
            >
              <FaShoppingCart size={20} />
            </button>

            {/* Login/User */}
            {isLoggedIn ? (
                <Link href="/profile">
                  <button className="text-gray-500 hover:text-black flex items-center">
                    <FaUserCircle size={24} className="mr-2" />
                    <span className="hidden md:inline">Tài khoản</span>
                  </button>
                </Link>
            ) : (
                <Link href="/login">
                  <button className="text-gray-500 hover:text-black flex items-center">
                    <FaUserCircle size={20} className="mr-2" />
                    <span className="hidden md:inline">Đăng nhập</span>
                  </button>
                </Link>
            )}
          </div>
        </div>
      </header>
  );
};

export default Header;
