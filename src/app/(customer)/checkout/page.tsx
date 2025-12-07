"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getCart, CartResponse, clearCart } from "@/lib/api/cart";
import {
    createOrder,
    PaymentMethodApi,
    ShippingMethodApi,
} from "@/lib/api/orders";

const formatPrice = (value: number) => {
    return value.toLocaleString("vi-VN");
};

type ShippingMethodUi = "standard" | "express";
type PaymentMethodUi = "cod" | "bank" | "ewallet";

const CheckoutPage = () => {
    // Cart thật từ backend
    const [cart, setCart] = useState<CartResponse | null>(null);
    const [cartLoading, setCartLoading] = useState(true);
    const [cartError, setCartError] = useState<string | null>(null);

    // Thông tin khách hàng
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");

    // Shipping + payment + extra
    const [shippingMethod, setShippingMethod] =
        useState<ShippingMethodUi>("standard");
    const [paymentMethod, setPaymentMethod] =
        useState<PaymentMethodUi>("cod");

    const [notes, setNotes] = useState("");
    const [promotionCode, setPromotionCode] = useState("");

    const [submitting, setSubmitting] = useState(false);

    const router = useRouter();

    // 1. Load cart từ backend
    useEffect(() => {
        const fetchCart = async () => {
            try {
                setCartLoading(true);
                const data = await getCart();
                setCart(data);
            } catch (err) {
                console.error("Lỗi load cart ở checkout:", err);
                setCartError(
                    "Không tải được giỏ hàng. Hãy kiểm tra lại đăng nhập hoặc thử lại sau."
                );
            } finally {
                setCartLoading(false);
            }
        };

        fetchCart();
    }, []);

    // 2. Prefill info từ localStorage (user)
    useEffect(() => {
        if (typeof window === "undefined") return;

        try {
            const raw = localStorage.getItem("user");
            if (!raw) return;

            const user = JSON.parse(raw);

            if (user.fullName) setFullName(user.fullName);
            if (user.phone) setPhone(user.phone);
            if (user.email) setEmail(user.email);
            if (user.address) setAddress(user.address);
        } catch (e) {
            console.warn("Không parse được user từ localStorage:", e);
        }
    }, []);

    // 3. Tính toán từ cart
    const items = cart?.items ?? [];

    const subtotal = items.reduce(
        (sum, item) => sum + item.productPrice * item.quantity,
        0
    );

    const shippingFee: number =
        shippingMethod === "express" ? 60000 : 30000;

    const total = subtotal + shippingFee;

    // Map UI -> API enum
    const mapPaymentMethodToApi = (pm: PaymentMethodUi): PaymentMethodApi => {
        switch (pm) {
            case "cod":
                return "COD";
            case "bank":
                return "BANK_TRANSFER";
            case "ewallet":
            default:
                return "E_WALLET";
        }
    };

    const mapShippingMethodToApi = (
        sm: ShippingMethodUi
    ): ShippingMethodApi => {
        return sm === "standard" ? "STANDARD" : "EXPRESS";
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!cart || items.length === 0) {
            alert("Giỏ hàng hiện đang trống, không thể đặt hàng.");
            return;
        }

        if (!fullName || !phone || !email || !address) {
            alert("Vui lòng điền đầy đủ thông tin giao hàng.");
            return;
        }

        try {
            setSubmitting(true);

            const payload = {
                paymentMethod: mapPaymentMethodToApi(paymentMethod),
                shippingAddress: address,
                shippingMethod: mapShippingMethodToApi(shippingMethod),
                notes: notes || undefined,
                promotionCode: promotionCode || undefined,
            };

            console.log("📦 Payload gửi lên /api/orders:", payload);

            const order = await createOrder(payload);

            console.log("✅ Order tạo thành công từ BE:", order);

            // Clear cart để FE & DB sạch
            await clearCart();

            alert("Đặt hàng thành công! Mã đơn: " + order.orderCode);

            router.push("/orders");
        } catch (err) {
            console.error("❌ Lỗi khi tạo đơn hàng:", err);
            alert("Đặt hàng thất bại. Vui lòng thử lại sau.");
        } finally {
            setSubmitting(false);
        }
    };

    // UI trạng thái

    if (cartLoading) {
        return (
            <div className="min-h-screen max-w-5xl mx-auto px-4 pt-24 pb-16">
                <p className="text-center text-gray-500">
                    Đang tải giỏ hàng...
                </p>
            </div>
        );
    }

    if (cartError) {
        return (
            <div className="min-h-screen max-w-5xl mx-auto px-4 pt-24 pb-16">
                <p className="text-center text-red-500 mb-4">
                    {cartError}
                </p>
                <button
                    onClick={() => router.push("/cart")}
                    className="mx-auto block px-4 py-2 text-sm bg-black text-white rounded-lg"
                >
                    Quay lại giỏ hàng
                </button>
            </div>
        );
    }

    if (!cart || items.length === 0) {
        return (
            <div className="min-h-screen max-w-5xl mx-auto px-4 pt-24 pb-16">
                <h1 className="text-2xl font-semibold mb-3">Thanh toán</h1>
                <div className="bg-white rounded-lg shadow p-6 text-center">
                    <p className="text-gray-600 mb-4">
                        Giỏ hàng của bạn đang trống.
                    </p>
                    <button
                        onClick={() => router.push("/products")}
                        className="inline-block px-5 py-2 rounded-lg bg-black text-white text-sm"
                    >
                        Tiếp tục mua sắm
                    </button>
                </div>
            </div>
        );
    }

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
                                <label className="block text-sm mb-1">
                                    Số điện thoại
                                </label>
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
                            <label className="block text-sm mb-1">
                                Địa chỉ giao hàng
                            </label>
                            <textarea
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full border rounded px-3 py-2 text-sm min-h-[60px]"
                                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                            />
                        </div>

                        {/* Ghi chú + mã giảm giá */}
                        <div>
                            <label className="block text-sm mb-1">
                                Ghi chú cho đơn hàng (tuỳ chọn)
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full border rounded px-3 py-2 text-sm min-h-[50px]"
                                placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-1">
                                Mã khuyến mãi (nếu có)
                            </label>
                            <input
                                type="text"
                                value={promotionCode}
                                onChange={(e) => setPromotionCode(e.target.value)}
                                className="w-full border rounded px-3 py-2 text-sm"
                                placeholder="Nhập mã giảm giá"
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
                  {item.productName}{" "}
                    <span className="text-gray-500">
                    x{item.quantity}
                  </span>
                </span>

                                <span>
                  {formatPrice(item.productPrice * item.quantity)} đ
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
                        disabled={submitting}
                        className="mt-4 w-full bg-black text-white py-2 rounded-lg text-sm disabled:opacity-60"
                    >
                        {submitting ? "Đang xử lý..." : "Xác nhận đặt hàng"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CheckoutPage;
