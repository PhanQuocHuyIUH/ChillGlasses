// src/lib/api/cart.ts
import axiosClient from "./axios";

export interface CartItem {
    id: number;
    productId: number;
    productName: string;
    productSlug: string;
    productPrice: number;
    formattedProductPrice: string;
    productImageUrl?: string;
    brand: string;
    stockQuantity: number;
    quantity: number;
    subtotal: number;
    formattedSubtotal: string;
    inStock: boolean;
}

export interface CartResponse {
    id: number;
    userId: number;
    items: CartItem[];
    totalItems: number;
    totalAmount: number;
    formattedTotalAmount: string;
    createdAt: string;
    updatedAt: string;
}

// GET /api/cart
export async function getCart() {
    const res = await axiosClient.get<{
        code: number;
        message: string;
        data: CartResponse;
    }>("/cart");

    return res.data.data;
}

// GET /api/cart/count
export async function getCartCount() {
    const res = await axiosClient.get<{
        code: number;
        message: string;
        data: number;
    }>("/cart/count");

    return res.data.data;
}

// POST /api/cart/items
export async function addToCart(productId: number, quantity: number) {
    const res = await axiosClient.post<{
        code: number;
        message: string;
        data: CartResponse;
    }>("/cart/items", {
        productId,
        quantity,
    });

    return res.data.data;
}

// PUT /api/cart/items/{cartItemId}
export async function updateCartItem(cartItemId: number, quantity: number) {
    const res = await axiosClient.put<{
        code: number;
        message: string;
        data: CartResponse;
    }>(`/cart/items/${cartItemId}`, {
        quantity,
    });

    return res.data.data;
}

// DELETE /api/cart/items/{cartItemId}
export async function removeCartItem(cartItemId: number) {
    const res = await axiosClient.delete<{
        code: number;
        message: string;
        data: CartResponse;
    }>(`/cart/items/${cartItemId}`);

    return res.data.data;
}

// DELETE /api/cart
export async function clearCart() {
    const res = await axiosClient.delete<{
        code: number;
        message: string;
        data: CartResponse;
    }>("/cart");

    return res.data.data;
}
