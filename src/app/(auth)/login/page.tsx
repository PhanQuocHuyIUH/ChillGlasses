"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ⚠️ TẠM THỜI KHÓA GOOGLE LOGIN (tránh lỗi Firebase)
  const handleGoogleLogin = () => {
    alert("Tính năng đăng nhập bằng Google tạm thời bị khóa. Vui lòng dùng email & mật khẩu.");
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      const res = await fetch(
          "http://localhost:8080/api/auth/login",
          // Hoặc dùng env nếu muốn linh hoạt:
          // `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api"}/auth/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: username, password }),
          }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        setError(errData?.message || "Đăng nhập thất bại");
        return;
      }

      const data = await res.json();
      const token: string | undefined = data?.data?.accessToken;

      if (!token) {
        setError("Không nhận được accessToken từ server");
        return;
      }

      // 🔐 Lưu token cho axiosClient (nó đang đọc accessToken)
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", token);
        // Giữ thêm key 'token' cho tương thích nếu chỗ khác còn dùng
        localStorage.setItem("token", token);
      }

      document.cookie = `accessToken=${token}; path=/;`;
      // Giữ cookie cũ nếu nơi khác dùng 'token'
      document.cookie = `token=${token}; path=/;`;

      // Gọi /user/profile để lấy thông tin user + role như code cũ
      const resMe = await fetch("http://localhost:8080/api/user/profile", {
        headers: { Authorization: "Bearer " + token },
      });

      if (!resMe.ok) {
        setError("Không thể lấy thông tin người dùng");
        return;
      }

      const meData = await resMe.json();
      const me = meData.data;

      if (typeof window !== "undefined") {
        // Lưu role như cũ
        if (me?.role) {
          localStorage.setItem("role", me.role);
          document.cookie = `role=${me.role}; path=/;`;
        }
        // Lưu full user để checkout auto-fill
        localStorage.setItem("user", JSON.stringify(me));
      }

      // Redirect based on role
      if (me?.role === "ADMIN") {
        window.location.href = "/admin_dashboard";
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      console.error(err);
      setError("Không thể kết nối server");
    }
  };

  return (
      <div className="w-full h-screen flex items-center justify-center bg-amber-50 p-4">
        <div className="flex w-full max-w-4xl bg-white rounded-3xl overflow-hidden">
          {/* Cột hình ảnh */}
          <div className="hidden md:block md:w-1/2">
            <Image
                src="/images/matkinh.jpg"
                alt="Login illustration"
                className="w-full h-full object-cover"
                width={500}
                height={500}
            />
          </div>

          {/* Cột form */}
          <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full md:w-1/2 p-6 md:p-10"
          >
            <Card className="rounded-3xl border-0 shadow-none">
              <CardContent className="space-y-6 p-6 md:p-8">
                <h1 className="text-3xl font-semibold text-gray-800 text-center">
                  {step === 1 ? "Đăng nhập" : "Xác minh OTP"}
                </h1>

                <div className="space-y-4 mt-6">
                  <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="login"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4"
                        >
                          <Input
                              type="text"
                              placeholder="Email hoặc Tên đăng nhập"
                              className="w-full"
                              value={username}
                              onChange={(e) => {
                                setUsername(e.target.value);
                                if (error) setError("");
                              }}
                          />

                          <Input
                              type="password"
                              placeholder="Mật khẩu"
                              className="w-full"
                              value={password}
                              onChange={(e) => {
                                setPassword(e.target.value);
                                if (error) setError("");
                              }}
                          />

                          {error && (
                              <p className="text-red-600 text-sm">{error}</p>
                          )}

                          <div className="text-right">
                            <Link href="/forgot-password">
                              <button className="text-sm text-blue-600 hover:underline cursor-pointer">
                                Quên mật khẩu?
                              </button>
                            </Link>
                          </div>

                          <Button
                              className="w-full h-12 text-base font-medium bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                              onClick={handleLogin}
                          >
                            Đăng nhập
                          </Button>

                          <Button
                              className="w-full h-12 text-base flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 cursor-pointer"
                              variant="outline"
                              type="button"
                              onClick={handleGoogleLogin}
                          >
                            <FcGoogle className="text-xl" />
                            Đăng nhập bằng Google (tạm khóa)
                          </Button>

                          <div className="text-center mt-2">
                            <Link href="/register">
                              <button className="text-sm text-blue-600 hover:underline font-medium cursor-pointer">
                                Tạo tài khoản
                              </button>
                            </Link>
                          </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="otp"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4"
                        >
                          <Input
                              type="text"
                              placeholder="Nhập mã OTP"
                              className="w-full"
                          />
                          <Link href="/">
                            <Button className="w-full h-12 text-base font-medium bg-blue-600 text-white hover:bg-blue-700 cursor-pointer">
                              Xác minh
                            </Button>
                          </Link>
                          <div className="text-center mt-2">
                            <button
                                className="text-sm text-blue-600 hover:underline font-medium cursor-pointer"
                                onClick={() => setStep(1)}
                            >
                              Trở lại
                            </button>
                          </div>
                        </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
  );
}
