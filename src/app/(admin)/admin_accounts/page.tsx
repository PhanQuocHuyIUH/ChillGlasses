"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminUserApi, type GetUsersParams } from "@/lib/api/admin";
import type { User } from "@/types/admin";
import { Search, Lock, Unlock, Shield, AlertTriangle } from "lucide-react";

const AdminAccountsManagementPage = () => {
  // State management
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Pagination and filters
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  });

  const [filters, setFilters] = useState<GetUsersParams>({
    search: "",
    role: undefined,
    isActive: undefined,
    page: 0,
    size: 10,
    sortBy: "createdAt",
    sortDir: "DESC",
  });

  // Fetch users on component mount and when filters change
  useEffect(() => {
    fetchUsers();
  }, [filters]);

  /**
   * Fetch all users from API with current filters and pagination
   */
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await adminUserApi.getAllUsers(filters);
      setUsers(response.data.content);
      setPagination({
        page: response.data.pageNumber,
        size: response.data.pageSize,
        totalElements: response.data.totalElements,
        totalPages: response.data.totalPages,
      });
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Toggle user lock/unlock status
   * @param userId - ID of the user to toggle
   * @param isActive - Current active status
   */
  const handleToggleStatus = async (userId: number, isActive: boolean) => {
    if (
      !confirm(
        `Are you sure you want to ${isActive ? "lock" : "unlock"} this user?`
      )
    ) {
      return;
    }

    setActionLoading(userId);
    try {
      if (isActive) {
        await adminUserApi.lockUser(userId);
      } else {
        await adminUserApi.unlockUser(userId);
      }

      // Refresh users list
      await fetchUsers();
      alert(`User ${isActive ? "locked" : "unlocked"} successfully!`);
    } catch (err: any) {
      console.error("Error toggling user status:", err);
      alert(
        err.response?.data?.message ||
          `Failed to ${isActive ? "lock" : "unlock"} user`
      );
    } finally {
      setActionLoading(null);
    }
  };

  /**
   * Handle search input with debounce
   */
  const handleSearch = (value: string) => {
    setFilters({ ...filters, search: value, page: 0 });
  };

  /**
   * Handle role filter change
   */
  const handleRoleFilter = (value: string) => {
    setFilters({
      ...filters,
      role: value === "all" ? undefined : (value as any),
      page: 0,
    });
  };

  /**
   * Handle status filter change
   */
  const handleStatusFilter = (value: string) => {
    setFilters({
      ...filters,
      isActive: value === "all" ? undefined : value === "active",
      page: 0,
    });
  };

  /**
   * Handle pagination - go to next page
   */
  const handleNextPage = () => {
    if (pagination.page < pagination.totalPages - 1) {
      setFilters({ ...filters, page: pagination.page + 1 });
    }
  };

  /**
   * Handle pagination - go to previous page
   */
  const handlePrevPage = () => {
    if (pagination.page > 0) {
      setFilters({ ...filters, page: pagination.page - 1 });
    }
  };

  // Loading state
  if (loading && users.length === 0) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-2">
          Manage user accounts, roles, and permissions
        </p>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by name or email..."
                  value={filters.search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Role Filter */}
            <Select
              value={filters.role || "all"}
              onValueChange={handleRoleFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="CUSTOMER">Customer</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select
              value={
                filters.isActive === undefined
                  ? "all"
                  : filters.isActive
                  ? "active"
                  : "locked"
              }
              onValueChange={handleStatusFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="locked">Locked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50 mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              <div>
                <p className="font-semibold">Error loading users</p>
                <p className="text-sm">{error}</p>
                <Button
                  onClick={fetchUsers}
                  className="mt-3"
                  variant="destructive"
                  size="sm"
                >
                  Retry
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="font-medium">{user.fullName}</div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone || "N/A"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role === "ADMIN" ? "default" : "secondary"
                        }
                      >
                        <Shield className="h-3 w-3 mr-1" />
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.isActive ? "success" : "destructive"}
                      >
                        {user.isActive ? "Active" : "Locked"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Lock/Unlock Button */}
                        <Button
                          size="sm"
                          variant={user.isActive ? "destructive" : "default"}
                          onClick={() =>
                            handleToggleStatus(user.id, user.isActive)
                          }
                          disabled={actionLoading === user.id}
                        >
                          {actionLoading === user.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : user.isActive ? (
                            <>
                              <Lock className="h-4 w-4 mr-1" />
                              Lock
                            </>
                          ) : (
                            <>
                              <Unlock className="h-4 w-4 mr-1" />
                              Unlock
                            </>
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-gray-500"
                  >
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Showing {pagination.page * pagination.size + 1} to{" "}
              {Math.min(
                (pagination.page + 1) * pagination.size,
                pagination.totalElements
              )}{" "}
              of {pagination.totalElements} users
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={pagination.page === 0 || loading}
              >
                Previous
              </Button>
              <div className="text-sm text-gray-600">
                Page {pagination.page + 1} of {pagination.totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={
                  pagination.page >= pagination.totalPages - 1 || loading
                }
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAccountsManagementPage;
