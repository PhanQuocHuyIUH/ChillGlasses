import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { getAuth } from "firebase/auth";
import "@/lib/firebaseConfig";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

const axiosClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ----------------------
// 🔐 GET TOKEN ƯU TIÊN
// ----------------------
const getStoredToken = () => {
  if (typeof window === "undefined") return null;

  // 1️⃣ Ưu tiên token ADMIN (sessionStorage)
  const sessionToken = sessionStorage.getItem("token");
  if (sessionToken) return sessionToken;

  // 2️⃣ Token user thường (localStorage)
  const localToken = localStorage.getItem("token");
  if (localToken) return localToken;

  // 3️⃣ Không có → trả null
  return null;
};

// ----------------------
// 📌 REQUEST INTERCEPTOR
// ----------------------
axiosClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = getStoredToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      }

      // Nếu không có token, fallback Firebase
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const firebaseToken = await user.getIdToken();
        config.headers.Authorization = `Bearer ${firebaseToken}`;
      }
    } catch (error) {
      console.error("Error getting auth token:", error);
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ----------------------
// 📌 RESPONSE INTERCEPTOR
// ----------------------
axiosClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const newToken = await user.getIdToken(true);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosClient(originalRequest);
        }

        // Không có user Firebase → clear và logout
        if (typeof window !== "undefined") {
          localStorage.clear();
          sessionStorage.clear();
          window.location.href = "/login";
        }
      } catch (refreshErr) {
        console.error("Token refresh failed", refreshErr);

        if (typeof window !== "undefined") {
          localStorage.clear();
          sessionStorage.clear();
          window.location.href = "/login";
        }

        return Promise.reject(refreshErr);
      }
    }

    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosClient;
export type { AxiosError, AxiosResponse } from "axios";
