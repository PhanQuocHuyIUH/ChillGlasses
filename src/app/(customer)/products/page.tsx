"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getAllProducts } from "@/lib/api/products";
import { Product } from "@/types/product";

const ProductListingPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [visibleProducts, setVisibleProducts] = useState(4);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await getAllProducts();

        console.log("API RAW:", res);

        // ✅ API trả về mảng → set trực tiếp
        setProducts(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleLoadMore = () => {
    setVisibleProducts((prev) => prev + 2);
  };

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="text-black container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        DANH SÁCH SẢN PHẨM
      </h1>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.slice(0, visibleProducts).map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow block"
            >
              <Image
                src={product.primaryImageUrl}
                alt={product.name}
                width={160}
                height={160}
                className="w-full h-40 object-cover rounded"
              />

              <h2 className="text-lg font-bold mt-4">{product.name}</h2>
              <p className="text-gray-600">Giá: {product.price}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">No products available.</div>
      )}

      {visibleProducts < products.length && (
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
