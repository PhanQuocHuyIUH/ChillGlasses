"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart as clearCartApi,
  type CartItem,
  type CartResponse,
} from "@/lib/api/cart";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/authClient";
import { useCart as useGuestCart } from "@/hooks/useCart";

const formatPrice = (value: number) => {
  return value.toLocaleString("vi-VN");
};

const CartPage = () => {
  const router = useRouter();

  // Giỏ hàng backend (khi đã login)
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);
  const [clearing, setClearing] = useState(false);

  // Trạng thái đăng nhập
  const [loggedIn, setLoggedIn] = useState(false);

  // Giỏ hàng guest (localStorage)
  const {
    items: guestItems,
    updateQuantity: guestUpdateQuantity,
    removeItem: guestRemoveItem,
    clearCart: guestClearCart,
    totalAmount: guestTotalAmount,
  } = useGuestCart();

  // Xác định login hay không
  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  // Nếu đã login → load cart từ backend
  useEffect(() => {
    if (!loggedIn) {
      // Guest: không gọi BE, chỉ dùng local cart
      setLoading(false);
      return;
    }

    const fetchCart = async () => {
      try {
        setLoading(true);
        const data = await getCart();
        setCart(data);
        console.log("Cart load từ BE:", data);
      } catch (err) {
        console.error("Lỗi load cart:", err);
        setError(
          "Không tải được giỏ hàng từ hệ thống. Vui lòng thử lại hoặc kiểm tra đăng nhập."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [loggedIn]);

  // Map guestItems → CartItem-like để tái dùng UI
  const guestCartItems: CartItem[] = guestItems.map((gi) => {
    const subtotal = gi.price * gi.quantity;
    return {
      id: gi.productId, // dùng productId làm id tạm
      productId: gi.productId,
      productName: gi.name,
      productSlug: gi.slug,
      productPrice: gi.price,
      formattedProductPrice: formatPrice(gi.price) + " đ",
      productImageUrl: gi.imageUrl,
      brand: gi.brand,
      stockQuantity: gi.stockQuantity,
      quantity: gi.quantity,
      subtotal,
      formattedSubtotal: formatPrice(subtotal) + " đ",
      inStock: gi.stockQuantity > 0,
    };
  });

  const usingGuestCart = !loggedIn;

  const items: CartItem[] = usingGuestCart ? guestCartItems : cart?.items || [];

  const total: number = usingGuestCart
    ? guestTotalAmount
    : cart?.totalAmount ?? 0;

  // Tăng số lượng
  const increaseQty = async (item: CartItem) => {
    if (updatingItemId || clearing) return;

    const newQty = item.quantity + 1;
    if (newQty > item.stockQuantity) {
      alert("Vượt quá số lượng tồn kho.");
      return;
    }

    // Guest mode
    if (usingGuestCart) {
      guestUpdateQuantity(item.productId, newQty);
      return;
    }

    // Logged-in mode → gọi BE
    try {
      setUpdatingItemId(item.id);
      const updatedCart = await updateCartItem(item.id, newQty);
      setCart(updatedCart);
      console.log("Cart sau khi tăng:", updatedCart);
    } catch (err) {
      console.error("Lỗi tăng số lượng:", err);
      alert("Không thể cập nhật số lượng. Vui lòng thử lại.");
    } finally {
      setUpdatingItemId(null);
    }
  };

  // Giảm số lượng (nếu về 0 → xóa sản phẩm khỏi giỏ)
  const decreaseQty = async (item: CartItem) => {
    if (updatingItemId || clearing) return;

    const newQty = item.quantity - 1;

    // Guest mode
    if (usingGuestCart) {
      if (newQty <= 0) {
        guestRemoveItem(item.productId);
      } else {
        guestUpdateQuantity(item.productId, newQty);
      }
      return;
    }

    // Logged-in mode
    try {
      setUpdatingItemId(item.id);

      if (newQty <= 0) {
        const updatedCart = await removeCartItem(item.id);
        setCart(updatedCart);
        console.log("Cart sau khi xóa (qty về 0):", updatedCart);
      } else {
        const updatedCart = await updateCartItem(item.id, newQty);
        setCart(updatedCart);
        console.log("Cart sau khi giảm:", updatedCart);
      }
    } catch (err) {
      console.error("Lỗi giảm số lượng:", err);
      alert("Không thể cập nhật số lượng. Vui lòng thử lại.");
    } finally {
      setUpdatingItemId(null);
    }
  };

  // Xóa một item
  const removeItem = async (item: CartItem) => {
    if (updatingItemId || clearing) return;

    if (!confirm(`Xóa "${item.productName}" khỏi giỏ hàng?`)) return;

    if (usingGuestCart) {
      guestRemoveItem(item.productId);
      return;
    }

    try {
      setUpdatingItemId(item.id);
      const updatedCart = await removeCartItem(item.id);
      setCart(updatedCart);
      console.log("Cart sau khi xóa item:", updatedCart);
    } catch (err) {
      console.error("Lỗi xóa item:", err);
      alert("Không thể xóa sản phẩm. Vui lòng thử lại.");
    } finally {
      setUpdatingItemId(null);
    }
  };

  // Xóa toàn bộ giỏ
  const handleClearCart = async () => {
    if (clearing || updatingItemId) return;

    if (!confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng?")) return;

    if (usingGuestCart) {
      guestClearCart();
      return;
    }

    try {
      setClearing(true);
      const updatedCart = await clearCartApi();
      setCart(updatedCart);
      console.log("Cart sau khi clear:", updatedCart);
    } catch (err) {
      console.error("Lỗi clear cart:", err);
      alert("Không thể xóa giỏ hàng. Vui lòng thử lại.");
    } finally {
      setClearing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Đang tải giỏ hàng...
      </div>
    );
  }

  if (error && !usingGuestCart) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-500">
        <p className="mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded bg-black text-white text-sm"
        >
          Thử tải lại
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-4 pt-24 pb-16">
      <h1 className="text-2xl font-semibold mb-2">Giỏ hàng</h1>

      {!loggedIn && (
        <p className="text-xs text-gray-500 mb-4">
          Bạn đang dùng giỏ hàng tạm (guest). Đăng nhập để đồng bộ đơn hàng với
          tài khoản.
        </p>
      )}

      {items.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600 mb-4">Giỏ hàng của bạn đang trống.</p>
          <Link
            href="/products"
            className="inline-block px-5 py-2 rounded-lg bg-black text-white text-sm"
          >
            Tiếp tục mua sắm
          </Link>

          {loggedIn && (
            <Link
              href="/orders"
              className="mt-2 block w-full text-center text-sm text-blue-600 hover:underline"
            >
              Xem lịch sử đơn hàng
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
          {/* Danh sách item */}
          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={`${item.productId}-${index}`}
                className="flex items-center justify-between bg-white shadow rounded-lg p-4"
              >
                {/* Khi nhấn vào sản phẩm → chuyển đến product/id */}
                <Link
                  href={`/products/${item.productId}`}
                  className="flex items-center gap-4 hover:opacity-80"
                >
                  <Image
                    src={item.productImageUrl || "/images/product1.jpg"}
                    alt={item.productName}
                    width={80}
                    height={80}
                    className="rounded-md object-cover"
                  />

                  <div>
                    <h2 className="font-medium">{item.productName}</h2>
                    <p className="text-sm text-gray-500">
                      {formatPrice(item.productPrice)} đ
                    </p>
                    <p className="text-xs text-gray-400">
                      {item.brand} • Còn {item.stockQuantity} sp
                    </p>
                  </div>
                </Link>

                {/* Vùng thao tác */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded">
                    <button
                      onClick={() => decreaseQty(item)}
                      disabled={updatingItemId === item.id || clearing}
                      className="px-3 py-1 disabled:opacity-50"
                    >
                      −
                    </button>

                    <span className="px-3">{item.quantity}</span>

                    <button
                      onClick={() => increaseQty(item)}
                      disabled={
                        item.quantity >= item.stockQuantity ||
                        updatingItemId === item.id ||
                        clearing
                      }
                      className="px-3 py-1 disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>

                  <p className="font-semibold w-28 text-right">
                    {formatPrice(item.subtotal)} đ
                  </p>

                  <button
                    onClick={() => removeItem(item)}
                    disabled={updatingItemId === item.id || clearing}
                    className="text-red-500 hover:underline text-sm disabled:opacity-50"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Tổng tiền + actions */}
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

            <button
              onClick={() => {
                // Checkout vẫn yêu cầu login
                if (!loggedIn) {
                  router.push("/login?redirect=/checkout?mode=cart");
                } else {
                  router.push("/checkout?mode=cart");
                }
              }}
              className="mt-4 w-full bg-black text-white py-2 rounded-lg text-sm"
            >
              Tiến hành thanh toán
            </button>

            <Link
              href="/products"
              className="mt-2 block w-full text-center text-sm text-gray-600 hover:underline"
            >
              Tiếp tục mua sắm
            </Link>

            {loggedIn && (
              <Link
                href="/orders"
                className="mt-2 block w-full text-center text-sm text-blue-600 hover:underline"
              >
                Xem lịch sử đơn hàng
              </Link>
            )}

            <button
              onClick={handleClearCart}
              disabled={clearing || !!updatingItemId}
              className="mt-3 w-full text-center text-sm text-red-600 hover:underline disabled:opacity-50"
            >
              Xóa toàn bộ giỏ hàng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
