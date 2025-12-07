"use client";

import { useState, useEffect } from "react";
import { adminProductApi, adminCategoryApi } from "@/lib/api/admin";
import {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  Category,
} from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertTriangle,
  Loader2,
  Plus,
  Edit,
  Trash2,
  Search,
  Image as ImageIcon,
} from "lucide-react";

const AdminProductsPage = () => {
  // State management
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  });

  // Filter state
  const [filters, setFilters] = useState({
    keyword: "",
    categoryId: undefined as number | undefined,
    brand: "",
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    inStock: undefined as boolean | undefined,
    page: 0,
    size: 10,
    sortBy: "id",
    sortDir: "desc" as "asc" | "desc",
  });

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState<
    number | undefined
  >();
  const [currentProduct, setCurrentProduct] = useState<CreateProductRequest>({
    name: "",
    description: "",
    price: 0,
    stockQuantity: 0,
    categoryId: 0,
    brand: "",
  });

  // Fetch data on mount
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [filters]);

  // Fetch all categories for dropdown
  const fetchCategories = async () => {
    try {
      const response = await adminCategoryApi.getAllCategories();
      setCategories(response.data);
    } catch (err: any) {
      console.error("Error fetching categories:", err);
    }
  };

  // Fetch products with filters
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminProductApi.getAllProducts(filters);
      setProducts(response.data.content);
      setPagination({
        page: response.data.pageNumber,
        size: response.data.pageSize,
        totalElements: response.data.totalElements,
        totalPages: response.data.totalPages,
      });
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setError(err.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (keyword: string) => {
    setFilters({ ...filters, keyword, page: 0 });
  };

  // Handle category filter
  const handleCategoryFilter = (categoryId: string) => {
    setFilters({
      ...filters,
      categoryId: categoryId === "all" ? undefined : parseInt(categoryId),
      page: 0,
    });
  };

  // Handle pagination
  const handleNextPage = () => {
    if (pagination.page < pagination.totalPages - 1) {
      setFilters({ ...filters, page: filters.page + 1 });
    }
  };

  const handlePrevPage = () => {
    if (pagination.page > 0) {
      setFilters({ ...filters, page: filters.page - 1 });
    }
  };

  // Open add product modal
  const handleAddProduct = () => {
    setCurrentProduct({
      name: "",
      description: "",
      price: 0,
      stockQuantity: 0,
      categoryId: categories[0]?.id || 0,
      brand: "",
    });
    setIsEditing(false);
    setEditingProductId(undefined);
    setShowModal(true);
  };

  // Open edit product modal
  const handleEditProduct = (product: Product) => {
    setCurrentProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      stockQuantity: product.stockQuantity,
      categoryId: product.categoryId,
      brand: product.brand || "",
    });
    setIsEditing(true);
    setEditingProductId(product.id);
    setShowModal(true);
  };

  // Save product (create or update)
  const handleSaveProduct = async () => {
    // Validation
    if (!currentProduct.name || currentProduct.name.trim() === "") {
      alert("⚠ Tên sản phẩm không được để trống!");
      return;
    }
    if (currentProduct.price <= 0) {
      alert("⚠ Giá sản phẩm phải lớn hơn 0!");
      return;
    }
    if (currentProduct.stockQuantity < 0) {
      alert("⚠ Tồn kho không được nhỏ hơn 0!");
      return;
    }
    if (!currentProduct.categoryId) {
      alert("⚠ Vui lòng chọn danh mục!");
      return;
    }

    setActionLoading(isEditing ? editingProductId! : -1);
    try {
      if (isEditing && editingProductId) {
        // Update product
        const updateData: UpdateProductRequest = { ...currentProduct };
        await adminProductApi.updateProduct(editingProductId, updateData);
        alert("Cập nhật sản phẩm thành công!");
      } else {
        // Create product
        await adminProductApi.createProduct(currentProduct);
        alert("Thêm sản phẩm thành công!");
      }
      await fetchProducts();
      setShowModal(false);
    } catch (err: any) {
      console.error("Error saving product:", err);
      alert(err.response?.data?.message || "Failed to save product");
    } finally {
      setActionLoading(null);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;

    setActionLoading(id);
    try {
      await adminProductApi.deleteProduct(id);
      await fetchProducts();
      alert("Xóa sản phẩm thành công!");
    } catch (err: any) {
      console.error("Error deleting product:", err);
      alert(err.response?.data?.message || "Failed to delete product");
    } finally {
      setActionLoading(null);
    }
  };

  // Toggle product active status
  const handleToggleStatus = async (id: number, isActive: boolean) => {
    setActionLoading(id);
    try {
      if (isActive) {
        await adminProductApi.deactivateProduct(id);
      } else {
        await adminProductApi.activateProduct(id);
      }
      await fetchProducts();
      alert(`${isActive ? "Vô hiệu hóa" : "Kích hoạt"} sản phẩm thành công!`);
    } catch (err: any) {
      console.error("Error toggling product status:", err);
      alert(err.response?.data?.message || "Failed to toggle product status");
    } finally {
      setActionLoading(null);
    }
  };

  // Loading state
  if (loading && products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-3 text-lg">Loading products...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="max-w-2xl mx-auto mt-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center text-red-600">
              <AlertTriangle className="w-8 h-8 mr-3" />
              <div>
                <p className="text-lg font-semibold">Error loading products</p>
                <p className="text-sm text-gray-600">{error}</p>
              </div>
            </div>
            <Button onClick={fetchProducts} className="mt-4 w-full">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Quản Lý Sản Phẩm
        </h1>

        {/* Filters and Add Button */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <Input
                  placeholder="Tìm kiếm sản phẩm..."
                  value={filters.keyword}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select
                value={filters.categoryId?.toString() || "all"}
                onValueChange={handleCategoryFilter}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả danh mục</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleAddProduct}>
                <Plus className="w-4 h-4 mr-2" />
                Thêm sản phẩm
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tên sản phẩm</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Tồn kho</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-center">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    {categories.find((c) => c.id === product.categoryId)
                      ?.name || "N/A"}
                  </TableCell>
                  <TableCell>
                    {product.price.toLocaleString("vi-VN")}đ
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.stockQuantity > 10
                          ? "success"
                          : product.stockQuantity > 0
                          ? "warning"
                          : "destructive"
                      }
                    >
                      {product.stockQuantity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={product.isActive ? "success" : "destructive"}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleToggleStatus(product.id, product.isActive)
                      }
                      disabled={actionLoading === product.id}
                    >
                      {actionLoading === product.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : product.isActive ? (
                        "Ẩn"
                      ) : (
                        "Hiện"
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditProduct(product)}
                      disabled={actionLoading === product.id}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteProduct(product.id)}
                      disabled={actionLoading === product.id}
                    >
                      {actionLoading === product.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-600">
            Showing {pagination.page * pagination.size + 1} to{" "}
            {Math.min(
              (pagination.page + 1) * pagination.size,
              pagination.totalElements
            )}{" "}
            of {pagination.totalElements} products
          </p>
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={handlePrevPage}
              disabled={pagination.page === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={handleNextPage}
              disabled={pagination.page >= pagination.totalPages - 1}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Product Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Tên sản phẩm *
              </label>
              <Input
                type="text"
                value={currentProduct.name}
                onChange={(e) =>
                  setCurrentProduct({ ...currentProduct, name: e.target.value })
                }
                placeholder="Nhập tên sản phẩm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mô tả</label>
              <Textarea
                value={currentProduct.description}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    description: e.target.value,
                  })
                }
                placeholder="Nhập mô tả sản phẩm"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Danh mục *
                </label>
                <Select
                  value={currentProduct.categoryId.toString()}
                  onValueChange={(value) =>
                    setCurrentProduct({
                      ...currentProduct,
                      categoryId: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Thương hiệu
                </label>
                <Input
                  type="text"
                  value={currentProduct.brand}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      brand: e.target.value,
                    })
                  }
                  placeholder="Nhập thương hiệu"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Giá (VNĐ) *
                </label>
                <Input
                  type="number"
                  value={currentProduct.price}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      price: parseFloat(e.target.value),
                    })
                  }
                  placeholder="Nhập giá"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tồn kho *
                </label>
                <Input
                  type="number"
                  value={currentProduct.stockQuantity}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      stockQuantity: parseInt(e.target.value),
                    })
                  }
                  placeholder="Nhập số lượng"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleSaveProduct}
              disabled={actionLoading !== null}
            >
              {actionLoading !== null ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : isEditing ? (
                "Cập nhật"
              ) : (
                "Thêm"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminProductsPage;
