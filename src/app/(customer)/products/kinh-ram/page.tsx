"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getProductsByCategory } from "@/lib/api/products";
import { Product } from "@/types/product";

const CATEGORY_ID = 2; // ID cho Kính Râm

export default function KinhRamPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [visibleProducts, setVisibleProducts] = useState(8); // Number of products to display initially
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // Gọi API lấy riêng danh mục Kính Râm
        const data = await getProductsByCategory(CATEGORY_ID);
        console.log("Dữ liệu Kính Râm:", data);

        // Kiểm tra an toàn: Đảm bảo data là mảng trước khi set state
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("Dữ liệu trả về không phải mảng:", data);
          setProducts([]); // Fallback về mảng rỗng để không lỗi giao diện
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleLoadMore = () => {
    setVisibleProducts((prev) => prev + 8); // Load 8 more products
  };

  if (loading) return <div className="text-center py-8">Đang tải sản phẩm...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="text-black container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">KÍNH RÂM</h1>

      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.slice(0, visibleProducts).map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="border rounded p-4 shadow hover:shadow-lg transition-shadow block"
              >
                <Image
                  src={product.primaryImageUrl || "/images/placeholder.jpg"}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="w-full h-40 object-cover rounded"
                />

                <h2 className="font-bold mt-2 text-lg">{product.name}</h2>

                <p className="text-gray-600 mt-1">{product.formattedPrice}</p>
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
        </>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Hiện tại chưa có sản phẩm Kính Râm nào.
        </div>
      )}
    </div>
  );
}