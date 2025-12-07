// Common API Response Types

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface PaginationParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "ASC" | "DESC";
}

// User Types
export enum UserRole {
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  role: UserRole;
  isActive: boolean;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserRequest {
  fullName?: string;
  phone?: string;
  address?: string;
  role?: UserRole;
  isActive?: boolean;
}

// Category Types
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryRequest {
  name: string;
  description?: string;
  isActive?: boolean;
}

// Product Types
export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stockQuantity: number;
  brand?: string;
  categoryId: number;
  categoryName?: string;
  isActive: boolean;
  viewCount?: number;
  averageRating?: number;
  reviewCount?: number;
  images?: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: number;
  imageUrl: string;
  publicId: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface ProductFilterRequest {
  keyword?: string;
  categoryId?: number;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isActive?: boolean;
  sortBy?: string;
  sortDir?: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  brand?: string;
  categoryId: number;
  isActive?: boolean;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  stockQuantity?: number;
  brand?: string;
  categoryId?: number;
  isActive?: boolean;
}

// Order Types
export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PROCESSING = "PROCESSING",
  SHIPPING = "SHIPPING",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

export enum PaymentMethod {
  COD = "COD",
  BANK_TRANSFER = "BANK_TRANSFER",
  CREDIT_CARD = "CREDIT_CARD",
  E_WALLET = "E_WALLET",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export interface Order {
  id: number;
  orderCode: string;
  userId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  totalAmount: number;
  shippingFee: number;
  finalAmount: number;
  orderStatus: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderItems: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImage?: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  note?: string;
}

// Review Types
export enum ReviewStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface Review {
  id: number;
  productId: number;
  productName: string;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateReviewStatusRequest {
  status: ReviewStatus;
  adminNote?: string;
}

// Statistics Types
export interface DashboardStats {
  totalUsers: number;
  newUsersToday: number;
  totalOrders: number;
  ordersToday: number;
  totalRevenue: number;
  revenueToday: number;
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  pendingOrders: number;
  pendingReviews: number;
}

export interface RevenueStats {
  date: string;
  totalRevenue: number;
  orderCount: number;
  averageOrderValue: number;
}

export interface OrderStatusStats {
  status: OrderStatus;
  count: number;
  percentage: number;
}

export interface TopSellingProduct {
  productId: number;
  productName: string;
  categoryName: string;
  totalQuantitySold: number;
  totalRevenue: number;
  orderCount: number;
}

export interface InventoryReport {
  productId: number;
  productName: string;
  categoryName: string;
  currentStock: number;
  stockStatus: "OUT_OF_STOCK" | "LOW_STOCK" | "IN_STOCK";
  lastUpdated: string;
}
