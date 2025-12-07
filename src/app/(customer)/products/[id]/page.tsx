"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Product } from "@/types/product";
import { getProductById } from "@/lib/api/products";
import { addToCart } from "@/lib/api/cart"; // 🆕 import API cart
import { useRouter } from "next/navigation";


export default function ProductDetailPage() {
  const router = useRouter(); // ⬅️ thêm dòng này
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State xử lý ảnh lỗi
  const [imageError, setImageError] = useState(false);

  // State cho UI interactions
  const [quantity, setQuantity] = useState(1);
  const [newReview, setNewReview] = useState({
    name: "",
    rating: 0,
    comment: "",
  });

  // Mock review (vì API chưa trả về list review)
  const [reviews, setReviews] = useState<any[]>([
    {
      name: "Người mua hàng",
      rating: 5,
      comment: "Gọng kính đẹp, nhẹ, đúng mô tả!",
      approved: true,
    },
  ]);

  const [adding, setAdding] = useState(false); // 🆕 loading cho nút giỏ hàng

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

  // Xử lý tăng giảm số lượng (Không cho tăng quá tồn kho)
  const handleIncrease = () => {
    if (product && quantity < product.stockQuantity) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleSubmitReview = () => {
    if (newReview.name && newReview.rating > 0 && newReview.comment) {
      setReviews((prev) => [...prev, { ...newReview, approved: false }]);
      setNewReview({ name: "", rating: 0, comment: "" });
      alert("Cảm ơn bạn đã đánh giá!");
    } else {
      alert("Vui lòng nhập đủ thông tin!");
    }
  };

  // 🆕 Hàm gọi API Add to cart
  const handleAddToCart = async () => {
    if (!product) return;
    if (product.stockQuantity === 0) {
      alert("Sản phẩm đã hết hàng.");
      return;
    }

    try {
      setAdding(true);
      const updatedCart = await addToCart(product.id, quantity);
      console.log("Cart sau khi thêm:", updatedCart);
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


  // 🆕 Hàm “Mua ngay” – tạm thời chỉ thêm vào giỏ, sau này redirect /checkout
  const handleBuyNow = async () => {
    if (!product) return;
    if (product.stockQuantity === 0) {
      alert("Sản phẩm đã hết hàng.");
      return;
    }

    try {
      setAdding(true);
      // 1) Add vào giỏ
      await addToCart(product.id, quantity);
      // 2) Redirect sang checkout
      router.push("/checkout"); // hoặc "/customer/checkout" nếu route của nhóm bạn đặt vậy
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

  // Tính toán trạng thái tồn kho
  const isOutOfStock = product.stockQuantity === 0;
  const hasDiscount = product.originalPrice > product.price;
  const discountPercent = hasDiscount
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
      : 0;

  // 🆕 Fix logic ảnh: ưu tiên ảnh từ backend, nếu lỗi hoặc rỗng thì fallback
  const imageUrl =
      imageError || !product.primaryImageUrl
          ? "/images/product1.jpg" // file nằm trong /public/images/product1.jpg
          : product.primaryImageUrl;

  return (
      <div className="container mx-auto py-10 px-4 text-black">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* === CỘT TRÁI: HÌNH ẢNH === */}
          <div className="relative flex justify-center border rounded-lg p-4 shadow-sm bg-white">
            {/* Badge giảm giá */}
            {hasDiscount && (
                <span className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
              -{discountPercent}%
            </span>
            )}

            <Image
                src={imageUrl}
                alt={product?.name || "Chi tiết sản phẩm"}
                width={500}
                height={500}
                className={`w-full h-auto object-contain max-h-[500px] rounded-lg ${
                    isOutOfStock ? "grayscale opacity-80" : ""
                }`}
                onError={() => setImageError(true)}
                priority
            />

            {/* Badge Hết hàng đè lên ảnh */}
            {isOutOfStock && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <span className="bg-black text-white px-6 py-3 text-xl font-bold uppercase -rotate-12 border-2 border-white">
                Hết hàng
              </span>
                </div>
            )}
          </div>

          {/* === CỘT PHẢI: THÔNG TIN === */}
          <div>
            <p className="text-sm text-gray-500 mb-2 uppercase tracking-wide">
              {product.categoryName} • {product.brand}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {product.name}
            </h1>

            {/* Giá bán */}
            <div className="flex items-end gap-3 mb-6">
            <span className="text-3xl text-red-600 font-bold">
              {product.formattedPrice}
            </span>
              {hasDiscount && (
                  <span className="text-xl text-gray-400 line-through mb-1">
                {product.formattedOriginalPrice}
              </span>
              )}
            </div>

            <div className="bg-gray-50 p-5 rounded-lg mb-8 border">
              <p className="text-gray-700 mb-4 leading-relaxed">
                {product.description || "Mô tả đang được cập nhật..."}
              </p>

              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div>
                  <strong>Thương hiệu:</strong> {product.brand}
                </div>
                <div>
                  <strong>Mã SP:</strong> {product.slug}
                </div>
                <div>
                  <strong>Đánh giá:</strong> {product.rating || 0} ⭐ (
                  {product.reviewCount} lượt)
                </div>
                <div
                    className={
                      isOutOfStock
                          ? "text-red-500 font-bold"
                          : "text-green-600 font-bold"
                    }
                >
                  <strong>Tình trạng:</strong>{" "}
                  {isOutOfStock
                      ? "Hết hàng"
                      : `Còn ${product.stockQuantity} sản phẩm`}
                </div>
              </div>
            </div>

            {/* Chọn số lượng */}
            <div className="flex items-center mb-6">
              <span className="mr-4 font-semibold">Số lượng:</span>
              <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                <button
                    onClick={handleDecrease}
                    disabled={isOutOfStock || quantity <= 1}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                >
                  -
                </button>
                <div className="w-16 text-center py-2 bg-white font-medium">
                  {quantity}
                </div>
                <button
                    onClick={handleIncrease}
                    disabled={
                        isOutOfStock || quantity >= product.stockQuantity
                    }
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock || adding}
                  className={`flex-1 px-8 py-3 rounded-lg font-bold uppercase transition
                ${
                      isOutOfStock
                          ? "bg-gray-400 cursor-not-allowed text-white"
                          : "bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl"
                  } disabled:opacity-60`}
              >
                {isOutOfStock
                    ? "Tạm hết hàng"
                    : adding
                        ? "Đang xử lý..."
                        : "Mua Ngay"}
              </button>

              <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || adding}
                  className={`flex-1 px-8 py-3 rounded-lg font-bold uppercase transition border-2
                ${
                      isOutOfStock
                          ? "border-gray-300 text-gray-400 cursor-not-allowed"
                          : "border-blue-600 text-blue-600 hover:bg-blue-50"
                  } disabled:opacity-60`}
              >
                {adding ? "Đang thêm..." : "Thêm vào giỏ"}
              </button>
            </div>
          </div>
        </div>

        {/* === PHẦN REVIEW === */}
        <div className="mt-16 border-t pt-10">
          <h2 className="text-2xl font-bold mb-6">
            Đánh giá khách hàng ({product.reviewCount})
          </h2>
          <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-500">
            {/* Tạm thời để vậy, sau nối API review sau */}
            <p>Chức năng hiển thị chi tiết đánh giá đang được cập nhật.</p>
          </div>
        </div>
      </div>
  );
}
