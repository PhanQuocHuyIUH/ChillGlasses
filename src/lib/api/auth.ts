// src/lib/api/auth.ts
import axiosClient from "./axios";

// Kiểu user mà backend trả về
export interface AuthUser {
    id: number;
    fullName: string;
    email: string;
    phone: string | null;
    address: string | null;
    role: "CUSTOMER" | "ADMIN" | string;
    isActive: boolean;
    emailVerified: boolean;
    avatar?: string | null;
}

// Kiểu data trong "data" của response login/register
export interface AuthData {
    accessToken: string;
    refreshToken: string;
    tokenType: string; // "Bearer"
    expiresIn: number;
    user: AuthUser;
}

// Kiểu response chung của API
export interface ApiResponse<T> {
    code: number;
    message: string;
    data: T;
    errors?: string[];
    timestamp: string;
}

// Gọi POST /api/auth/login
export async function login(email: string, password: string): Promise<AuthData> {
    const res = await axiosClient.post<ApiResponse<AuthData>>("/auth/login", {
        email,
        password,
    });

    return res.data.data; // trả về AuthData
}

// (Optional) Nếu cần register thì thêm:
export async function register(payload: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
}): Promise<AuthData> {
    const res = await axiosClient.post<ApiResponse<AuthData>>(
        "/auth/register",
        payload
    );

    return res.data.data;
}
