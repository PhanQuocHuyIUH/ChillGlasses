"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getProductsByCategory } from "@/lib/api/products";
import { Product } from "@/types/product";

const CATEGORY_ID = 11; // ID cho Tròng Đổi Màu

export default function TrongDoiMauPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        // Gọi API lấy sản phẩm theo Category ID = 11
        const data = await getProductsByCategory(CATEGORY_ID);
        console.log("Dữ liệu Tròng Đổi Màu:", data);

        // Kiểm tra an toàn: Chỉ set state nếu data là mảng
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("Dữ liệu trả về không phải mảng:", data);
          setProducts([]); 
        }
      } catch (err) {
        console.error("Lỗi tải trang:", err);
        setError("Không thể tải danh sách sản phẩm.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="text-center py-10">Đang tải...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto py-8 text-black">
      {/* Tiêu đề căn giữa */}
      <h1 className="text-3xl font-bold mb-8 text-center uppercase">
        Tròng Đổi Màu
      </h1>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="border p-4 rounded shadow hover:shadow-lg transition-shadow block"
            >
              <Image
                src={product.primaryImageUrl}
                alt={product.name}
                width={200}
                height={200}
                className="w-full h-40 object-cover rounded"
              />

              <h2 className="font-bold mt-3 text-lg">{product.name}</h2>
              <p className="text-gray-600 mt-1">{product.formattedPrice}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          Hiện chưa có sản phẩm tròng đổi màu nào.
        </div>
      )}
    </div>
  );
}