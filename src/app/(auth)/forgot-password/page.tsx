"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; otp?: string; password?: string; confirmPassword?: string }>({});

  function PasswordInput({ value, onChange, placeholder }: { value: string; onChange: (val: string) => void; placeholder: string }) {
    const [show, setShow] = useState(false);
    return (
      <div className="relative w-full">
        <Input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pr-12"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          {show ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    );
  }
  const handleSendEmail = () => {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = "Email không được để trống";
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Email không hợp lệ";

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) setStep(2);
  };

  const handleResetPassword = () => {
    const newErrors: typeof errors = {};
    if (!password) newErrors.password = "Mật khẩu không được để trống";
    if (!confirmPassword) newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    else if (password !== confirmPassword) newErrors.confirmPassword = "Mật khẩu không khớp";

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) setStep(4);
  };

  const instructions: Record<number, string> = {
    1: "Nhập email mà bạn đã đăng ký. Chúng tôi sẽ gửi mã xác minh đến email đó.",
    2: "Nhập mã OTP mà bạn nhận được qua email để xác minh tài khoản.",
    3: "Tạo mật khẩu mới cho tài khoản của bạn.",
    4: "Mật khẩu đã được đặt lại thành công.",
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-amber-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="rounded-3xl shadow-lg p-8">
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold text-gray-800 text-center">
                {step === 1
                  ? "Quên mật khẩu"
                  : step === 2
                  ? "Xác minh OTP"
                  : step === 3
                  ? "Đặt mật khẩu mới"
                  : "Hoàn tất"}
              </h1>
              <p className="text-sm text-gray-600 text-center">{instructions[step]}</p>
            </div>

            <div className="space-y-4 mt-4">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="email"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <Input
                      type="email"
                      placeholder="Nhập email của bạn"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    <Button
                      className="w-full h-12 bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                      onClick={handleSendEmail}
                    >
                      Gửi mã xác minh
                    </Button>
                    <p className="text-sm text-green-600 text-center mt-2">
                      Kiểm tra email của bạn để nhận mã OTP.
                    </p>
                    <div className="text-center mt-2">
                      <Link href="/login">
                        <button className="text-sm text-blue-600 hover:underline cursor-pointer">
                          Quay lại đăng nhập
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
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                    {errors.otp && <p className="text-red-500 text-sm">{errors.otp}</p>}
                    <Button
                      className="w-full h-12 bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                      onClick={() => setStep(3)}
                    >
                      Xác minh
                    </Button>
                    <div className="text-center mt-2">
                      <button
                        className="text-sm text-blue-600 hover:underline cursor-pointer"
                        onClick={() => setStep(1)}
                      >
                        Quay lại
                      </button>
                    </div>
                  </motion.div>
                )}
                {step === 3 && (
                  <motion.div
                    key="reset"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <PasswordInput value={password} onChange={setPassword} placeholder="Mật khẩu mới" />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                    <PasswordInput value={confirmPassword} onChange={setConfirmPassword} placeholder="Xác nhận mật khẩu mới" />
                    {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                    <Button
                      className="w-full h-12 bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                      onClick={handleResetPassword}
                    >
                      Hoàn tất
                    </Button>
                  </motion.div>
                )}
                {step === 4 && (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.8, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 30 }}
                    transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
                    className="flex flex-col items-center space-y-4"
                  >
                    <FaCheckCircle className="text-6xl text-green-500" />
                    <h2 className="text-2xl font-semibold text-center text-green-600">Hoàn tất</h2>
                    <p className="text-gray-700 text-center">
                      Mật khẩu của bạn đã được đặt lại thành công.
                    </p>
                    <Link href="/login">
                      <Button className="w-full h-12 bg-blue-600 text-white hover:bg-blue-700 cursor-pointer">
                        Đăng nhập
                      </Button>
                    </Link>
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
