"use client";

import { useState, useEffect } from "react";
import { adminCategoryApi } from "@/lib/api/admin";
import { Category, CategoryRequest } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  Loader2,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";

const CategoryPage = () => {
  // State management
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const [form, setForm] = useState<CategoryRequest & { id?: number }>({
    name: "",
    description: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch all categories from API
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminCategoryApi.getAllCategories();
      setCategories(response.data);
    } catch (err: any) {
      console.error("Error fetching categories:", err);
      setError(err.response?.data?.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add new category
  const handleAddCategory = async () => {
    if (!form.name || !form.description) {
      alert("Vui lòng điền đầy đủ thông tin danh mục!");
      return;
    }

    setActionLoading(-1); // Use -1 for add action
    try {
      const data: CategoryRequest = {
        name: form.name,
        description: form.description,
      };
      await adminCategoryApi.createCategory(data);
      await fetchCategories(); // Refresh list
      setForm({ name: "", description: "" });
      setShowModal(false);
      alert("Thêm danh mục thành công!");
    } catch (err: any) {
      console.error("Error creating category:", err);
      alert(err.response?.data?.message || "Failed to create category");
    } finally {
      setActionLoading(null);
    }
  };

  // Open edit modal with category data
  const handleEditCategory = (category: Category) => {
    setForm({
      id: category.id,
      name: category.name,
      description: category.description,
    });
    setIsEditing(true);
    setShowModal(true);
  };

  // Update existing category
  const handleUpdateCategory = async () => {
    if (!form.id || !form.name || !form.description) {
      alert("Vui lòng điền đầy đủ thông tin danh mục!");
      return;
    }

    setActionLoading(form.id);
    try {
      const data: CategoryRequest = {
        name: form.name,
        description: form.description,
      };
      await adminCategoryApi.updateCategory(form.id, data);
      await fetchCategories(); // Refresh list
      setForm({ name: "", description: "" });
      setIsEditing(false);
      setShowModal(false);
      alert("Cập nhật danh mục thành công!");
    } catch (err: any) {
      console.error("Error updating category:", err);
      alert(err.response?.data?.message || "Failed to update category");
    } finally {
      setActionLoading(null);
    }
  };

  // Delete category
  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;

    setActionLoading(id);
    try {
      await adminCategoryApi.deleteCategory(id);
      await fetchCategories(); // Refresh list
      alert("Xóa danh mục thành công!");
    } catch (err: any) {
      console.error("Error deleting category:", err);
      alert(err.response?.data?.message || "Failed to delete category");
    } finally {
      setActionLoading(null);
    }
  };

  // Toggle category active status
  const handleToggleStatus = async (id: number, isActive: boolean) => {
    setActionLoading(id);
    try {
      if (isActive) {
        await adminCategoryApi.deactivateCategory(id);
      } else {
        await adminCategoryApi.activateCategory(id);
      }
      await fetchCategories(); // Refresh list
      alert(`${isActive ? "Vô hiệu hóa" : "Kích hoạt"} danh mục thành công!`);
    } catch (err: any) {
      console.error("Error toggling category status:", err);
      alert(err.response?.data?.message || "Failed to toggle category status");
    } finally {
      setActionLoading(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-3 text-lg">Loading categories...</span>
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
                <p className="text-lg font-semibold">
                  Error loading categories
                </p>
                <p className="text-sm text-gray-600">{error}</p>
              </div>
            </div>
            <Button onClick={fetchCategories} className="mt-4 w-full">
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
          Quản lý danh mục
        </h1>

        {/* Add Category Button */}
        <Button
          onClick={() => {
            setForm({ name: "", description: "" });
            setIsEditing(false);
            setShowModal(true);
          }}
          className="mb-6"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm danh mục mới
        </Button>

        {/* Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tên danh mục</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-center">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.id}</TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    <Badge
                      variant={category.isActive ? "success" : "destructive"}
                    >
                      {category.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleToggleStatus(category.id, category.isActive)
                      }
                      disabled={actionLoading === category.id}
                    >
                      {actionLoading === category.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : category.isActive ? (
                        <XCircle className="w-4 h-4" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditCategory(category)}
                      disabled={actionLoading === category.id}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id)}
                      disabled={actionLoading === category.id}
                    >
                      {actionLoading === category.id ? (
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
      </div>

      {/* Modal Dialog */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Tên danh mục
              </label>
              <Input
                type="text"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                placeholder="Nhập tên danh mục"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mô tả</label>
              <Textarea
                name="description"
                value={form.description}
                onChange={handleInputChange}
                placeholder="Nhập mô tả"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Hủy
            </Button>
            <Button
              onClick={isEditing ? handleUpdateCategory : handleAddCategory}
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

export default CategoryPage;
