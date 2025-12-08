"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { getProductsByCategory } from "@/lib/api/products";

const CATEGORY_ID = 11; // Tròng kính đổi màu

export default function TrongKinhDoiMauPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [visibleProducts, setVisibleProducts] = useState(8); // Number of products to display initially
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getProductsByCategory(CATEGORY_ID);
        console.log("Dữ liệu API trả về:", data);

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("Dữ liệu không phải là mảng:", data);
          setProducts([]);
        }
      } catch (err) {
        console.error("Load failed:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleLoadMore = () => {
    setVisibleProducts((prev) => prev + 8); // Load 8 more products
  };

  if (loading) return <div className="text-center py-10">Đang tải...</div>;

  return (
    <div className="container mx-auto py-8 text-black">
      <h1 className="text-3xl font-bold mb-6 text-center">Tròng Kính Đổi Màu</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.slice(0, visibleProducts).map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="border p-4 rounded shadow hover:shadow-lg"
          >
            <Image
              src={product.primaryImageUrl || "/images/placeholder.jpg"}
              alt={product.name}
              width={200}
              height={200}
              className="w-full h-40 object-cover rounded"
            />

            <h2 className="font-bold mt-2">{product.name}</h2>
            <p>{product.formattedPrice}</p>
          </Link>
        ))}
      </div>

      {visibleProducts < products.length && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Xem thêm
          </button>
        </div>
      )}
    </div>
  );
}