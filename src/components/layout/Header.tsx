"use client";

import { useEffect, useState } from "react";
import { FaSearch, FaShoppingCart, FaUserCircle } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/images/logo_chill_glasses.jpg";
import { useRouter } from "next/navigation";
import { requireLogin } from "@/lib/authClient";

const Header = () => {
  const [filters, setFilters] = useState({
    price: "",
    brand: "",
    style: "",
    material: "",
  });

  const [sort, setSort] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null); // Track active dropdown

  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSortChange = (value: string) => {
    setSort(value);
  };

  const handleSearch = () => {
    console.log("Từ khóa tìm kiếm:", searchTerm);
    console.log("Filters:", filters);
    console.log("Sort:", sort);
    setShowFilters(true);
  };

  // 🛒 Click icon giỏ hàng → nếu chưa login thì chặn + đưa sang /login
  const handleCartClick = () => {
    const blocked = requireLogin({
      router,
      redirectTo: "/cart",
      message: "Vui lòng đăng nhập để sử dụng giỏ hàng.",
    });

    if (!blocked) {
      router.push("/cart");
    }
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
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("gong-kinh")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <li>
                <Link href="/products/gong-kinh-can">
                  <button className="hover:bg-gray-100 hover:text-blue-500 font-bold px-8 py-2 rounded">
                    GỌNG KÍNH CẬN
                  </button>
                </Link>
              </li>

              {activeDropdown === "gong-kinh" && (
                <ul className="absolute left-0 mt-2 bg-white border rounded shadow-lg z-50">
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
              )}
            </div>

            {/* Kính râm dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("kinh-ram")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="hover:bg-gray-100 hover:text-blue-500 font-bold px-8 py-2 rounded">
                <Link href="/products/kinh-ram">KÍNH RÂM</Link>
              </button>

              {activeDropdown === "kinh-ram" && (
                <ul className="absolute left-0 mt-2 bg-white border rounded shadow-lg z-50">
                  <li>
                    <Link
                      href="/products/kinh-ram/kinh-ram-can"
                      className="block px-8 py-2 hover:bg-gray-100 hover:text-blue-500 font-bold whitespace-nowrap"
                    >
                      KÍNH RÂM CẬN
                    </Link>
                  </li>
                </ul>
              )}
            </div>

            {/* Tròng kính dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("trong-kinh")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <li>
                <Link href="/products/trong-kinh">
                  <button className="hover:bg-gray-100 hover:text-blue-500 font-bold px-8 py-2 rounded">
                    TRÒNG KÍNH
                  </button>
                </Link>
              </li>

              {activeDropdown === "trong-kinh" && (
                <ul className="absolute left-0 mt-2 bg-white border rounded shadow-lg z-50">
                  <li>
                    <Link
                      href="/products/trong-kinh/trong-doi-mau"
                      className="block px-8 py-2 hover:bg-gray-100 hover:text-blue-500 font-bold whitespace-nowrap"
                    >
                      TRÒNG ĐỔI MÀU
                    </Link>
                  </li>
                </ul>
              )}
            </div>

            {/* Không có dropdown */}
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


        {/* Search bar, cart, and login/user icons */}
        <div className="flex items-center space-x-4">
          {/* Search bar */}
          <div className="flex items-center border border-gray-300 rounded-md px-2 py-1">
            <FaSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="outline-none px-2 text-sm"
            />
            <button
              onClick={handleSearch}
              className="ml-2 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
            >
              Tìm
            </button>
          </div>

          {/* Shopping cart icon – dùng button + requireLogin */}
          <button
            type="button"
            onClick={handleCartClick}
            className="text-gray-500 hover:text-black"
          >
            <FaShoppingCart size={20} />
          </button>

          {/* Login/User icon */}
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