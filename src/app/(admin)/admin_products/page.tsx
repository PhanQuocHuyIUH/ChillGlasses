"use client";

import AdminHeader from "@/components/layout/AdminHeader";
import SideBar from "@/components/layout/SideBar";
import { useState } from "react";

// Define the Product interface
interface Product {
  id: number | undefined;
  name: string;
  category: string;
  price: string;
  stock: number;
  status: string;
}

const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Sản phẩm 1", category: "Danh mục 1", price: "500.000đ", stock: 20, status: "Hiển thị" },
    { id: 2, name: "Sản phẩm 2", category: "Danh mục 2", price: "700.000đ", stock: 15, status: "Ẩn" },
    { id: 3, name: "Sản phẩm 3", category: "Danh mục 1", price: "1.000.000đ", stock: 10, status: "Hiển thị" },
  ]);

  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [currentProduct, setCurrentProduct] = useState<Product>({
    id: undefined,
    name: "",
    category: "",
    price: "",
    stock: 0,
    status: "Hiển thị",
  }); // Default product state

  const handleEdit = (product: Product) => {
    setCurrentProduct(product); // Set the product to be edited
    setShowModal(true); // Show the modal
  };

  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      setProducts(products.filter((product) => product.id !== id));
    }
  };

  const handleAddProduct = () => {
    setCurrentProduct({
      id: undefined,
      name: "",
      category: "",
      price: "",
      stock: 0,
      status: "Hiển thị",
    }); // Reset the product for adding a new one
    setShowModal(true); // Show the modal
  };

  const handleSave = () => {
    // Kiểm tra tên sản phẩm
    if (!currentProduct.name || currentProduct.name.trim() === "") {
      alert("⚠ Tên sản phẩm không được để trống!");
    return;
    }

    // Kiểm tra danh mục
    if (!currentProduct.category || currentProduct.category.trim() === "") {
      alert("⚠ Danh mục không được để trống!");
      return;
    }

    // Kiểm tra giá (không để trống + phải chứa số)
    if (!currentProduct.price || currentProduct.price.trim() === "") {
      alert("⚠ Giá sản phẩm không được để trống!");
      return;
    }

    if (!/[0-9]/.test(currentProduct.price)) {
      alert("⚠ Giá sản phẩm phải chứa số!");
      return;
    }

    // Kiểm tra tồn kho hợp lệ
    if (isNaN(currentProduct.stock)) {
      alert("⚠ Tồn kho phải là số!");
      return;
    }

    if (currentProduct.stock < 0) {
      alert("⚠ Tồn kho không được nhỏ hơn 0!");
      return;
    }


    if (currentProduct.id) {
      // Update
      setProducts((prev) =>
        prev.map((product) =>
          product.id === currentProduct.id ? currentProduct : product
        )
      );
    } else {
      // Add
      setProducts((prev) => [
        ...prev,
        { ...currentProduct, id: Date.now() },
      ]);
    }
    setShowModal(false);
  };


  return (
    <div>
      <AdminHeader />
      <SideBar />
      <div className="p-8 w-screen">
        <h1 className="text-3xl font-bold mb-8 mt-5 text-center">Quản Lý Sản Phẩm</h1>
        <button
          onClick={handleAddProduct}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 mb-6 ml-100"
        >
          Thêm sản phẩm mới
        </button>
        <table className="ml-100 bg-white shadow-md rounded-lg border border-gray-300">
          <thead className="bg-gray-200 border-b border-gray-300">
            <tr>
              <th className="text-left px-4 py-2 border-r border-gray-300">Tên sản phẩm</th>
              <th className="text-left px-4 py-2 border-r border-gray-300">Danh mục</th>
              <th className="text-left px-4 py-2 border-r border-gray-300">Giá</th>
              <th className="text-left px-4 py-2 border-r border-gray-300">Tồn kho</th>
              <th className="text-left px-4 py-2 border-r border-gray-300">Trạng thái</th>
              <th className="text-center px-4 py-2">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border-r border-gray-300">{product.name}</td>
                <td className="px-4 py-2 border-r border-gray-300">{product.category}</td>
                <td className="px-4 py-2 border-r border-gray-300">{product.price}</td>
                <td className="px-4 py-2 border-r border-gray-300">{product.stock}</td>
                <td className="px-4 py-2 border-r border-gray-300">{product.status}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 mr-2"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(product.id!)}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center" aria-hidden={!showModal}>
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">
              {currentProduct.id ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Tên sản phẩm</label>
              <input
                type="text"
                value={currentProduct.name}
                placeholder="Nhập tên sản phẩm"
                onChange={(e) =>
                  setCurrentProduct((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Danh mục</label>
              <input
                type="text"
                value={currentProduct.category}
                placeholder="Nhập danh mục sản phẩm"
                onChange={(e) =>
                  setCurrentProduct((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Giá</label>
              <input
                type="text"
                value={currentProduct.price}
                placeholder="Nhập giá sản phẩm"
                title="Giá sản phẩm"
                onChange={(e) =>
                  setCurrentProduct((prev) => ({
                    ...prev,
                    price: e.target.value,
                  }))
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Tồn kho</label>
              <input
                type="number"
                value={currentProduct.stock}
                placeholder="Nhập số lượng tồn kho"
                title="Số lượng tồn kho"
                onChange={(e) =>
                  setCurrentProduct((prev) => ({
                    ...prev,
                    stock: parseInt(e.target.value, 10),
                  }))
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Trạng thái</label>
              <select
                value={currentProduct.status}
                onChange={(e) =>
                  setCurrentProduct((prev) => ({
                    ...prev,
                    status: e.target.value,
                  }))
                }
                className="w-full border rounded px-3 py-2"
              >
                <option value="Hiển thị">Hiển thị</option>
                <option value="Ẩn">Ẩn</option>
              </select>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;