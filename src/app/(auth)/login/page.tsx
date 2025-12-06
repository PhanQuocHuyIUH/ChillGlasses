"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import Image from "next/image";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebaseConfig";

export default function LoginPage() {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.idToken) throw new Error("No ID token");

    const res = await fetch("http://localhost:8080/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: credential.idToken }),
    });

    const data = await res.json();
    if (!res.ok || !data?.data?.accessToken) throw new Error("Google login failed");

    const token = data.data.accessToken;
    const user = data.data.user;
    
      localStorage.setItem("token", token);
    

    document.cookie = `token=${token}; path=/;`;
    document.cookie = `role=${user.role}; path=/;`;

    if (user.role === "ADMIN") {
      window.location.href = "/admin_accounts";
    } else {
      window.location.href = "/";
    }
  } catch (err) {
    console.error(err);
    alert("Google login failed: " + (err as Error).message);
  }
};



  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username, password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.message || "Đăng nhập thất bại");
        return;
      }

      const data = await res.json();
      const token = data.data.accessToken;
      localStorage.setItem("token", token);

      document.cookie = `token=${token}; path=/;`;

      const resMe = await fetch("http://localhost:8080/api/user/profile", {
        headers: { Authorization: "Bearer " + token }
      });

      if (!resMe.ok) {
        setError("Không thể lấy thông tin người dùng");
        return;
      }

      const meData = await resMe.json();
      const me = meData.data;

      document.cookie = `role=${me.role}; path=/;`;

      if (me.role === "ADMIN") {
        window.location.href = "/admin_accounts";
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
        
          <Image
            src="/images/matkinh.jpg"
            alt="Login illustration"
            className="rounded-2xl w-full h-auto object-cover"
            width={500}
            height={500}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full md:w-1/2 p-10"
        >
          <Card className="rounded-3xl border-0 shadow-none">
            <CardContent className="space-y-6 p-8">

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
                        onClick={()=>handleGoogleLogin()}
                      >
                        <FcGoogle className="text-xl" />
                        Đăng nhập bằng Google
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
  );
}
