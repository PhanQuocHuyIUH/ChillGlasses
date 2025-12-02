"use client";

import { useState } from "react";
import AdminHeader from "@/components/layout/AdminHeader";

const CategoryPage = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: "Tròng kính", description: "Loại tròng dùng để lắp vào gọng, có nhiều độ và chất liệu." },
    { id: 2, name: "Gọng không tròng", description: "Gọng kính trong suốt, nhẹ, không viền, tạo cảm giác tối giản." },
    { id: 3, name: "Gọng nhựa", description: "Gọng làm từ nhựa dẻo hoặc acetate, bền và nhiều màu sắc." },
    { id: 4, name: "Kính râm", description: "Kính chống nắng bảo vệ mắt khỏi tia UV và giảm chói." },
    { id: 5, name: "Kính cận", description: "Kính dành cho người cận thị, hỗ trợ nhìn xa rõ hơn." },
  ]);

  const [form, setForm] = useState({
    id: null as number | null,
    name: "",
    description: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddCategory = () => {
    if (!form.name || !form.description) return;

    setCategories([
      ...categories,
      { id: Date.now(), name: form.name, description: form.description },
    ]);

    setForm({ id: null, name: "", description: "" });
  };

  const handleEditCategory = (category: typeof form) => {
    setForm(category);
    setIsEditing(true);
  };

  const handleUpdateCategory = () => {
    setCategories(
      categories.map((c) =>
        c.id === form.id ? { ...c, name: form.name, description: form.description } : c
      )
    );

    setForm({ id: null, name: "", description: "" });
    setIsEditing(false);
  };

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter((c) => c.id !== id));
  };

  return (
    <div>
      <AdminHeader />

      {/* FIX CHE HEADER */}
      <div className="pt-20 min-h-screen w-screen p-8 bg-gray-100">

        <h1 className="text-3xl font-bold mb-6 text-center">Quản lý danh mục</h1>

        {/* FORM */}
        <div className="bg-white p-6 rounded shadow mb-8 max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-center">
            {isEditing ? "Chỉnh sửa danh mục" : "Thêm danh mục"}
          </h2>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              placeholder="Tên danh mục"
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleInputChange}
              placeholder="Mô tả"
              className="border p-2 rounded w-full"
            />

            {isEditing ? (
              <button
                onClick={handleUpdateCategory}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Cập nhật
              </button>
            ) : (
              <button
                onClick={handleAddCategory}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Thêm
              </button>
            )}
          </div>
        </div>

        {/* TABLE */}
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-4 text-left w-1/4">Tên</th>
              <th className="p-4 text-left w-2/4">Mô tả</th>
              <th className="p-4 text-center w-1/4">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b">
                <td className="p-4">{category.name}</td>
                <td className="p-4">{category.description}</td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
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

export default CategoryPage;
