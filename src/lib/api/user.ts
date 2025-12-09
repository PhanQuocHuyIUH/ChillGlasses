// src/lib/api/user.ts
import axiosClient from "./axios";
import type { ApiResponse, User } from "@/types/admin";

/**
 * User API (dành cho user đang đăng nhập)
 * Dùng cho: profile, checkout, setting cá nhân,...
 */
const userApi = {
    /**
     * Lấy profile user hiện tại
     * GET /api/user/profile
     */
    getMyProfile: async () => {
        const response = await axiosClient.get<ApiResponse<User>>("/user/profile");
        // Giả định ApiResponse<User> có field .data
        return response.data.data;
    },
};

export default userApi;
