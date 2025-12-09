"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCart, CartResponse, clearCart, addToCart } from "@/lib/api/cart";
import {
  createOrder,
  PaymentMethodApi,
  ShippingMethodApi,
} from "@/lib/api/orders";
import userApi from "@/lib/api/user";

const formatPrice = (value: number) => {
  return value.toLocaleString("vi-VN");
};

type ShippingMethodUi = "standard" | "express";
type PaymentMethodUi = "cod" | "bank" | "ewallet";

type BuyNowPayload = {
  productId: number;
  quantity: number;
};

type PromoInfo = {
  code: string | null;
  valid: boolean;
  discount: number;
  message: string | null;
};

// 🧙 Ma đạo promotion: hard-code theo bảng promotion trong DB
const evaluatePromotion = (
  codeRaw: string,
  subtotal: number,
  shippingFee: number
): PromoInfo => {
  const code = codeRaw.trim().toUpperCase();
  if (!code) {
    return { code: null, valid: false, discount: 0, message: null };
  }

  // Chỉ cho phép chữ cái & chữ số
  if (!/^[A-Z0-9]+$/.test(code)) {
    return {
      code,
      valid: false,
      discount: 0,
      message:
        "Mã khuyến mãi chỉ nên gồm chữ cái và chữ số, không có khoảng trắng hoặc ký tự đặc biệt.",
    };
  }

  // FREESHIP2025: miễn phí vận chuyển (tối đa 60k) – giảm trên phí ship
  if (code === "FREESHIP2025") {
    const discount = Math.min(shippingFee, 60000);
    return {
      code,
      valid: true,
      discount,
      message: "Áp dụng miễn phí vận chuyển (tối đa 60.000 đ) cho đơn này.",
    };
  }

  // WELCOME20: giảm 20% trên tiền hàng
  if (code === "WELCOME20") {
    const discount = Math.round(subtotal * 0.2);
    return {
      code,
      valid: true,
      discount,
      message: "Giảm 20% trên tổng giá trị sản phẩm.",
    };
  }

  // XMAS1000K: giảm 50k cho đơn từ 1.000.000 đ tiền hàng trở lên
  if (code === "XMAS1000K") {
    if (subtotal < 1_000_000) {
      return {
        code,
        valid: false,
        discount: 0,
        message:
          "Mã này áp dụng cho đơn hàng từ 1.000.000 đ tiền hàng trở lên.",
      };
    }
    return {
      code,
      valid: true,
      discount: 50_000,
      message:
        "Giảm 50.000 đ cho đơn hàng từ 1.000.000 đ (chỉ tính trên tiền hàng).",
    };
  }

  return {
    code,
    valid: false,
    discount: 0,
    message: "Mã khuyến mãi không tồn tại hoặc chưa được hỗ trợ trên hệ thống.",
  };
};

