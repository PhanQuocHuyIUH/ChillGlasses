"use client";

import { useState } from "react";
import Image from "next/image";
import product1 from "@/../public/images/product1.jpg";
import product2 from "@/../public/images/product2.jpg";
import product3 from "@/../public/images/product3.jpg";
import product4 from "@/../public/images/product4.jpg";


const allProducts = [
  {
    id: 1,
    name: "Sản phẩm 1",
    price: "500.000đ",
    rating: 4.5,
    image: product1,
  },
  {
    id: 2,
    name: "Sản phẩm 2",
    price: "700.000đ",
    rating: 4.0,
    image: product2,
  },
  {
    id: 3,
    name: "Sản phẩm 3",
    price: "1.000.000đ",
    rating: 5.0,
    image: product3,
  },
  {
    id: 4,
    name: "Sản phẩm 4",
    price: "1.200.000đ",
    rating: 3.5,
    image: product4,
  },
  {
    id: 5,
    name: "Sản phẩm 5",
    price: "800.000đ",
    rating: 4.2,
    image: product1,
  },
  {
    id: 6,
    name: "Sản phẩm 6",
    price: "600.000đ",
    rating: 4.8,
    image: product2,
  },
];

const ProductListingPage = () => {
  const [visibleProducts, setVisibleProducts] = useState(4); // Số lượng sản phẩm hiển thị ban đầu

  // Hàm xử lý khi nhấn nút Load More
  const handleLoadMore = () => {
    setVisibleProducts((prev) => prev + 2); // Hiển thị thêm 2 sản phẩm mỗi lần nhấn
  };

  return (
    <div className="text-black container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">DANH SÁCH SẢN PHẨM</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {allProducts.slice(0, visibleProducts).map((product) => (
          <div
            key={product.id}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow"
          >
            <Image
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover rounded"
              width={160}
              height={160}
            />
            <h2 className="text-lg font-bold mt-4">{product.name}</h2>
            <p className="text-gray-600 mt-2">Giá: {product.price}</p>
            <p className="text-yellow-500 mt-2">Rating: {product.rating} ⭐</p>
          </div>
        ))}
      </div>
      {visibleProducts < allProducts.length && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductListingPage;