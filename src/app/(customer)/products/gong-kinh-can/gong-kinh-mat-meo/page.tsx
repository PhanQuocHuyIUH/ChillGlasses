"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { getProductsByCategory } from "@/lib/api/products";

const CATEGORY_ID = 4; // Gọng kính mắt mèo

export default function GongKinhMatMeoPage() {
  const [products, setProducts] = useState<Product[]>([]);
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
          setProducts([]); // Fallback về mảng rỗng để không lỗi giao diện
        }
      } catch (err) {
        console.error("Load failed:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="text-center py-10">Đang tải...</div>;

  return (
    <div className="container mx-auto py-8 text-black">
      <h1 className="text-3xl font-bold mb-6 text-center">Gọng Kính Mắt Mèo</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="border p-4 rounded shadow hover:shadow-lg"
          >
            <Image
              src={product.primaryImageUrl}
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
    </div>
  );
}