const CheckoutPage = () => {
  // Cart thật từ backend
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [cartLoading, setCartLoading] = useState(true);
  const [cartError, setCartError] = useState<string | null>(null);

  // Thông tin khách
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  // Shipping + payment
  const [shippingMethod, setShippingMethod] =
    useState<ShippingMethodUi>("standard");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodUi>("cod");

  const [notes, setNotes] = useState("");
  const [promotionCode, setPromotionCode] = useState("");

  const [promoInfo, setPromoInfo] = useState<PromoInfo>({
    code: null,
    valid: false,
    discount: 0,
    message: null,
  });

  const [errors, setErrors] = useState<{
    fullName?: string;
    phone?: string;
    email?: string;
    address?: string;
    notes?: string;
    promotionCode?: string;
  }>({});

  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode");
  const isBuyNowMode = modeParam === "buyNow";

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

  // 2.1. Prefill info từ API /api/user/profile (ưu tiên dữ liệu mới nhất từ backend)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const me = await userApi.getMyProfile();
        if (!me) return;

        if (me.fullName) setFullName(me.fullName);
        if (me.phone) setPhone(me.phone ?? "");
        if (me.email) setEmail(me.email);
        if (me.address) setAddress(me.address ?? "");

        // Optional: cache lại vào localStorage cho chỗ khác dùng
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(me));
        }
      } catch (err) {
        console.warn("Không lấy được profile user từ API /user/profile:", err);
      }
    };

    fetchProfile();
  }, []);

  // 3. Tính toán từ cart + xử lý mode Mua ngay / Giỏ hàng
  const itemsRaw: any[] = cart?.items ?? [];

  let buyNowProductId: number | null = null;
  let buyNowQuantity: number | null = null;
  let effectiveItems: any[] = itemsRaw;

  if (isBuyNowMode && typeof window !== "undefined" && itemsRaw.length > 0) {
    try {
      const raw = localStorage.getItem("buyNowPayload");
      if (raw) {
        const payload = JSON.parse(raw) as BuyNowPayload;
        const found = itemsRaw.find((it) => it.productId === payload.productId);

        if (found) {
          buyNowProductId = payload.productId;
          buyNowQuantity = payload.quantity;

          effectiveItems = [
            {
              ...found,
              quantity: payload.quantity,
              subtotal: found.productPrice * payload.quantity,
            },
          ];
        }
      }
    } catch (e) {
      console.warn("Không parse được buyNowPayload:", e);
    }
  } else if (!isBuyNowMode && typeof window !== "undefined") {
    // Nếu đi từ giỏ hàng thì xóa trạng thái mua ngay cũ
    localStorage.removeItem("buyNowPayload");
  }

  const subtotal = effectiveItems.reduce(
    (sum, item) => sum + item.productPrice * item.quantity,
    0
  );

  const shippingFee: number = shippingMethod === "express" ? 60000 : 30000;

  // Tự tính khuyến mãi mỗi khi thay đổi
  useEffect(() => {
    const info = evaluatePromotion(promotionCode, subtotal, shippingFee);
    setPromoInfo(info);
  }, [promotionCode, subtotal, shippingFee]);

  const discount = promoInfo.valid ? promoInfo.discount : 0;
  const finalTotal = subtotal + shippingFee - discount;

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

  const mapShippingMethodToApi = (sm: ShippingMethodUi): ShippingMethodApi => {
    return sm === "standard" ? "STANDARD" : "EXPRESS";
  };

  const validateForm = () => {
    const newErrors: {
      fullName?: string;
      phone?: string;
      email?: string;
      address?: string;
      notes?: string;
      promotionCode?: string;
    } = {};

    const trimName = fullName.trim();
    const trimPhone = phone.trim();
    const trimEmail = email.trim();
    const trimAddress = address.trim();
    const trimNotes = notes.trim();
    const trimPromo = promotionCode.trim();

    // Họ tên
    if (!trimName) {
      newErrors.fullName = "Vui lòng nhập họ tên.";
    } else if (!/^[\p{L}\s]+$/u.test(trimName)) {
      newErrors.fullName =
        "Họ tên chỉ nên chứa chữ cái và khoảng trắng, không có số hoặc ký tự đặc biệt.";
    }

    // Số điện thoại
    if (!trimPhone) {
      newErrors.phone = "Vui lòng nhập số điện thoại.";
    } else if (!/^0\d{9}$/.test(trimPhone)) {
      newErrors.phone = "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0.";
    }

    // Email
    if (!trimEmail) {
      newErrors.email = "Vui lòng nhập email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimEmail)) {
      newErrors.email = "Địa chỉ email không hợp lệ.";
    }

    // Địa chỉ
    if (!trimAddress) {
      newErrors.address = "Vui lòng nhập địa chỉ giao hàng.";
    } else if (
      !/^[0-9\p{L}\s,./\-\\|]+$/u.test(trimAddress) ||
      trimAddress.length < 10
    ) {
      newErrors.address =
        "Địa chỉ giao hàng nên rõ ràng, chỉ chứa chữ, số và các ký tự , . / - | \\.";
    }

    // Ghi chú (optional)
    if (trimNotes) {
      if (!/^[0-9\p{L}\s.,!?'"()\-]+$/u.test(trimNotes)) {
        newErrors.notes =
          "Ghi chú chỉ nên chứa chữ, số và dấu câu cơ bản (.,!?'-).";
      }
    }

    // Mã khuyến mãi (optional)
    if (trimPromo) {
      const evalResult = evaluatePromotion(trimPromo, subtotal, shippingFee);
      if (!evalResult.valid) {
        newErrors.promotionCode =
          evalResult.message || "Mã khuyến mãi không hợp lệ.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!cart || effectiveItems.length === 0) {
      alert("Giỏ hàng hiện đang trống, không thể đặt hàng.");
      return;
    }

    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    try {
      setSubmitting(true);

      // 🧠 BACKUP CART TRƯỚC KHI GỌI /orders
      let backupCartItems: { productId: number; quantity: number }[] = [];

      if (cart && cart.items && cart.items.length > 0) {
        const items = cart.items as any[];

        if (isBuyNowMode && buyNowProductId && buyNowQuantity) {
          // Nếu là Mua ngay → backup lại giỏ hàng gốc (trừ đi phần mua ngay)
          backupCartItems = items
            .map((it) => {
              if (it.productId === buyNowProductId) {
                const remainingQty = it.quantity - buyNowQuantity!;

                if (remainingQty > 0) {
                  return {
                    productId: it.productId,
                    quantity: remainingQty,
                  };
                }

                // Nếu <= 0 thì coi như sản phẩm này không còn trong giỏ trước đó
                return null;
              }

              // Các sản phẩm khác giữ nguyên
              return {
                productId: it.productId,
                quantity: it.quantity,
              };
            })
            .filter(
              (x): x is { productId: number; quantity: number } => x !== null
            );
        } else {
          // Không phải Mua ngay → backup y nguyên giỏ hiện tại
          backupCartItems = items.map((it) => ({
            productId: it.productId,
            quantity: it.quantity,
          }));
        }
      }

      const payload = {
        paymentMethod: mapPaymentMethodToApi(paymentMethod),
        shippingAddress: address.trim(),
        shippingMethod: mapShippingMethodToApi(shippingMethod),
        notes: notes.trim() || undefined,
        promotionCode: promotionCode.trim() || undefined,
      };

      console.log("📦 Payload gửi lên /api/orders:", payload);

      if (isBuyNowMode && buyNowProductId && buyNowQuantity) {
        // 1. Xóa sạch cart hiện tại trên BE
        await clearCart();

        // 2. Thêm đúng 1 sản phẩm + số lượng mua ngay vào cart trên BE
        await addToCart(buyNowProductId, buyNowQuantity);
      }

      // 3. Gọi BE tạo đơn → BE dùng cart HIỆN TẠI
      const order = await createOrder(payload);

      console.log("✅ Order tạo thành công từ BE:", order);

      if (!isBuyNowMode) {
        // Đặt từ giỏ hàng → clear cart như cũ
        await clearCart();
      } else {
        // Mua ngay → clear cart rồi dựng lại backup
        await clearCart();

        if (backupCartItems.length > 0) {
          await Promise.all(
            backupCartItems.map((item) =>
              addToCart(item.productId, item.quantity)
            )
          );
        }
      }

      if (typeof window !== "undefined") {
        localStorage.removeItem("buyNowPayload");
      }

      alert("Đặt hàng thành công! Mã đơn: " + order.orderCode);

      router.push("/orders");
    } catch (err) {
      console.error("❌ Lỗi khi tạo đơn hàng:", err);
      alert("Đặt hàng thất bại. Vui lòng thử lại sau.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    if (isBuyNowMode && buyNowProductId) {
      router.push(`/products/${buyNowProductId}`);
    } else {
      router.push("/cart");
    }
  };

  // UI trạng thái

  if (cartLoading) {
    return (
      <div className="min-h-screen max-w-5xl mx-auto px-4 pt-24 pb-16">
        <p className="text-center text-gray-500">Đang tải giỏ hàng...</p>
      </div>
    );
  }

  if (cartError) {
    return (
      <div className="min-h-screen max-w-5xl mx-auto px-4 pt-24 pb-16">
        <p className="text-center text-red-500 mb-4">{cartError}</p>
        <button
          onClick={() => router.push("/cart")}
          className="mx-auto block px-4 py-2 text-sm bg-black text-white rounded-lg"
        >
          Quay lại giỏ hàng
        </button>
      </div>
    );
  }

  if (!cart || effectiveItems.length === 0) {
    return (
      <div className="min-h-screen max-w-5xl mx-auto px-4 pt-24 pb-16">
        <h1 className="text-2xl font-semibold mb-3">Thanh toán</h1>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600 mb-4">Giỏ hàng của bạn đang trống.</p>
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Thanh toán</h1>
        <button
          type="button"
          onClick={handleBack}
          className="text-sm text-blue-600 hover:underline"
        >
          {isBuyNowMode ? "Quay về trang sản phẩm" : "Quay về giỏ hàng"}
        </button>
      </div>

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
                className={`w-full rounded px-3 py-2 text-sm outline-none transition ${
                  errors.fullName
                    ? "border border-red-500"
                    : "border border-gray-300"
                }`}
                placeholder="Nguyễn Văn A"
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">Số điện thoại</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full rounded px-3 py-2 text-sm outline-none transition ${
                    errors.phone
                      ? "border border-red-500"
                      : "border border-gray-300"
                  }`}
                  placeholder="09xx xxx xxx"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full rounded px-3 py-2 text-sm outline-none transition ${
                    errors.email
                      ? "border border-red-500"
                      : "border border-gray-300"
                  }`}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">Địa chỉ giao hàng</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={`w-full rounded px-3 py-2 text-sm min-h-[60px] outline-none transition ${
                  errors.address
                    ? "border border-red-500"
                    : "border border-gray-300"
                }`}
                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
              />
              {errors.address && (
                <p className="mt-1 text-xs text-red-500">{errors.address}</p>
              )}
            </div>

            {/* Ghi chú + mã giảm giá */}
            <div>
              <label className="block text-sm mb-1">
                Ghi chú cho đơn hàng (tuỳ chọn)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={`w-full rounded px-3 py-2 text-sm min-h-[50px] outline-none transition ${
                  errors.notes
                    ? "border border-red-500"
                    : "border border-gray-300"
                }`}
                placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."
              />
              {errors.notes && (
                <p className="mt-1 text-xs text-red-500">{errors.notes}</p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1">
                Mã khuyến mãi (nếu có)
              </label>
              <input
                type="text"
                value={promotionCode}
                onChange={(e) => setPromotionCode(e.target.value.toUpperCase())}
                className={`w-full rounded px-3 py-2 text-sm outline-none transition ${
                  errors.promotionCode
                    ? "border border-red-500"
                    : "border border-gray-300"
                }`}
                placeholder="Nhập mã giảm giá (FREESHIP2025, WELCOME20, XMAS1000K...)"
              />
              {promoInfo.message && (
                <p
                  className={`mt-1 text-xs ${
                    promoInfo.valid ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {promoInfo.message}
                </p>
              )}
              {errors.promotionCode && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.promotionCode}
                </p>
              )}
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
            {effectiveItems.map((item: any) => (
              <div key={item.id} className="flex justify-between">
                <span>
                  {item.productName}{" "}
                  <span className="text-gray-500">x{item.quantity}</span>
                </span>

                <span>{formatPrice(item.productPrice * item.quantity)} đ</span>
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

            {discount > 0 && (
              <div className="flex justify-between text-green-700">
                <span>Giảm giá</span>
                <span>-{formatPrice(discount)} đ</span>
              </div>
            )}

            <div className="flex justify-between font-semibold text-base pt-1 border-t mt-2">
              <span>Tổng cộng</span>
              <span>{formatPrice(finalTotal)} đ</span>
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
