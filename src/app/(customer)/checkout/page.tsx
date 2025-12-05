"use client";

import { useState } from "react";

type CheckoutItem = {
    id: number;
    name: string;
    price: number;
    quantity: number;
};

const formatPrice = (value: number) => {
    return value.toLocaleString("vi-VN");
};

const CheckoutPage = () => {
    const [items] = useState<CheckoutItem[]>([
        {
            id: 1,
            name: "Gọng kính Chill Classic 01",
            price: 1200000,
            quantity: 1,
        },
        {
            id: 2,
            name: "Kính râm Chill UV 02",
            price: 950000,
            quantity: 2,
        },
    ]);

    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [shippingMethod, setShippingMethod] = useState("standard");
    const [paymentMethod, setPaymentMethod] = useState("cod");

    const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const shippingFee = shippingMethod === "express" ? 60000 : 30000;
    const total = subtotal + shippingFee;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Đặt hàng thành công (demo UI, chưa kết nối API).");
    };

    return (
        <div className="min-h-screen max-w-5xl mx-auto px-4 pt-24 pb-16">
            <h1 className="text-2xl font-semibold mb-6">Thanh toán</h1>

            <form
                onSubmit={handleSubmit}
                className="grid gap-6 md:grid-cols-[2fr,1fr]"
            >
                {/* Form giao hàng */}
                <div className="space-y-4 bg-white shadow rounded-lg p-4">
                    <h2 className="font-medium mb-2">Thông tin giao hàng</h2>

                    <div className="grid gap-3">
                        <div>
                            <label className="block text-sm mb-1">Họ và tên</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full border rounded px-3 py-2 text-sm"
                                placeholder="Nguyễn Văn A"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm mb-1">Số điện thoại</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full border rounded px-3 py-2 text-sm"
                                    placeholder="09xx xxx xxx"
                                />
                            </div>

                            <div>
                                <label className="block text-sm mb-1">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border rounded px-3 py-2 text-sm"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm mb-1">Địa chỉ giao hàng</label>
                            <textarea
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full border rounded px-3 py-2 text-sm min-h-[60px]"
                                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                            />
                        </div>

                        {/* Shipping method */}
                        <div>
                            <h3 className="text-sm font-medium mb-1">
                                Phương thức giao hàng
                            </h3>
                            <div className="space-y-2 text-sm">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="shipping"
                                        value="standard"
                                        checked={shippingMethod === "standard"}
                                        onChange={() => setShippingMethod("standard")}
                                    />
                                    <span>Giao thường (2–4 ngày) – 30.000 đ</span>
                                </label>

                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="shipping"
                                        value="express"
                                        checked={shippingMethod === "express"}
                                        onChange={() => setShippingMethod("express")}
                                    />
                                    <span>Giao nhanh (trong 24h) – 60.000 đ</span>
                                </label>
                            </div>
                        </div>

                        {/* Payment method */}
                        <div>
                            <h3 className="text-sm font-medium mb-1">
                                Phương thức thanh toán
                            </h3>

                            <div className="space-y-2 text-sm">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="cod"
                                        checked={paymentMethod === "cod"}
                                        onChange={() => setPaymentMethod("cod")}
                                    />
                                    <span>Thanh toán khi nhận hàng (COD)</span>
                                </label>

                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="bank"
                                        checked={paymentMethod === "bank"}
                                        onChange={() => setPaymentMethod("bank")}
                                    />
                                    <span>Chuyển khoản ngân hàng</span>
                                </label>

                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="ewallet"
                                        checked={paymentMethod === "ewallet"}
                                        onChange={() => setPaymentMethod("ewallet")}
                                    />
                                    <span>Ví điện tử (Momo, ZaloPay,…)</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Review đơn hàng */}
                <div className="bg-white shadow rounded-lg p-4">
                    <h2 className="font-medium mb-4">Đơn hàng của bạn</h2>

                    <div className="space-y-2 text-sm">
                        {items.map((item) => (
                            <div key={item.id} className="flex justify-between">
                <span>
                  {item.name}{" "}
                    <span className="text-gray-500">
                    x{item.quantity}
                  </span>
                </span>

                                <span>
                  {formatPrice(item.price * item.quantity)} đ
                </span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t mt-3 pt-3 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>Tạm tính</span>
                            <span>{formatPrice(subtotal)} đ</span>
                        </div>

                        <div className="flex justify-between">
                            <span>Phí vận chuyển</span>
                            <span>{formatPrice(shippingFee)} đ</span>
                        </div>

                        <div className="flex justify-between font-semibold text-base pt-1">
                            <span>Tổng cộng</span>
                            <span>{formatPrice(total)} đ</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="mt-4 w-full bg-black text-white py-2 rounded-lg text-sm"
                    >
                        Xác nhận đặt hàng
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CheckoutPage;
// minor update for triggering PR
