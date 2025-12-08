import axiosClient from "@/lib/api/axios";
import { Product, ProductFilter } from "@/types/product";

// ==============================
// HELPER: CHUẨN HÓA DỮ LIỆU ĐẦU RA
// ==============================
// Hàm này giúp tự động tìm mảng dữ liệu dù backend trả về định dạng nào
const extractArrayData = (response: any): Product[] => {
  if (!response) return [];

  // 1. Nếu response = []
  if (Array.isArray(response)) return response;

  // 2. Nếu response.data = []
  if (Array.isArray(response.data)) return response.data;

  // 3. Nếu response.data.content = []
  if (response.data?.content && Array.isArray(response.data.content)) {
    return response.data.content;
  }

  // 4. Nếu response.content = []
  if (response.content && Array.isArray(response.content)) {
    return response.content;
  }

  // 5. Nếu backend trả kiểu pagination:
  // { data: { items: [...] } }
  if (response.data?.items && Array.isArray(response.data.items)) {
    return response.data.items;
  }

  // 6. Không khớp → return rỗng
  return [];
};


// ==============================
// GET ALL PRODUCTS
// ==============================
export async function getAllProducts(): Promise<Product[]> {
  try {
    const res = await axiosClient.get("/products");
    return extractArrayData(res.data); // Đã áp dụng hàm chuẩn hóa
  } catch (err) {
    console.error("❌ Lỗi API getAllProducts:", err);
    return [];
  }
}

// ==============================
// GET PRODUCT BY ID
// ==============================
export const getProductById = async (id: number): Promise<Product> => {
  try {
    const res = await axiosClient.get(`/products/${id}`);
    
    // Xử lý trường hợp chi tiết sản phẩm cũng bị bọc trong object "data"
    // Ví dụ: { status: 200, data: { id: 1, name: "..." } }
    if (res.data?.data && !res.data.id) {
        return res.data.data;
    }
    
    return res.data;
  } catch (err) {
    console.error("❌ Lỗi API getProductById:", err);
    throw err; // Ném lỗi để UI bắt được (hiện 404 hoặc thông báo lỗi)
  }
};

// ==============================
// SEARCH PRODUCTS
// ==============================
export const searchProducts = async (keyword: string): Promise<Product[]> => {
  try {
    const res = await axiosClient.get(`/products/search`, {
      params: { keyword },
    });
    return extractArrayData(res.data);
  } catch (err) {
    console.error("❌ Lỗi API searchProducts:", err);
    return [];
  }
};

// ==============================
// FILTER BY CATEGORY ID
// ==============================
export const getProductsByCategory = async (
  categoryId: number
): Promise<Product[]> => {
  try {
    const res = await axiosClient.get(`/products/category/${categoryId}`);
    return extractArrayData(res.data);
  } catch (err) {
    console.error("❌ Lỗi API getProductsByCategory:", err);
    return [];
  }
};

// ==============================
// FILTER BY BRAND
// ==============================
export const getProductsByBrand = async (brand: string): Promise<Product[]> => {
  try {
    const res = await axiosClient.get(`/products/brand/${brand}`);
    return extractArrayData(res.data);
  } catch (err) {
    console.error("❌ Lỗi API getProductsByBrand:", err);
    return [];
  }
};

// ==============================
// MULTI FILTER QUERY
// ==============================
export const filterProducts = async (
  filter: ProductFilter
): Promise<Product[]> => {
  const params: Record<string, string> = {};

  if (filter.categoryId) params.category = filter.categoryId.toString();
  if (filter.brand) params.brand = filter.brand;

  if (typeof filter.minPrice === "number") {
    params.minPrice = filter.minPrice.toString();
  }

  if (typeof filter.maxPrice === "number") {
    params.maxPrice = filter.maxPrice.toString();
  }

  if (typeof filter.inStock === "boolean") {
    params.inStock = filter.inStock ? "true" : "false";
  }

  try {
    const res = await axiosClient.get("/products", { params });
    return extractArrayData(res.data);
  } catch (err) {
    console.error("❌ Lỗi API filterProducts:", err);
    return [];
  }
};