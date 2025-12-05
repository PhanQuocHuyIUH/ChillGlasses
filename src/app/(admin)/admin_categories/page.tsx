"use client";

import { useState } from "react";
import AdminHeader from "@/components/layout/AdminHeader";
import SideBar from "@/components/layout/SideBar";

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
  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddCategory = () => {
    if (!form.name || !form.description) {
      alert("Vui lòng điền đầy đủ thông tin danh mục!");
      return;
    }

    setCategories([
      ...categories,
      { id: Date.now(), name: form.name, description: form.description },
    ]);

    setForm({ id: null, name: "", description: "" });
    setShowModal(false);
  };

  const handleEditCategory = (category: typeof form) => {
    setForm(category);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleUpdateCategory = () => {
    setCategories(
      categories.map((c) =>
        c.id === form.id ? { ...c, name: form.name, description: form.description } : c
      )
    );

    setForm({ id: null, name: "", description: "" });
    setIsEditing(false);
    setShowModal(false);
  };

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter((c) => c.id !== id));
  };

  return (
    <div>
      <AdminHeader />
      <div className="flex">
        <SideBar />
        <div className="flex-1 pt-20 min-h-screen ml-90 p-8 bg-gray-100">
          <h1 className="text-3xl font-bold mb-6 text-center">Quản lý danh mục</h1>

          {/* Add Category Button */}
          <button
            onClick={() => {
              setForm({ id: null, name: "", description: "" });
              setIsEditing(false);
              setShowModal(true);
            }}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 mb-6"
          >
            Thêm danh mục mới
          </button>

          {/* Table */}
          <table className="w-full bg-white rounded shadow border border-gray-300">
            <thead className="bg-gray-200 border-b border-gray-300">
              <tr>
                <th className="p-4 text-left border-r border-gray-300">Tên</th>
                <th className="p-4 text-left border-r border-gray-300">Mô tả</th>
                <th className="p-4 text-center">Hành động</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-300">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-100">
                  <td className="p-4 border-r border-gray-300">{category.name}</td>
                  <td className="p-4 border-r border-gray-300">{category.description}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4 text-center">
              {isEditing ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Tên danh mục</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Nhập tên danh mục"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Mô tả</label>
              <input
                type="text"
                name="description"
                value={form.description}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Nhập mô tả"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={isEditing ? handleUpdateCategory : handleAddCategory}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {isEditing ? "Cập nhật" : "Thêm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;