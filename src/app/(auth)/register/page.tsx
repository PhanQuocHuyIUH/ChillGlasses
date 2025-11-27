"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";

export default function RegisterPage() {
  function PasswordInput({
    placeholder,
    value,
    onChange,
  }: {
    placeholder: string;
    value: string;
    onChange: (v: string) => void;
  }) {
    const [show, setShow] = useState(false);
    return (
      <div className="relative w-full">
        <Input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          className="w-full pr-12"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {show ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    );
  }

  const [step, setStep] = useState(1);

  const next = () => setStep(step + 1);
  const prev = () => setStep(step - 1);

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 100 }, (_, i) => 2025 - i);

  const [name, setName] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [gender, setGender] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [phone, setPhone] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [address, setAddress] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const existingEmails = ["test@example.com", "user@example.com"];

  const validateStep1 = () => {
    const newErrors: any = {};
    if (!name.trim()) newErrors.name = "Họ và tên không được để trống";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const validateStep2 = () => {
    const newErrors: any = {};
    if (!day) newErrors.day = "Vui lòng chọn ngày";
    if (!month) newErrors.month = "Vui lòng chọn tháng";
    if (!year) newErrors.year = "Vui lòng chọn năm";
    if (!gender) newErrors.gender = "Vui lòng chọn giới tính";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const validateStep3 = () => {
    const newErrors: any = {};

    if (!email.trim()) newErrors.email = "Email không được để trống";
    else if (!/^\S+@\S+\.\S+$/.test(email))
      newErrors.email = "Email không hợp lệ";
    else if (existingEmails.includes(email))
      newErrors.email = "Email đã tồn tại";

    if (!password) newErrors.password = "Mật khẩu không được để trống";
    if (!confirmPassword)
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    else if (password !== confirmPassword)
      newErrors.confirmPassword = "Mật khẩu không khớp";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = () => {
    const newErrors: any = {};

    if (!phone.trim()) newErrors.phone = "Số điện thoại không được để trống";
    if (!recoveryEmail.trim())
      newErrors.recoveryEmail = "Email khôi phục không được để trống";
    if (!address.trim()) newErrors.address = "Địa chỉ không được để trống";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-amber-50 p-4">
      <AnimatePresence mode="wait">
        {step !== 5 && (
          <Card className="w-full max-w-4xl rounded-3xl border-0 shadow-none bg-white flex overflow-hidden">
            <div className="w-1/2 bg-gray-50 p-10 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="left1"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-3xl font-semibold">Tạo tài khoản</h2>
                    <p className="text-gray-600">
                      Nhập họ và tên của bạn để bắt đầu.
                    </p>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="left2"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-3xl font-semibold">Thông tin cá nhân</h2>
                    <p className="text-gray-600">
                      Chọn ngày sinh và giới tính của bạn.
                    </p>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="left3"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-3xl font-semibold">
                      Thông tin đăng nhập
                    </h2>
                    <p className="text-gray-600">Tạo email và mật khẩu của bạn.</p>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="left4"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-3xl font-semibold">Liên hệ</h2>
                    <p className="text-gray-600">
                      Nhập số điện thoại và địa chỉ của bạn.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="w-1/2 p-10">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="space-y-5"
                  >
                    <Input
                      placeholder="Họ và tên"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setErrors({ ...errors, name: "" });
                      }}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm">{errors.name}</p>
                    )}

                    <Button
                      onClick={() => validateStep1() && next()}
                      className="w-full h-12 bg-blue-600 text-white"
                    >
                      Tiếp theo
                    </Button>

                    <div className="text-sm text-right">
                      <span>Đã có tài khoản? </span>
                      <a className="text-blue-600" href="/login">
                        Đăng nhập
                      </a>
                    </div>
                  </motion.div>
                )}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="space-y-5"
                  >
                    <div className="flex gap-2">
                      <select
                        className="flex-1 border rounded-md h-12 px-3"
                        value={day}
                        onChange={(e) => {
                          setDay(e.target.value);
                          setErrors({ ...errors, day: "" });
                        }}
                      >
                        <option value="">Ngày</option>
                        {days.map((d) => (
                          <option key={d}>{d}</option>
                        ))}
                      </select>
                      <select
                        className="flex-1 border rounded-md h-12 px-3"
                        value={month}
                        onChange={(e) => {
                          setMonth(e.target.value);
                          setErrors({ ...errors, month: "" });
                        }}
                      >
                        <option value="">Tháng</option>
                        {months.map((m) => (
                          <option key={m}>{m}</option>
                        ))}
                      </select>
                      <select
                        className="flex-1 border rounded-md h-12 px-3"
                        value={year}
                        onChange={(e) => {
                          setYear(e.target.value);
                          setErrors({ ...errors, year: "" });
                        }}
                      >
                        <option value="">Năm</option>
                        {years.map((y) => (
                          <option key={y}>{y}</option>
                        ))}
                      </select>
                    </div>

                    {(errors.day || errors.month || errors.year) && (
                      <p className="text-red-500 text-sm">
                        Vui lòng chọn đầy đủ ngày, tháng, năm
                      </p>
                    )}
                    <select
                      className="w-full border rounded-md h-12 px-3"
                      value={gender}
                      onChange={(e) => {
                        setGender(e.target.value);
                        setErrors({ ...errors, gender: "" });
                      }}
                    >
                      <option value="">Giới tính</option>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>

                    {errors.gender && (
                      <p className="text-red-500 text-sm">{errors.gender}</p>
                    )}

                    <div className="flex justify-between">
                      <button onClick={prev} className="text-blue-600 underline">
                        Trở lại
                      </button>
                      <Button
                        onClick={() => validateStep2() && next()}
                        className="h-12 bg-blue-600 text-white"
                      >
                        Tiếp theo
                      </Button>
                    </div>
                  </motion.div>
                )}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="space-y-5"
                  >
                    <div>
                      <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setErrors({ ...errors, email: "" });
                        }}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <PasswordInput
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(v) => {
                          setPassword(v);
                          setErrors({ ...errors, password: "" });
                        }}
                      />
                      {errors.password && (
                        <p className="text-red-500 text-sm">
                          {errors.password}
                        </p>
                      )}
                    </div>
                    <div>
                      <PasswordInput
                        placeholder="Xác minh lại mật khẩu"
                        value={confirmPassword}
                        onChange={(v) => {
                          setConfirmPassword(v);
                          setErrors({ ...errors, confirmPassword: "" });
                        }}
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-between">
                      <button
                        onClick={prev}
                        className="text-blue-600 underline cursor-pointer"
                      >
                        Trở lại
                      </button>
                      <Button
                        onClick={() => validateStep3() && next()}
                        className="h-12 bg-blue-600 text-white cursor-pointer"
                      >
                        Tiếp theo
                      </Button>
                    </div>
                  </motion.div>
                )}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="space-y-5"
                  >
                    <div>
                      <Input
                        type="text"
                        placeholder="Số điện thoại"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          setErrors({ ...errors, phone: "" });
                        }}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <Input
                        type="email"
                        placeholder="Email khôi phục"
                        value={recoveryEmail}
                        onChange={(e) => {
                          setRecoveryEmail(e.target.value);
                          setErrors({ ...errors, recoveryEmail: "" });
                        }}
                      />
                      {errors.recoveryEmail && (
                        <p className="text-red-500 text-sm">
                          {errors.recoveryEmail}
                        </p>
                      )}
                    </div>

                    <div>
                      <Input
                        type="text"
                        placeholder="Địa chỉ"
                        value={address}
                        onChange={(e) => {
                          setAddress(e.target.value);
                          setErrors({ ...errors, address: "" });
                        }}
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm">{errors.address}</p>
                      )}
                    </div>

                    <div className="flex justify-between">
                      <button onClick={prev} className="text-blue-600 underline">
                        Trở lại
                      </button>
                      <Button
                        onClick={() => validateStep4() && next()}
                        className="h-12 bg-blue-600 text-white"
                      >
                        Hoàn tất
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        )}
        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center items-center h-full"
          >
            <Card className="max-w-md w-full p-10 rounded-3xl text-center shadow-lg">
              <FaCheckCircle className="text-6xl text-green-500 mx-auto" />
              <h2 className="text-3xl font-semibold mt-4">Hoàn tất</h2>
              <p className="text-gray-700 mt-2">
                Tài khoản của bạn đã được tạo thành công.
              </p>

              <Button
                className="w-full h-12 bg-blue-600 text-white mt-6"
                onClick={() => (window.location.href = "/login")}
              >
                Đi đến đăng nhập
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
