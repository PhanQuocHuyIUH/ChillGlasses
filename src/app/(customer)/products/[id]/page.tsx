"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Product } from "@/types/product";
import { getProductById } from "@/lib/api/products";
import { addToCart } from "@/lib/api/cart";
import { requireLogin, isLoggedIn as checkLoggedIn } from "@/lib/authClient";
import { useCart as useGuestCart } from "@/hooks/useCart";

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = useParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [imageError, setImageError] = useState(false);

  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const { addItem: addGuestItem } = useGuestCart();

  useEffect(() => {
    setLoggedIn(checkLoggedIn());
  }, []);

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      try {
        setLoading(true);
        const productId = Number(id);
        if (isNaN(productId)) {
          setError("ID sản phẩm không hợp lệ.");
          return;
        }

        const data = await getProductById(productId);
        setProduct(data);
      } catch (err) {
        console.error("Lỗi tải sản phẩm:", err);
        setError("Không tìm thấy sản phẩm.");
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  const handleIncrease = () => {
    if (product && quantity < product.stockQuantity) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  // 🛒 Thêm vào giỏ
  // Guest → lưu localStorage qua useCart
  // Logged-in → gọi BE /cart/items
  const handleAddToCart = async () => {
    if (!product) return;
    if (product.stockQuantity === 0) {
      alert("Sản phẩm đã hết hàng.");
      return;
    }

    // Guest
    if (!loggedIn) {
      addGuestItem({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        imageUrl:
            product.images.find((img) => img.isPrimary)?.imageUrl ||
            "/images/product1.jpg",
        brand: product.brand,
        stockQuantity: product.stockQuantity,
        quantity,
      });
      alert("Đã thêm vào giỏ hàng (giỏ tạm) ✔");
      return;
    }

    // Logged-in
    try {
      setAdding(true);
      const updatedCart = await addToCart(product.id, quantity);
      console.log("Cart sau khi thêm (user đã login):", updatedCart);
      alert("Đã thêm vào giỏ hàng ✔");
    } catch (err) {
      console.error("Lỗi thêm vào giỏ:", err);
      alert(
          "Thêm vào giỏ thất bại. Hãy kiểm tra lại đăng nhập / token / backend."
      );
    } finally {
      setAdding(false);
    }
  };

  // ⚡ Mua ngay – BẮT BUỘC LOGIN
  // 👉 LƯU productId + quantity vào localStorage để checkout biết quay về đâu
  const handleBuyNow = async () => {
    if (!product) return;
    if (product.stockQuantity === 0) {
      alert("Sản phẩm đã hết hàng.");
      return;
    }

    const blocked = requireLogin({
      router,
      redirectTo: `/products/${product.id}`,
      message: "Vui lòng đăng nhập để mua hàng.",
    });
    if (blocked) return;

    try {
      setAdding(true);

      if (typeof window !== "undefined") {
        localStorage.setItem(
            "buyNowPayload",
            JSON.stringify({
              productId: product.id,
              quantity,
            })
        );
      }

      // Vẫn addToCart để backend có dữ liệu tạo đơn
      await addToCart(product.id, quantity);

      // Sang checkout với mode=buyNow để phân biệt với từ giỏ hàng
      router.push("/checkout?mode=buyNow");
    } catch (err) {
      console.error("Lỗi khi mua ngay:", err);
      alert("Không thể thực hiện Mua ngay. Vui lòng thử lại.");
    } finally {
      setAdding(false);
    }
  };

  if (loading)
    return (
        <div className="text-center py-20 text-gray-500">
          Đang tải dữ liệu...
        </div>
    );
  if (error || !product)
    return (
        <div className="text-center py-20 text-red-500">
          {error || "Sản phẩm không tồn tại."}
        </div>
    );

  const isOutOfStock = product.stockQuantity === 0;
  const hasDiscount = product.originalPrice > product.price;
  const discountPercent = hasDiscount
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
      : 0;

  const primaryImage = product.images.find((image) => image.isPrimary);
  const imageUrl =
      imageError || !primaryImage?.imageUrl
          ? "/images/product1.jpg"
          : primaryImage.imageUrl;

  return (
      <div className="container mx-auto py-10 px-4 text-black">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* IMAGE SECTION */}
          <div className="relative flex justify-center border rounded-xl p-4 shadow-md bg-white hover:shadow-xl transition-shadow duration-300">
            {hasDiscount && (
                <span className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold z-10 shadow">
              -{discountPercent}%
            </span>
            )}

            <Image
                src={imageUrl}
                alt={product?.name || "Chi tiết sản phẩm"}
                width={500}
                height={500}
                className={`w-full h-auto object-contain max-h-[500px] rounded-lg transition-transform duration-300 hover:scale-[1.02] ${
                    isOutOfStock ? "grayscale opacity-80" : ""
                }`}
                onError={() => setImageError(true)}
                priority
            />

            {isOutOfStock && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
              <span className="bg-black text-white px-6 py-3 text-xl font-bold uppercase rotate-[-10deg] shadow-lg rounded">
                Hết hàng
              </span>
                </div>
            )}
          </div>

          {/* INFO SECTION */}
          <div>
            <p className="text-sm text-gray-500 mb-2 uppercase tracking-wide">
              {product.categoryName} • {product.brand}
            </p>

            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-snug">
              {product.name}
            </h1>

            {/* PRICE */}
            <div className="flex items-end gap-3 mb-6">
            <span className="text-3xl text-red-600 font-bold drop-shadow-sm">
              {product.formattedPrice}
            </span>
              {hasDiscount && (
                  <span className="text-lg text-gray-400 line-through mb-1">
                {product.formattedOriginalPrice}
              </span>
              )}
            </div>

            {/* DESCRIPTION BOX */}
            <div className="bg-gray-50 p-5 rounded-xl mb-8 border shadow-sm">
              <p className="text-gray-700 mb-4 leading-relaxed">
                {product.description || "Mô tả đang được cập nhật..."}
              </p>

              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <div>
                  <strong>Thương hiệu:</strong> {product.brand}
                </div>
                <div>
                  <strong>Mã SP:</strong> {product.slug}
                </div>
                <div>
                  <strong>Đánh giá:</strong> {product.rating || 0} ⭐
                </div>

                <div
                    className={
                      isOutOfStock
                          ? "text-red-500 font-bold"
                          : "text-green-600 font-bold"
                    }
                >
                  <strong>Tình trạng:</strong>{" "}
                  {isOutOfStock ? "Hết hàng" : `Còn ${product.stockQuantity} SP`}
                </div>
              </div>
            </div>

            {/* QUANTITY */}
            <div className="flex items-center mb-6">
              <span className="mr-4 font-semibold">Số lượng:</span>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                <button
                    onClick={handleDecrease}
                    disabled={isOutOfStock || quantity <= 1}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition"
                >
                  -
                </button>
                <div className="w-16 text-center py-2 bg-white font-medium">
                  {quantity}
                </div>
                <button
                    onClick={handleIncrease}
                    disabled={isOutOfStock || quantity >= product.stockQuantity}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock || adding}
                  className={`flex-1 px-8 py-3 rounded-xl font-bold uppercase transition shadow-md
            ${
                      isOutOfStock
                          ? "bg-gray-400 cursor-not-allowed text-white"
                          : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
              >
                {isOutOfStock ? "Tạm hết hàng" : adding ? "Đang xử lý..." : "Mua Ngay"}
              </button>

              <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || adding}
                  className={`flex-1 px-8 py-3 rounded-xl font-bold uppercase transition border-2 shadow-md
            ${
                      isOutOfStock
                          ? "border-gray-300 text-gray-400 cursor-not-allowed"
                          : "border-blue-600 text-blue-600 hover:bg-blue-50"
                  }`}
              >
                {adding ? "Đang thêm..." : "Thêm vào giỏ"}
              </button>
            </div>
          </div>
        </div>

        {/* REVIEW SECTION */}
        <div className="mt-16 border-t pt-10">
          <h2 className="text-2xl font-bold mb-6">
            Đánh giá khách hàng ({product.reviewCount})
          </h2>

          <div className="bg-gray-50 p-8 rounded-xl border shadow-sm text-center text-gray-500">
            <p>Chức năng đánh giá sẽ được cập nhật.</p>
          </div>
        </div>
      </div>
  );
}
