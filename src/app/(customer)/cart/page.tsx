"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

const formatPrice = (value: number) => {
  return value.toLocaleString("vi-VN");
};

const CartPage = () => {
  const [items, setItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "Gọng kính Chill Classic 01",
      price: 1200000,
      quantity: 1,
      image: "/images/product1.jpg",
    },
    {
      id: 2,
      name: "Kính râm Chill UV 02",
      price: 950000,
      quantity: 2,
      image: "/images/product2.jpg",
    },
  ]);

  const increaseQty = (id: number) => {
    setItems((prev) =>
        prev.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        )
    );
  };

  const decreaseQty = (id: number) => {
    setItems((prev) =>
        prev.map((item) =>
            item.id === id && item.quantity > 1
                ? { ...item, quantity: item.quantity - 1 }
                : item
        )
    );
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
  );

  return (
      <div className="min-h-screen max-w-5xl mx-auto px-4 pt-24 pb-16">
        <h1 className="text-2xl font-semibold mb-6">Giỏ hàng</h1>

        {items.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-600 mb-4">
                Giỏ hàng của bạn đang trống.
              </p>
              <Link
                  href="/products"
                  className="inline-block px-5 py-2 rounded-lg bg-black text-white text-sm"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
        ) : (
            <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
              <div className="space-y-4">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between bg-white shadow rounded-lg p-4"
                    >
                      <div className="flex items-center gap-4">
                        <Image
                            src={item.image}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="rounded-md"
                        />
                        <div>
                          <h2 className="font-medium">{item.name}</h2>
                          <p className="text-sm text-gray-500">
                            {formatPrice(item.price)} đ
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center border rounded">
                          <button
                              onClick={() => decreaseQty(item.id)}
                              className="px-3 py-1"
                          >
                            −
                          </button>
                          <span className="px-3">{item.quantity}</span>
                          <button
                              onClick={() => increaseQty(item.id)}
                              className="px-3 py-1"
                          >
                            +
                          </button>
                        </div>

                        <p className="font-semibold w-24 text-right">
                          {formatPrice(item.price * item.quantity)} đ
                        </p>

                        <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:underline"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                ))}
              </div>

              {/* Tổng tiền + link lịch sử đơn hàng */}
              <div className="bg-white shadow rounded-lg p-4">
                <h2 className="font-medium mb-3">Tổng cộng</h2>

                <div className="flex justify-between text-sm mb-2">
                  <span>Tổng tiền hàng</span>
                  <span>{formatPrice(total)} đ</span>
                </div>

                <div className="border-t pt-3 font-semibold text-lg flex justify-between">
                  <span>Tổng cộng</span>
                  <span>{formatPrice(total)} đ</span>
                </div>

                <Link href="/checkout">
                  <button className="mt-4 w-full bg-black text-white py-2 rounded-lg text-sm">
                    Tiến hành thanh toán
                  </button>
                </Link>

                <Link
                    href="/products"
                    className="mt-2 block w-full text-center text-sm text-gray-600 hover:underline"
                >
                  Tiếp tục mua sắm
                </Link>

                {/* Link lịch sử đơn hàng */}
                <Link
                    href="/orders"
                    className="mt-2 block w-full text-center text-sm text-blue-600 hover:underline"
                >
                  Xem lịch sử đơn hàng
                </Link>
              </div>
            </div>
        )}
      </div>
  );
};

export default CartPage;
