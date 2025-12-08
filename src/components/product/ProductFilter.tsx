// "use client";

// import { ProductFilterValues } from "@/types/product";
// import { useState } from "react";
// import { FaSearch } from "react-icons/fa";

// interface ProductFilterProps {
//   onFilterChange: (filters: ProductFilterValues) => void;
//   brands?: string[];
//   categories?: { id: number; name: string }[];
// }

// export default function ProductFilter({
//   onFilterChange,
//   brands = [],
//   categories = [],
// }: ProductFilterProps) {
//   const [filters, setFilters] = useState<ProductFilterValues>({
//     searchTerm: "",
//     brand: "",
//     categoryId: undefined,
//     minPrice: undefined,
//     maxPrice: undefined,
//     inStock: false,
//   });

//   const handleChange = (field: string, value: any) => {
//     const updated = { ...filters, [field]: value };
//     setFilters(updated);
//     onFilterChange(updated);
//   };

//   return (
//     <div className="bg-white border rounded-lg shadow p-4 mb-6">
//       {/* SEARCH */}
//       <div className="flex items-center border border-gray-300 rounded-md px-2 py-1 w-full mb-4">
//         <FaSearch className="text-gray-500" />
//         <input
//           type="text"
//           placeholder="Tìm kiếm sản phẩm..."
//           value={filters.searchTerm}
//           onChange={(e) => handleChange("searchTerm", e.target.value)}
//           className="outline-none px-2 text-sm w-full"
//         />
//         <button
//           onClick={() => onFilterChange(filters)}
//           className="ml-2 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
//         >
//           Tìm
//         </button>
//       </div>

//       {/* FILTER OPTIONS */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {/* Brand */}
//         <div>
//           <label className="block font-semibold mb-1">Thương hiệu</label>
//           <select
//             className="border p-2 rounded w-full"
//             value={filters.brand}
//             onChange={(e) => handleChange("brand", e.target.value)}
//           >
//             <option value="">Tất cả</option>
//             {brands.map((b) => (
//               <option key={b} value={b}>
//                 {b}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Category */}
//         <div>
//           <label className="block font-semibold mb-1">Danh mục</label>
//           <select
//             className="border p-2 rounded w-full"
//             value={filters.categoryId ?? ""}
//             onChange={(e) =>
//               handleChange(
//                 "categoryId",
//                 e.target.value ? Number(e.target.value) : undefined
//               )
//             }
//           >
//             <option value="">Tất cả</option>
//             {categories.map((c) => (
//               <option key={c.id} value={c.id}>
//                 {c.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* In Stock */}
//         <div className="flex items-center mt-6">
//           <input
//             type="checkbox"
//             checked={filters.inStock}
//             onChange={(e) => handleChange("inStock", e.target.checked)}
//             className="mr-2"
//           />
//           <label className="font-semibold">Chỉ hiển thị sản phẩm còn hàng</label>
//         </div>
//       </div>

//       {/* PRICE RANGE */}
//       <div className="grid grid-cols-2 gap-4 mt-4">
//         <div>
//           <label className="block font-semibold mb-1">Giá thấp nhất</label>
//           <input
//             type="number"
//             placeholder="0"
//             className="border p-2 rounded w-full"
//             onChange={(e) => handleChange("minPrice", Number(e.target.value))}
//           />
//         </div>

//         <div>
//           <label className="block font-semibold mb-1">Giá cao nhất</label>
//           <input
//             type="number"
//             placeholder="2,000,000"
//             className="border p-2 rounded w-full"
//             onChange={(e) => handleChange("maxPrice", Number(e.target.value))}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }