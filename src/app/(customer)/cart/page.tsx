"use client";

import { useState } from "react";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
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

  const handleIncrease = (id: number) => {
    setItems((prev) =>
        prev.map((item) =>
            item.id === id
                ? { ...item, quantity: item.quantity + 1 }
                : item
        )
    );
  };

  const handleDecrease = (id: number) => {
    setItems((prev) =>
        prev.map((item) =>
            item.id === id && item.quantity > 1
                ? { ...item, quantity: item.quantity - 1 }
                : item
        )
    );
  };

  const handleRemove = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
  );

  return (
      <div className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold mb-4">Giỏ hàng</h1>

        {items.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-600 mb-4">
                Giỏ hàng của bạn đang trống.
              </p>
              <a
                  href="/products"
                  className="inline-block px-5 py-2 rounded-lg bg-black text-white text-sm"
              >
                Tiếp tục mua sắm
              </a>
            </div>
        ) : (
            <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
              {/* Danh sách sản phẩm */}
              <div className="space-y-4">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="flex gap-4 bg-white rounded-lg shadow p-4"
                    >
                      <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden">
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h2 className="font-medium">{item.name}</h2>
                          <p className="text-sm text-gray-500 mt-1">
                            {item.price.toLocaleString()} đ
                          </p>
                        </div>

                        <div className="flex items-center mt-3">
                          <button
                              onClick={() => handleDecrease(item.id)}
                              className="w-8 h-8 border rounded-l flex items-center justify-center text-lg"
                          >
                            −
                          </button>
                          <span className="w-10 h-8 flex items-center justify-center border-t border-b text-sm">
                      {item.quantity}
                    </span>
                          <button
                              onClick={() => handleIncrease(item.id)}
                              className="w-8 h-8 border rounded-r flex items-center justify-center text-lg"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col items-end justify-between">
                        <p className="font-semibold">
                          {(item.price * item.quantity).toLocaleString()} đ
                        </p>
                        <button
                            onClick={() => handleRemove(item.id)}
                            className="text-xs text-red-500 hover:underline"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                ))}
              </div>

              {/* Tổng tiền */}
              <div className="bg-white rounded-lg shadow p-4 h-fit">
                <h2 className="font-medium mb-3">Tóm tắt đơn hàng</h2>

                <div className="flex justify-between text-sm mb-2">
                  <span>Tạm tính</span>
                  <span>{total.toLocaleString()} đ</span>
                </div>

                <div className="flex justify-between text-sm mb-2">
                  <span>Phí vận chuyển (dự kiến)</span>
                  <span>30.000 đ</span>
                </div>

                <div className="border-t mt-3 pt-3 flex justify-between font-semibold">
                  <span>Tổng cộng</span>
                  <span>{(total + 30000).toLocaleString()} đ</span>
                </div>

                <a
                    href="/checkout"
                    className="mt-4 block w-full text-center bg-black text-white py-2 rounded-lg text-sm"
                >
                  Tiến hành thanh toán
                </a>

                <a
                    href="/products"
                    className="mt-2 block w-full text-center text-sm text-gray-600 hover:underline"
                >
                  Tiếp tục mua sắm
                </a>
              </div>
            </div>
        )}
      </div>
  );
};

export default CartPage;
