"use client";

import { useState } from "react";
import { useParams } from "next/navigation"; // Lấy tham số từ URL
import Image from "next/image";
import product1 from "@/../public/images/product1.jpg";
import product2 from "@/../public/images/product2.jpg";
import product3 from "@/../public/images/product3.jpg";
import product4 from "@/../public/images/product4.jpg";

// Danh sách sản phẩm mẫu
const allProducts = [
  {
    id: 1,
    name: "Sản phẩm 1",
    price: "500.000đ",
    description: "Đây là sản phẩm kính thời trang cao cấp, mang lại sự tự tin và phong cách cho người sử dụng.",
    specs: "Chất liệu nhựa cao cấp, chống tia UV, thiết kế hiện đại.",
    stock: 20,
    rating: 4.5,
    reviews: [
      { name: "Nguyễn Văn A", rating: 5, comment: "Sản phẩm rất đẹp và chất lượng. Tôi rất hài lòng!" },
      { name: "Trần Thị B", rating: 4, comment: "Sản phẩm tốt nhưng giao hàng hơi chậm." },
    ],
    image: product1,
  },
  {
    id: 2,
    name: "Sản phẩm 2",
    price: "700.000đ",
    description: "Sản phẩm kính thời trang với thiết kế hiện đại, phù hợp với mọi lứa tuổi.",
    specs: "Chất liệu kim loại cao cấp, chống xước, chống tia UV.",
    stock: 15,
    rating: 4.0,
    reviews: [
      { name: "Lê Văn C", rating: 4, comment: "Thiết kế đẹp, nhưng hơi nặng." },
      { name: "Hoàng Thị D", rating: 5, comment: "Rất hài lòng với sản phẩm này!" },
    ],
    image: product2,
  },
  {
    id: 3,
    name: "Sản phẩm 3",
    price: "1.000.000đ",
    description: "Kính thời trang cao cấp, mang lại sự sang trọng và đẳng cấp.",
    specs: "Chất liệu nhựa và kim loại, chống tia UV, thiết kế thời thượng.",
    stock: 10,
    rating: 5.0,
    reviews: [
      { name: "Phạm Văn E", rating: 5, comment: "Sản phẩm tuyệt vời, rất đáng tiền!" },
    ],
    image: product3,
  },
  {
    id: 4,
    name: "Sản phẩm 4",
    price: "1.200.000đ",
    description: "Kính thời trang dành cho doanh nhân, thiết kế tinh tế và hiện đại.",
    specs: "Chất liệu cao cấp, chống tia UV, chống xước.",
    stock: 5,
    rating: 3.5,
    reviews: [
      { name: "Nguyễn Thị F", rating: 3, comment: "Sản phẩm ổn, nhưng giá hơi cao." },
    ],
    image: product4,
  },
];

const ProductDetailPage = () => {
  const { id } = useParams(); // Lấy id từ URL
  const [quantity, setQuantity] = useState(1); // Số lượng sản phẩm
  const [newReview, setNewReview] = useState({ name: "", rating: 0, comment: "" }); // Đánh giá mới

  const product = typeof id === "string" ? allProducts.find((p) => p.id === parseInt(id)) : null; // Tìm sản phẩm theo id
  const [reviews, setReviews] = useState(product ? product.reviews : []); // Danh sách đánh giá

  if (!product) {
    return <div className="text-center py-8">Sản phẩm không tồn tại.</div>;
  }

  // Hàm tăng số lượng
  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  // Hàm giảm số lượng
  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // Hàm xử lý khi gửi đánh giá
  const handleSubmitReview = () => {
    if (newReview.name && newReview.rating > 0 && newReview.comment) {
      setReviews((prev) => [...prev, newReview]); // Thêm đánh giá mới vào danh sách
      setNewReview({ name: "", rating: 0, comment: "" }); // Reset form
    } else {
      alert("Vui lòng điền đầy đủ thông tin đánh giá!");
    }
  };

  return (
    <div className="container pt-20 pb-40 mx-auto py-8 px-4">
      {/* Thông tin sản phẩm */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hình ảnh sản phẩm */}
        <div className="flex justify-center">
          <Image
            src={product.image}
            alt={product.name}
            className="w-full h-auto rounded-lg shadow"
            width={500}
            height={500}
            priority
          />
        </div>

        {/* Chi tiết sản phẩm */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-xl text-red-500 font-bold mb-4">Giá: {product.price}</p>
          <p className="text-gray-700 mb-4">
            <strong>Mô tả:</strong> {product.description}
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Thông số kỹ thuật:</strong> {product.specs}
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Tồn kho:</strong> Còn {product.stock} sản phẩm
          </p>

          {/* Nút số lượng */}
          <div className="flex items-center mb-6">
            <button
              onClick={handleDecrease}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-l hover:bg-gray-400"
            >
              -
            </button>
            <input
              type="text"
              value={quantity}
              readOnly
              className="w-12 text-center border-t border-b border-gray-300"
              title="Quantity"
              placeholder="Quantity"
            />
            <button
              onClick={handleIncrease}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-r hover:bg-gray-400"
            >
              +
            </button>
          </div>

          {/* Nút hành động */}
          <div className="flex flex-wrap gap-4">
            <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
              Mua ngay
            </button>
            <button className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>

      {/* Đánh giá và review */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Đánh giá và nhận xét</h2>
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <div key={index} className="border rounded-lg p-4 shadow">
              <h3 className="text-lg font-bold">{review.name}</h3>
              <p className="text-yellow-500">Rating: {review.rating} ⭐</p>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>

        {/* Khung viết đánh giá */}
        <div className="mt-8 border rounded-lg p-4 shadow">
          <h3 className="text-lg font-bold mb-4">Viết đánh giá của bạn</h3>
          <input
            type="text"
            placeholder="Tên của bạn"
            value={newReview.name}
            onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
            className="w-full mb-4 px-4 py-2 border rounded"
          />
          <input
            type="number"
            placeholder="Đánh giá (1-5)"
            value={newReview.rating}
            onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
            className="w-full mb-4 px-4 py-2 border rounded"
            min="1"
            max="5"
          />
          <textarea
            placeholder="Nhận xét của bạn"
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            className="w-full mb-4 px-4 py-2 border rounded"
            rows={4}
          />
          <button
            onClick={handleSubmitReview}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Gửi đánh giá
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;