// src/hooks/useCart.ts
"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/types/product";

export interface LocalCartItem {
    productId: number;
    name: string;
    slug: string;
    price: number;
    imageUrl?: string;
    brand: string;
    stockQuantity: number;
    quantity: number;
}

const STORAGE_KEY = "guestCart";

function readStorage(): LocalCartItem[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed;
    } catch {
        return [];
    }
}

function writeStorage(items: LocalCartItem[]) {
    if (typeof window === "undefined") return;
    if (items.length === 0) {
        localStorage.removeItem(STORAGE_KEY);
    } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
}

export function useCart() {
    const [items, setItems] = useState<LocalCartItem[]>([]);

    // Load từ localStorage khi mount
    useEffect(() => {
        setItems(readStorage());
    }, []);

    const sync = (next: LocalCartItem[]) => {
        setItems(next);
        writeStorage(next);
    };

    // Thêm sản phẩm vào giỏ guest
    const addItem = (product: Product, quantity: number) => {
        if (!product || quantity <= 0) return;
        if (product.stockQuantity <= 0) return;

        const safeQty = Math.max(1, quantity);

        setItems((prev) => {
            const existing = prev.find((it) => it.productId === product.id);

            if (!existing) {
                const primaryImage = product.images?.find((img: any) => img.isPrimary);
                const imageUrl =
                    primaryImage && typeof primaryImage.imageUrl === "string"
                        ? primaryImage.imageUrl
                        : undefined;

                const next: LocalCartItem[] = [
                    ...prev,
                    {
                        productId: product.id,
                        name: product.name,
                        slug: product.slug,
                        price: product.price,
                        brand: product.brand,
                        stockQuantity: product.stockQuantity,
                        imageUrl,
                        quantity: Math.min(safeQty, product.stockQuantity),
                    },
                ];
                writeStorage(next);
                return next;
            }

            const newQty = Math.min(
                existing.quantity + safeQty,
                existing.stockQuantity
            );

            const next = prev.map((it) =>
                it.productId === product.id ? { ...it, quantity: newQty } : it
            );
            writeStorage(next);
            return next;
        });
    };

    // Cập nhật số lượng; nếu quantity <= 0 → xóa luôn (đúng yêu cầu đề)
    const updateQuantity = (productId: number, quantity: number) => {
        setItems((prev) => {
            const existing = prev.find((it) => it.productId === productId);
            if (!existing) return prev;

            if (quantity <= 0) {
                const filtered = prev.filter((it) => it.productId !== productId);
                writeStorage(filtered);
                return filtered;
            }

            const safeQty = Math.min(quantity, existing.stockQuantity);
            const next = prev.map((it) =>
                it.productId === productId ? { ...it, quantity: safeQty } : it
            );
            writeStorage(next);
            return next;
        });
    };

    const removeItem = (productId: number) => {
        setItems((prev) => {
            const next = prev.filter((it) => it.productId !== productId);
            writeStorage(next);
            return next;
        });
    };

    const clearCart = () => {
        sync([]);
    };

    const totalItems = items.reduce((sum, it) => sum + it.quantity, 0);
    const totalAmount = items.reduce(
        (sum, it) => sum + it.price * it.quantity,
        0
    );

    return {
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        totalItems,
        totalAmount,
    };
}
