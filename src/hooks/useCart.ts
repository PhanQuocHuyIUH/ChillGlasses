"use client";

import { useEffect, useMemo, useState } from "react";

export interface GuestCartItem {
  productId: number;
  name: string;
  slug: string;
  price: number;
  imageUrl: string;
  brand: string;
  stockQuantity: number;
  quantity: number;
}

const STORAGE_KEY = "guest_cart";

function loadCartFromStorage(): GuestCartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: GuestCartItem[] = JSON.parse(raw);

    // Sửa dữ liệu cũ: nếu quantity <= 0 thì cho thành 1
    const fixed = parsed.map((item) => ({
      ...item,
      quantity: !item.quantity || item.quantity <= 0 ? 1 : item.quantity,
    }));

    localStorage.setItem(STORAGE_KEY, JSON.stringify(fixed));
    return fixed;
  } catch (e) {
    console.error("Lỗi đọc guest cart từ localStorage:", e);
    return [];
  }
}

function saveCartToStorage(items: GuestCartItem[]) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Lỗi lưu guest cart xuống localStorage:", e);
  }
}

export function useCart() {
  const [items, setItems] = useState<GuestCartItem[]>([]);

  // Load từ localStorage khi mount
  useEffect(() => {
    const loaded = loadCartFromStorage();
    setItems(loaded);
  }, []);

  // Tổng tiền
  const totalAmount = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  // Thêm sản phẩm vào giỏ (dùng cho khách vãng lai)
  const addItem = (payload: {
    productId: number;
    name: string;
    slug: string;
    price: number;
    imageUrl: string;
    brand: string;
    stockQuantity: number;
    quantity?: number; // nếu không truyền → default = 1
  }) => {
    setItems((prev) => {
      const qtyToAdd =
        payload.quantity && payload.quantity > 0 ? payload.quantity : 1;

      const existingIndex = prev.findIndex(
        (item) => item.productId === payload.productId
      );

      let updated: GuestCartItem[];

      if (existingIndex >= 0) {
        const current = prev[existingIndex];
        const newQty = current.quantity + qtyToAdd;

        updated = [...prev];
        updated[existingIndex] = {
          ...current,
          quantity: newQty,
        };
      } else {
        const newItem: GuestCartItem = {
          productId: payload.productId,
          name: payload.name,
          slug: payload.slug,
          price: payload.price,
          imageUrl: payload.imageUrl,
          brand: payload.brand,
          stockQuantity: payload.stockQuantity,
          quantity: qtyToAdd,
        };

        updated = [...prev, newItem];
      }

      saveCartToStorage(updated);
      return updated;
    });
  };

  // Cập nhật số lượng (nếu newQty <= 0 → xóa khỏi giỏ)
  const updateQuantity = (productId: number, newQty: number) => {
    setItems((prev) => {
      let updated: GuestCartItem[];

      if (newQty <= 0) {
        updated = prev.filter((item) => item.productId !== productId);
      } else {
        updated = prev.map((item) =>
          item.productId === productId ? { ...item, quantity: newQty } : item
        );
      }

      saveCartToStorage(updated);
      return updated;
    });
  };

  // Xóa 1 sản phẩm
  const removeItem = (productId: number) => {
    setItems((prev) => {
      const updated = prev.filter((item) => item.productId !== productId);
      saveCartToStorage(updated);
      return updated;
    });
  };

  // Xóa toàn bộ giỏ
  const clearCart = () => {
    setItems([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return {
    items,
    totalAmount,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  };
}
