"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "@/types/product";
import Image from "next/image";

const ResultPage = () => {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

  const [filters, setFilters] = useState({
    searchTerm,
    brand: "",
    categoryName: "",
    minPrice: "",
    maxPrice: "",
    inStock: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products based on filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const query = new URLSearchParams();

        if (filters.searchTerm) query.append("keyword", filters.searchTerm);
        if (filters.brand) query.append("brand", filters.brand);
        if (filters.categoryName) query.append("category", filters.categoryName);
        if (filters.minPrice) query.append("minPrice", filters.minPrice);
        if (filters.maxPrice) query.append("maxPrice", filters.maxPrice);
        if (filters.inStock) query.append("inStock", "true");

        query.append("page", "0");
        query.append("size", "10");
        query.append("sortBy", "id");
        query.append("sortDir", "asc");

        const response = await fetch(
          `http://localhost:8080/api/products/search?${query.toString()}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch products (${response.status})`);
        }

        const data = await response.json();
        const list = data.content || [];
        setProducts(list);

        // Extract unique brands
        const uniqueBrands = [...new Set(list.map((p: Product) => p.brand))].filter(Boolean);
        setBrands(uniqueBrands);

        // Extract unique categories
        const uniqueCategories = [
          ...new Map(
            list.map((p: Product) => [
              p.categoryId,
              { id: p.categoryId, name: p.categoryName },
            ])
          ).values(),
        ];
        setCategories(uniqueCategories);
      } catch (err: any) {
        setError(err.message || "Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  // Update filter state
  const updateFilter = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6 text-center">
        Kết quả tìm kiếm cho &quot;{searchTerm}&quot;
      </h1>

      {/* Filter UI */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* Brand */}
        <select
          className="border px-3 py-2 rounded w-full md:w-auto flex-1"
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
          className="border px-3 py-2 rounded w-full md:w-auto flex-1"
          value={filters.categoryName}
          onChange={(e) => updateFilter("categoryName", e.target.value)}
        >
          <option value="">Danh mục</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
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
          className="border px-3 py-2 rounded w-full md:w-auto flex-1"
          value={filters.minPrice}
          onChange={(e) => updateFilter("minPrice", e.target.value)}
        />

        {/* Max Price */}
        <input
          type="number"
          placeholder="Giá cao nhất"
          className="border px-3 py-2 rounded w-full md:w-auto flex-1"
          value={filters.maxPrice}
          onChange={(e) => updateFilter("maxPrice", e.target.value)}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-center py-4 text-red-500">
          Lỗi: {error}
        </div>
      )}

      {/* Product List */}
      {loading ? (
        <div className="text-center py-10">Đang tải sản phẩm...</div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border p-4 rounded shadow">
              <Image
                src={product.primaryImageUrl || "/images/placeholder.jpg"}
                alt={product.name}
                width={160}
                height={160}
                className="w-full h-40 object-cover rounded"
              />

              <h2 className="font-bold mt-2">{product.name}</h2>
              <p className="text-gray-600">{product.formattedPrice}</p>

              {product.originalPrice > product.price && (
                <p className="text-sm text-red-500 line-through">
                  {product.formattedOriginalPrice}
                </p>
              )}

              <p className="text-sm text-gray-500">{product.brand}</p>
              <p className="text-sm text-gray-500">
                Còn lại: {product.stockQuantity}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          Không tìm thấy sản phẩm nào.
        </div>
      )}
    </div>
  );
};

export default ResultPage;