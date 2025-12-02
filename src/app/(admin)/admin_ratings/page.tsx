"use client";

import AdminHeader from "@/components/layout/AdminHeader";
import { useState } from "react";

// Mock data for reviews (can be fetched from the ProductDetailPage)
const allReviews = [
  {
    product: "Sản phẩm 1",
    user: "Nguyễn Văn A",
    content: "Sản phẩm rất đẹp và chất lượng. Tôi rất hài lòng!",
    rating: 5,
    status: "approved",
  },
  {
    product: "Sản phẩm 1",
    user: "Trần Thị B",
    content: "Sản phẩm tốt nhưng giao hàng hơi chậm.",
    rating: 4,
    status: "approved",
  },
  {
    product: "Sản phẩm 2",
    user: "Lê Văn C",
    content: "Thiết kế đẹp, nhưng hơi nặng.",
    rating: 4,
    status: "approved",
  },
  {
    product: "Sản phẩm 2",
    user: "Hoàng Thị D",
    content: "Rất hài lòng với sản phẩm này!",
    rating: 5,
    status: "approved",
  },
  {
    product: "Sản phẩm 3",
    user: "Nguyễn Văn E",
    content: "Chờ duyệt...",
    rating: 3,
    status: "pending",
  },
];

const RatingPage = () => {
  const [reviews, setReviews] = useState(allReviews);

  // Approve a review
  const handleApprove = (index: number) => {
    setReviews((prev) =>
      prev.map((review, i) =>
        i === index ? { ...review, status: "approved" } : review
      )
    );
  };

  // Hide a review
  const handleHide = (index: number) => {
    setReviews((prev) =>
      prev.map((review, i) =>
        i === index ? { ...review, status: "hidden" } : review
      )
    );
  };

  // Delete a review
  const handleDelete = (index: number) => {
    setReviews((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <AdminHeader />
      <div className="p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-8 text-center">Quản Lý Đánh Giá</h1>
        <table className="w-screen bg-white shadow-md rounded-lg overflow-hidden mr-20">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left px-4 py-2">Sản phẩm</th>
              <th className="text-left px-4 py-2">Người dùng</th>
              <th className="text-left px-4 py-2">Nội dung</th>
              <th className="text-left px-4 py-2">Số sao</th>
              <th className="text-left px-4 py-2">Trạng thái</th>
              <th className="text-center px-4 py-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review, index) => (
              <tr
                key={index}
                className={`border-t ${
                  review.status === "pending" ? "opacity-50" : ""
                }`}
              >
                <td className="px-4 py-2">{review.product}</td>
                <td className="px-4 py-2">{review.user}</td>
                <td className="px-4 py-2">{review.content}</td>
                <td className="px-4 py-2">{review.rating} ⭐</td>
                <td className="px-4 py-2">
                  {review.status === "approved"
                    ? "Đã duyệt"
                    : review.status === "pending"
                    ? "Chờ duyệt"
                    : "Đã ẩn"}
                </td>
                <td className="px-4 py-2 text-center">
                  {review.status === "pending" && (
                    <button
                      onClick={() => handleApprove(index)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 mr-2"
                    >
                      Duyệt
                    </button>
                  )}
                  {review.status !== "hidden" && (
                    <button
                      onClick={() => handleHide(index)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 mr-2"
                    >
                      Ẩn
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(index)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RatingPage;