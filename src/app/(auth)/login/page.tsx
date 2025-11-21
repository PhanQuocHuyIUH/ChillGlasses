"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

export default function LoginPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-amber-50 p-4">
      <div className="flex w-full max-w-4xl bg-white rounded-3xl overflow-hidden">
        <div className="hidden md:flex w-1/2 bg-gray-100 items-center justify-center p-6">
          <img
            src="/images/matkinh.jpg"
            alt="Login illustration"
            className="rounded-2xl w-full h-auto object-cover"
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
                      />
                      <Input
                        type="password"
                        placeholder="Mật khẩu"
                        className="w-full"
                      />
                      <div className="text-right">
                        <Link href="/forgot-password">
                          <button className="text-sm text-blue-600 hover:underline cursor-pointer">
                            Quên mật khẩu?
                          </button>
                        </Link>
                        
                      </div>
                      <Button
                        className="w-full h-12 text-base font-medium bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                        onClick={() => setStep(2)}
                      >
                        Đăng nhập
                      </Button>
                      <Button
                        className="w-full h-12 text-base flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 cursor-pointer"
                        variant="outline"
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
                      <Button
                        className="w-full h-12 text-base font-medium bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                      >
                        Xác minh
                      </Button>
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
