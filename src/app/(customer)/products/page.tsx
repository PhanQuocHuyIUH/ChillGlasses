"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getAllProducts } from "@/lib/api/products";
import { Product } from "@/types/product";

const PromotionPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [visibleProducts, setVisibleProducts] = useState(4);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await getAllProducts();

        console.log("API RAW products:", res);

        // API trả về mảng → set trực tiếp
        if (Array.isArray(res)) {
          setProducts(res);
        } else {
          console.error("Unexpected product response:", res);
          setProducts([]);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleLoadMore = () => {
    setVisibleProducts((prev) => prev + 4);
  };

  if (loading) {
    return <div className="text-center py-8">Đang tải sản phẩm...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  // Filter products to show only those on sale
  const discountedProducts = products.filter(
    (product) => product.formattedPrice
  );

  return (
    <div className="text-black w-full max-w-6xl mx-auto py-8 pt-24">
      <h1 className="text-3xl font-bold text-center mb-8">
        SẢN PHẨM ĐANG GIẢM GIÁ
      </h1>

      {discountedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {discountedProducts.slice(0, visibleProducts).map((product) => {
            const imageUrl =
              product.primaryImageUrl && product.primaryImageUrl.trim() !== ""
                ? product.primaryImageUrl
                : "/images/product1.jpg";

            return (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow block bg-white"
              >
                <div className="w-full h-40 relative mb-3">
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover rounded"
                  />
                </div>

                <h2 className="text-lg font-bold mt-1 line-clamp-2">
                  {product.name}
                </h2>

                <div className="mt-2">
                  <p className="text-gray-400 text-sm line-through">
                    {product.originalPrice.toLocaleString("vi-VN")} đ
                  </p>
                  <p className="text-red-600 font-semibold">
                    {product.formattedPrice || product.originalPrice.toLocaleString("vi-VN")} đ
                  </p>
                </div>

                {product.brand && (
                  <p className="text-xs text-gray-500 mt-1 uppercase">
                    {product.brand}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">Hiện chưa có sản phẩm giảm giá nào.</div>
      )}

      {visibleProducts < discountedProducts.length && (
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
};

export default PromotionPage;