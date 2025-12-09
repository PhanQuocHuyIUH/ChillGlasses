// src/lib/api/orders.ts
import axiosClient from "./axios";

/** ===== KIỂU CHUNG TỪ BACKEND ===== */

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPING"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentMethodApi = "COD" | "BANK_TRANSFER" | "E_WALLET";

export type ShippingMethodApi = "STANDARD" | "EXPRESS";

type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
  errors?: string[];
  timestamp: string;
};

type PageResponse<T> = {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  empty: boolean;
};

/** ===== KIỂU DÙNG CHO FE (CUSTOMER) ===== */

export interface OrderSummary {
  id: number;
  orderCode: string;
  orderDate: string;
  totalAmount: number;
  formattedTotalAmount: string;
  status: OrderStatus;
  paymentMethod: PaymentMethodApi | string;
  paymentStatus: string;
  totalItems: number;
  createdAt: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productSlug: string;
  productImage: string | null;
  productPrice: number;
  formattedPrice: string;
  quantity: number;
  subtotal: number;
  formattedSubtotal: string;
}

export interface OrderDetail {
  id: number;
  orderCode: string;
  userId: number;
  userFullName: string;
  userEmail: string;
  orderDate: string;
  totalAmount: number;
  formattedTotalAmount: string;
  status: OrderStatus;
  paymentMethod: PaymentMethodApi | string;
  paymentStatus: string;
  shippingAddress: string;
  shippingMethod: ShippingMethodApi;
  shippingFee: number;
  formattedShippingFee: string;
  notes?: string;
  items: OrderItem[];
  totalItems: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  paymentMethod: PaymentMethodApi;
  shippingAddress: string;
  shippingMethod: ShippingMethodApi;
  notes?: string;
  promotionCode?: string;
}

/** ===== API: TẠO ĐƠN HÀNG TỪ CART ===== */
export const createOrder = async (
  payload: CreateOrderRequest
): Promise<OrderDetail> => {
  const res = await axiosClient.post<ApiResponse<OrderDetail>>(
    "/orders",
    payload
  );
  return res.data.data;
};

/** ===== API: LẤY LIST ĐƠN HÀNG (MY ORDERS) ===== */
export const getMyOrders = async (
  page = 0,
  size = 20
): Promise<OrderSummary[]> => {
  const res = await axiosClient.get<ApiResponse<PageResponse<OrderSummary>>>(
    "/orders/my-orders",
    {
      params: { page, size },
    }
  );

  const pageData = res.data.data;
  if (!pageData || !Array.isArray(pageData.content)) {
    return [];
  }

  return pageData.content;
};

/** ===== API: LẤY LIST ĐƠN THEO STATUS ===== */
export const getMyOrdersByStatus = async (
  status: OrderStatus
): Promise<OrderSummary[]> => {
  const res = await axiosClient.get<ApiResponse<OrderSummary[]>>(
    `/orders/my-orders/status/${status}`
  );
  return Array.isArray(res.data.data) ? res.data.data : [];
};

/** ===== API: LẤY CHI TIẾT 1 ĐƠN ===== */
export const getOrderDetail = async (id: number): Promise<OrderDetail> => {
  const res = await axiosClient.get<ApiResponse<OrderDetail>>(`/orders/${id}`);
  return res.data.data;
};

/** ===== API: YÊU CẦU HỦY ĐƠN HÀNG =====
 * POST /api/orders/{id}/cancel
 * Lưu ý: hiện tại BE có thể đang KHÔNG đọc body → notes sẽ không được lưu DB.
 */

export interface CancelOrderPayload {
  notes?: string; // Chuỗi lý do hủy đã gộp
  reasons?: string[]; // Các lý do đã chọn
  otherReason?: string; // Lý do khác (raw)
}

export const requestCancelOrder = async (
  orderId: number,
  payload?: CancelOrderPayload
): Promise<OrderDetail> => {
  try {
    const res = await axiosClient.post<ApiResponse<OrderDetail>>(
      `/orders/${orderId}/cancel`,
      payload ?? {}
    );

    return res.data.data;
  } catch (error: any) {
    console.error("API Error hủy đơn:", error?.response?.data || error);
    const messageFromServer = error?.response?.data?.message;

    throw new Error(messageFromServer || "Không thể gửi yêu cầu hủy đơn");
  }
};
