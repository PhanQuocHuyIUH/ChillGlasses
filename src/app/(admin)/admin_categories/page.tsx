"use client";

import { useState } from "react";
import AdminHeader from "@/components/layout/AdminHeader";

const CategoryPage = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: "Tròng kính", description: "Loại tròng dùng để lắp vào gọng, có nhiều độ và chất liệu." },
    { id: 2, name: "Gọng không tròng", description: "Gọng kính trong suốt, nhẹ, không viền, tạo cảm giác tối giản." },
    { id: 3, name: "Gọng nhựa", description: "Gọng làm từ nhựa dẻo hoặc acetate, bền và nhiều màu sắc." },
    { id: 4, name: "Kính râm", description: "Kính chống nắng giúp bảo vệ mắt khỏi tia UV và giảm chói." },
    { id: 5, name: "Kính cận", description: "Kính dành cho người bị cận thị, hỗ trợ nhìn xa rõ hơn." },
    { id: 6, name: "Kính viễn", description: "Kính dành cho người viễn thị, hỗ trợ nhìn gần." },
    { id: 7, name: "Kính đọc sách", description: "Kính hỗ trợ nhìn gần, phù hợp khi đọc sách hoặc làm việc gần." },
    { id: 8, name: "Kính chống ánh sáng xanh", description: "Giúp giảm mỏi mắt khi dùng máy tính, điện thoại lâu." },
    { id: 9, name: "Kính thời trang", description: "Kính không độ, dùng để phối đồ hoặc tăng thẩm mỹ." },
    { id: 10, name: "Kính thể thao", description: "Kính chuyên dụng cho hoạt động thể thao, bám chắc, chống va đập." },
  ]);

  const [form, setForm] = useState<{ id: number | null; name: string; description: string }>({
    id: null,
    name: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAddCategory = () => {
    if (form.name && form.description) {
      setCategories([
        ...categories,
        { id: Date.now(), name: form.name, description: form.description },
      ]);
      setForm({ id: null, name: "", description: "" });
    }
  };

  const handleEditCategory = (category: typeof form) => {
    setForm(category);
    setIsEditing(true);
  };

  const handleUpdateCategory = () => {
    setCategories(
      categories.map((cat) =>
        cat.id === form.id ? { ...cat, name: form.name, description: form.description } : cat
      )
    );
    setForm({ id: null, name: "", description: "" });
    setIsEditing(false);
  };

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  return (
    <div>
      <AdminHeader />
      <div className="h-screen w-screen p-8 bg-gray-100">
        <h1 className="text-3xl font-bold mb-4 text-center">Quản lý danh mục</h1>
        <div className="mb-8">
          <h2 className="text-xl text-center font-semibold mb-2">{isEditing ? "Edit Category" : "Add Category"}</h2>
          <div className="flex justify-center gap-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              placeholder="Category Name"
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleInputChange}
              placeholder="Category Description"
              className="border p-2 rounded"
            />
            {isEditing ? (
              <button
                onClick={handleUpdateCategory}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Update
              </button>
            ) : (
              <button
                onClick={handleAddCategory}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            )}
          </div>
        </div>
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-4 text-left">Tên</th>
              <th className="p-4 text-left">Mô tả</th>
              <th className="p-4 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b">
                <td className="p-4">{category.name}</td>
                <td className="p-4">{category.description}</td>
                <td className="p-4">
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
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