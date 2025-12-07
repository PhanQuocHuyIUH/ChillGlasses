"use client";

import { useState, useEffect } from "react";
import { adminReviewApi } from "@/lib/api/admin";
import { Review, ReviewStatus } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertTriangle,
  Loader2,
  Star,
  CheckCircle,
  XCircle,
  Trash2,
} from "lucide-react";

const RatingPage = () => {
  // State management
  const [reviews, setReviews] = useState<Review[]>([]);
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
    productId: undefined as number | undefined,
    status: undefined as ReviewStatus | undefined,
    rating: undefined as number | undefined,
    page: 0,
    size: 10,
    sortBy: "createdAt",
    sortDir: "DESC" as "ASC" | "DESC",
  });

  // Fetch reviews on mount and when filters change
  useEffect(() => {
    fetchReviews();
  }, [filters]);

  // Fetch reviews from API
  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminReviewApi.getAllReviews(filters);
      setReviews(response.data.content);
      setPagination({
        page: response.data.pageNumber,
        size: response.data.pageSize,
        totalElements: response.data.totalElements,
        totalPages: response.data.totalPages,
      });
    } catch (err: any) {
      console.error("Error fetching reviews:", err);
      setError(err.response?.data?.message || "Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  // Handle search (search functionality removed as API doesn't support text search)
  const handleSearch = (value: string) => {
    // Note: API only supports productId and status filters
    // Text search would need to be implemented on backend
    setFilters({ ...filters, page: 0 });
  };

  // Handle status filter
  const handleStatusFilter = (status: string) => {
    setFilters({
      ...filters,
      status: status === "all" ? undefined : (status as ReviewStatus),
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

  // Approve review
  const handleApprove = async (id: number) => {
    setActionLoading(id);
    try {
      await adminReviewApi.approveReview(id);
      await fetchReviews();
      alert("Duyệt đánh giá thành công!");
    } catch (err: any) {
      console.error("Error approving review:", err);
      alert(err.response?.data?.message || "Failed to approve review");
    } finally {
      setActionLoading(null);
    }
  };

  // Reject review
  const handleReject = async (id: number) => {
    const reason = prompt("Nhập lý do từ chối:");
    if (!reason) return;

    setActionLoading(id);
    try {
      await adminReviewApi.rejectReview(id, reason);
      await fetchReviews();
      alert("Từ chối đánh giá thành công!");
    } catch (err: any) {
      console.error("Error rejecting review:", err);
      alert(err.response?.data?.message || "Failed to reject review");
    } finally {
      setActionLoading(null);
    }
  };

  // Delete review
  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) return;

    setActionLoading(id);
    try {
      await adminReviewApi.deleteReview(id);
      await fetchReviews();
      alert("Xóa đánh giá thành công!");
    } catch (err: any) {
      console.error("Error deleting review:", err);
      alert(err.response?.data?.message || "Failed to delete review");
    } finally {
      setActionLoading(null);
    }
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: ReviewStatus) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "APPROVED":
        return "success";
      case "REJECTED":
        return "destructive";
      default:
        return "default";
    }
  };

  // Get status display text
  const getStatusText = (status: ReviewStatus) => {
    const statusMap: Record<ReviewStatus, string> = {
      PENDING: "Chờ duyệt",
      APPROVED: "Đã duyệt",
      REJECTED: "Đã từ chối",
    };
    return statusMap[status] || status;
  };

  // Render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium">({rating})</span>
      </div>
    );
  };

  // Loading state
  if (loading && reviews.length === 0) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-3 text-lg">Loading reviews...</span>
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
                <p className="text-lg font-semibold">Error loading reviews</p>
                <p className="text-sm text-gray-600">{error}</p>
              </div>
            </div>
            <Button onClick={fetchReviews} className="mt-4 w-full">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Quản Lý Đánh Giá</h1>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <Input
                placeholder="Tìm kiếm (chức năng chưa hỗ trợ)..."
                disabled
                className="w-full"
              />
            </div>
            <Select
              value={filters.status || "all"}
              onValueChange={handleStatusFilter}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="PENDING">Chờ duyệt</SelectItem>
                <SelectItem value="APPROVED">Đã duyệt</SelectItem>
                <SelectItem value="REJECTED">Đã từ chối</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Sản phẩm</TableHead>
              <TableHead>Người dùng</TableHead>
              <TableHead>Nội dung</TableHead>
              <TableHead>Đánh giá</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-center">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell>{review.id}</TableCell>
                <TableCell className="font-medium max-w-[200px] truncate">
                  {review.productName}
                </TableCell>
                <TableCell>{review.userName}</TableCell>
                <TableCell className="max-w-[300px]">
                  <p className="line-clamp-2">{review.comment}</p>
                </TableCell>
                <TableCell>{renderStars(review.rating)}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(review.status)}>
                    {getStatusText(review.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-center space-x-2">
                  {review.status === "PENDING" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApprove(review.id)}
                        disabled={actionLoading === review.id}
                        className="text-green-600 hover:text-green-700"
                      >
                        {actionLoading === review.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(review.id)}
                        disabled={actionLoading === review.id}
                        className="text-yellow-600 hover:text-yellow-700"
                      >
                        {actionLoading === review.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                      </Button>
                    </>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(review.id)}
                    disabled={actionLoading === review.id}
                  >
                    {actionLoading === review.id ? (
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
          of {pagination.totalElements} reviews
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
  );
};

export default RatingPage;
