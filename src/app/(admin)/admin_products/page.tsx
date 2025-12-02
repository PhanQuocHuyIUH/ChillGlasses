"use client";

import AdminHeader from "@/components/layout/AdminHeader";
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
    if (!currentProduct.name || !currentProduct.category || !currentProduct.price) {
      alert("Vui lòng điền đầy đủ thông tin sản phẩm!");
      return;
    }

    if (currentProduct.id) {
      // Edit existing product
      setProducts((prev) =>
        prev.map((product) =>
          product.id === currentProduct.id ? currentProduct : product
        )
      );
    } else {
      // Add new product
      setProducts((prev) => [
        ...prev,
        { ...currentProduct, id: Date.now() }, // Assign a unique ID
      ]);
    }
    setShowModal(false); // Close the modal
  };

  return (
    <div>
      <AdminHeader />
      <div className="p-8 w-screen">
        <h1 className="text-3xl font-bold mb-8 mt-5 text-center">Quản Lý Sản Phẩm</h1>
        <button
          onClick={handleAddProduct}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 mb-6"
        >
          Thêm sản phẩm mới
        </button>
        <table className="w-screen bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left px-4 py-2">Tên sản phẩm</th>
              <th className="text-left px-4 py-2">Danh mục</th>
              <th className="text-left px-4 py-2">Giá</th>
              <th className="text-left px-4 py-2">Tồn kho</th>
              <th className="text-left px-4 py-2">Trạng thái</th>
              <th className="text-center px-4 py-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="px-4 py-2">{product.name}</td>
                <td className="px-4 py-2">{product.category}</td>
                <td className="px-4 py-2">{product.price}</td>
                <td className="px-4 py-2">{product.stock}</td>
                <td className="px-4 py-2">{product.status}</td>
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
          <div className="bg-white p-6 rounded-lg shadow-lg w-lg">
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