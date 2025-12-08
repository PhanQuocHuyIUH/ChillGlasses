"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Product } from "@/types/product";
import Link from "next/link";

const ResultPage = () => {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      keyword: searchTerm,
    }));
  }, [searchTerm]);

  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [categories, setCategories] = useState<
    { id: number; name: string }[]
  >([]);

  const [filters, setFilters] = useState({
    keyword: searchTerm,
    brand: "",
    categoryId: "",
    minPrice: "",
    maxPrice: "",
    inStock: false,
    sortBy: "createdAt",
    sortDir: "desc",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const query = new URLSearchParams();

        if (filters.keyword) query.append("keyword", filters.keyword);
        if (filters.brand) query.append("brand", filters.brand);
        if (filters.categoryId) query.append("categoryId", filters.categoryId);
        if (filters.minPrice) query.append("minPrice", filters.minPrice);
        if (filters.maxPrice) query.append("maxPrice", filters.maxPrice);
        if (filters.inStock) query.append("inStock", "true");

        query.append("page", "0");
        query.append("size", "20");

        query.append("sortBy", filters.sortBy);
        query.append("sortDir", filters.sortDir);

        const response = await fetch(
          `http://localhost:8080/api/products?${query.toString()}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch products (${response.status})`);
        }

        const data = await response.json();

        // ✔ FIX: lấy đúng cấu trúc API backend
        const list = data?.data?.content || [];

        setProducts(list);

        // ✔ Unique brand list
        const uniqueBrands = [
          ...new Set(list.map((p: Product) => p.brand)),
        ].filter(Boolean);
        setBrands(uniqueBrands);

        // ✔ Unique category list
        const uniqueCategories = [
          ...new Map(
            list.map((p: Product) => [
              p.categoryId,
              {
                id: p.categoryId,
                name: p.categoryName,
              },
            ])
          ).values(),
        ];
        setCategories(uniqueCategories);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  const updateFilter = (key: string, value: unknown) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Kết quả tìm kiếm cho &quot;{searchTerm}&quot
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* Brand */}
        <select
          className="border px-3 py-2 rounded"
          value={filters.brand}
          onChange={(e) => updateFilter("brand", e.target.value)}
        >
          <option value="">Thương hiệu</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        {/* Category */}
        <select
          className="border px-3 py-2 rounded"
          value={filters.categoryId}
          onChange={(e) => updateFilter("categoryId", e.target.value)}
        >
          <option value="">Danh mục</option>
          {categories.map((c) => (
            <option key={c.id} value={String(c.id)}>
              {c.name}
            </option>
          ))}
        </select>

        {/* In Stock */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) => updateFilter("inStock", e.target.checked)}
          />
          Còn hàng
        </label>

        {/* Min Price */}
        <input
          type="number"
          placeholder="Giá thấp nhất"
          className="border px-3 py-2 rounded"
          value={filters.minPrice}
          onChange={(e) => updateFilter("minPrice", e.target.value)}
        />

        {/* Max Price */}
        <input
          type="number"
          placeholder="Giá cao nhất"
          className="border px-3 py-2 rounded"
          value={filters.maxPrice}
          onChange={(e) => updateFilter("maxPrice", e.target.value)}
        />

        {/* Sort */}
        <select
          className="border px-3 py-2 rounded"
          value={filters.sortBy}
          onChange={(e) => updateFilter("sortBy", e.target.value)}
        >
          <option value="createdAt">Mới nhất</option>
          <option value="price">Giá</option>
          <option value="rating">Đánh giá</option>
          <option value="name">Tên</option>
        </select>

        <select
          className="border px-3 py-2 rounded"
          value={filters.sortDir}
          onChange={(e) => updateFilter("sortDir", e.target.value)}
        >
          <option value="asc">Tăng</option>
          <option value="desc">Giảm</option>
        </select>
      </div>

      {/* Error */}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Product List */}
      {loading ? (
        <div className="text-center py-10">Đang tải sản phẩm...</div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="border p-4 rounded shadow hover:shadow-lg"
            >
              <Image
                src={product.primaryImageUrl || "/images/placeholder.jpg"}
                alt={product.name}
                width={160}
                height={160}
                className="w-full h-40 object-cover rounded"
                unoptimized
              />
              <h2 className="font-bold mt-2">{product.name}</h2>

              {/* Price */}
              <p className="text-gray-600">{product.formattedPrice}</p>
              {product.originalPrice > product.price && (
                <p className="text-red-500 line-through text-sm">
                  {product.formattedOriginalPrice}
                </p>
              )}

              <p className="text-sm text-gray-500">{product.brand}</p>
              <p className="text-sm">Kho: {product.stockQuantity}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-10">
          Không tìm thấy sản phẩm nào.
        </div>
      )}
    </div>
  );
};

export default ResultPage;
