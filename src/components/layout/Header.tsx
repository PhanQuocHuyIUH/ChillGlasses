"use client";

import { useState } from "react";
import { FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/images/logo_chill_glasses.jpg";

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

  return (
    <header className="bg-white text-black w-full fixed top-0 z-50 shadow-md">
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
        <nav>
          <ul className="hidden md:flex space-x-6">
            <li>
              <Link href="/products">
                <button className="hover:text-gray-500 font-bold px-4 py-2">
                  GỌNG KÍNH CẬN
                </button>
              </Link>
            </li>
            <li>
              <Link href="/products">
                <button className="hover:text-gray-500 font-bold px-4 py-2">
                  TRÒNG ĐỔI MÀU
                </button>
              </Link>
            </li>
            <li>
              <Link href="/products">
                <button className="hover:text-gray-500 font-bold px-4 py-2">
                  KÍNH RÂM
                </button>
              </Link>
            </li>
            <li>
              <Link href="/products">
                <button className="hover:text-gray-500 font-bold px-4 py-2">
                  KHUYẾN MÃI
                </button>
              </Link>
            </li>
            <li>
              <Link href="/about-us">
                <button className="hover:text-gray-500 font-bold px-4 py-2">
                  GIỚI THIỆU
                </button>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Search bar, cart, and login icons */}
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
          {/* Shopping cart icon */}
          <button className="text-gray-500 hover:text-black">
            <FaShoppingCart size={20} />
          </button>
          {/* Login icon */}
          <button className="text-gray-500 hover:text-black flex items-center">
            <FaUser size={20} className="mr-2" />
            <span className="hidden md:inline">Đăng nhập</span>
          </button>
        </div>
      </div>

      {/* Filter và Sort */}
      {showFilters && (
        <div className="bg-gray-100 py-4">
          <div className="container mx-auto flex flex-wrap items-center justify-between">
            {/* Filter */}
            <div className="flex flex-wrap space-x-4">
              <select
                className="border rounded px-4 py-2"
                value={filters.price}
                onChange={(e) => handleFilterChange("price", e.target.value)}
              >
                <option value="">Lọc theo giá</option>
                <option value="low">Thấp đến cao</option>
                <option value="high">Cao đến thấp</option>
              </select>
              <select
                className="border rounded px-4 py-2"
                value={filters.brand}
                onChange={(e) => handleFilterChange("brand", e.target.value)}
              >
                <option value="">Lọc theo thương hiệu</option>
                <option value="brand1">Gucci</option>
                <option value="brand2">Prada</option>
              </select>
              <select
                className="border rounded px-4 py-2"
                value={filters.style}
                onChange={(e) => handleFilterChange("style", e.target.value)}
              >
                <option value="">Lọc theo kiểu dáng</option>
                <option value="style1">Nam</option>
                <option value="style2">Nữ</option>
              </select>
              <select
                className="border rounded px-4 py-2"
                value={filters.material}
                onChange={(e) => handleFilterChange("material", e.target.value)}
              >
                <option value="">Lọc theo chất liệu</option>
                <option value="material1">Nhựa</option>
                <option value="material2">Kim loại</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex space-x-4">
              <select
                className="border rounded px-4 py-2"
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <option value="">Sắp xếp</option>
                <option value="asc">Giá tăng dần</option>
                <option value="desc">Giá giảm dần</option>
                <option value="newest">Mới nhất</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;