// src/lib/api/axios.ts
import axios, {
    AxiosInstance,
    AxiosError,
    InternalAxiosRequestConfig,
    AxiosResponse,
} from "axios";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

const axiosClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

/**
 * Ưu tiên lấy token theo thứ tự:
 * 1) sessionStorage.token  (có thể dùng cho admin)
 * 2) localStorage.token    (flow cũ / các file khác đang dùng)
 * 3) localStorage.accessToken (flow mới từ /auth/login)
 */
const getStoredToken = () => {
    if (typeof window === "undefined") return null;

    const sessionToken = sessionStorage.getItem("token");
    if (sessionToken) return sessionToken;

    const localToken = localStorage.getItem("token");
    if (localToken) return localToken;

    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) return accessToken;

    return null;
};

// 🔐 Gắn Authorization cho mọi request nếu có token
axiosClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        try {
            const token = getStoredToken();
            if (token) {
                config.headers = config.headers || {};
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error("Error getting auth token:", error);
        }

        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

// 📌 Log lỗi chung, có thể xử lý 401 nếu muốn
axiosClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        console.error("API Error:", error.response?.data || error.message);

        // Nếu sau này muốn auto logout khi 401:
        // if (error.response?.status === 401 && typeof window !== "undefined") {
        //   localStorage.clear();
        //   sessionStorage.clear();
        //   window.location.href = "/login";
        // }

        return Promise.reject(error);
    }
);

export default axiosClient;
export type { AxiosError, AxiosResponse } from "axios";
