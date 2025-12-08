"use client";

import { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Link from "next/link";
import { getAllProducts } from "@/lib/api/products";
import { Product } from "@/types/product";
import Image from "next/image";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getAllProducts();

        console.log("Fetched products:", data);

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const renderProductImage = (product: Product) => {
  // 1️⃣ primaryImageUrl (backend trả về)
  let imageUrl = product.primaryImageUrl;

  // 2️⃣ Nếu chưa có → fallback ảnh trong mảng images
  if ((!imageUrl || imageUrl.trim() === "") && Array.isArray(product.images)) {
    const primaryImage = product.images.find((img) => img.isPrimary);
    imageUrl = primaryImage?.imageUrl || "";
  }

  // 3️⃣ Cuối cùng fallback placeholder
  if (!imageUrl || imageUrl.trim() === "") {
    imageUrl = "/images/placeholder.jpg";
  }

    return (
       <Image
      src={imageUrl}
      alt={product.name}
      width={160}
      height={160}
      className="w-full h-40 object-cover rounded"
      onError={(e) => {
        (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
      }}
    />
    );
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-amber-50 text-black">
      <Header />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 pb-20">
        {/* Banner */}
        <section className="w-full bg-linear-to-r from-blue-500 to-indigo-500 text-white py-16 text-center rounded-b-lg shadow-md mb-8">
          <h1 className="text-4xl font-bold">
            Chào mừng đến với Chill Glasses
          </h1>
          <p className="mt-4 text-lg">
            Khám phá các sản phẩm kính thời trang và chất lượng cao
          </p>
        </section>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">
            Đang tải dữ liệu sản phẩm...
          </div>
        ) : (
          <>
            {/* Featured Products */}
            <section className="py-12">
              <h2 className="text-2xl font-bold text-center mb-8">
                Sản phẩm nổi bật
              </h2>

              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {products.slice(0, 4).map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      className="border rounded-lg p-4 shadow hover:shadow-lg cursor-pointer block bg-white transition-transform hover:-translate-y-1"
                    >
                      <div>
                        {renderProductImage(product)}
                        <h3 className="text-lg font-bold mt-4 line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-red-600 font-bold mt-2">
                          {product.formattedPrice}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">
                  Chưa có sản phẩm nào.
                </p>
              )}
            </section>

            {/* Promotions */}
            <section className="w-full bg-linear-to-r from-red-500 to-yellow-500 text-white py-16 text-center rounded-lg shadow-lg">
              <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold">Khuyến mãi hấp dẫn</h2>
                <p className="mt-4 text-lg">
                  Giảm giá cực sốc cho các sản phẩm kính thời trang
                </p>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {products.length > 4 ? (
                    products.slice(4, 8).map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        className="border rounded-lg p-4 shadow hover:shadow-lg bg-white text-black block transition-transform hover:-translate-y-1"
                      >
                        <div>
                          {renderProductImage(product)}
                          <h3 className="text-lg font-bold mt-4 line-clamp-1">
                            {product.name}
                          </h3>

                          <div className="mt-2">
                            <p className="text-gray-400 text-sm line-through">
                              {(product.originalPrice).toLocaleString("vi-VN")}đ
                            </p>
                            <p className="text-red-500 font-bold text-lg">
                              {product.formattedPrice}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="col-span-4 py-8">
                      <p>Đang cập nhật thêm chương trình khuyến mãi...</p>
                    </div>
                  )}
                </div>

                <Link href="/products">
                  <button className="mt-8 bg-white text-red-500 px-8 py-3 rounded-full font-bold hover:bg-gray-100 shadow-md transition">
                    Xem tất cả khuyến mãi
                  </button>
                </Link>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
