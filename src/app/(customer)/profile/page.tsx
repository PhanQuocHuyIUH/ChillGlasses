"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FiEye, FiEyeOff } from "react-icons/fi";

const UserProfile = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState("");

  // Form fields
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");

  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState({ day: "", month: "", year: "" });
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [avatar, setAvatar] = useState<File | string>("/images/avatar.png");

  // Password change
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  // Hiển thị/ẩn mật khẩu
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const daysInMonth = (month: string | number, year: string | number) => {
    if (!month || !year) return 31;
    return new Date(Number(year), Number(month), 0).getDate();
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    window.location.href = "/"; 
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please login!");
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:8080/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          setError("Failed to authenticate. Please login again.");
          setLoading(false);
          return;
        }

        const data = await res.json();
        setUser(data);

        // Populate form
        setFullName(data.name || "");
        setPhoneNumber(data.phone || "");
        setAddress(data.address || "");
        setEmail(data.email || "");
        setGender(data.gender || "");
        setBirthday({
          day: data.day || "",
          month: data.month || "",
          year: data.year || "",
        });
        setRecoveryEmail(data.recoveryEmail || "");
        setAvatar(data.avatar || "/images/avatar.png");
      } catch (err) {
        setError("Cannot load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Change avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatar(file);
  };

  // Save profile
  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const formData = new FormData();
      formData.append(
        "user",
        new Blob([JSON.stringify({
          name: fullName,
          phone: phoneNumber,
          address,
          gender,
          day: birthday.day,
          month: birthday.month,
          year: birthday.year,
          recoveryEmail
        })], { type: "application/json" })
      );

      if (avatar instanceof File) {
        formData.append("avatar", avatar);
      }

      const res = await fetch("http://localhost:8080/api/users/me", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update profile");

      const updatedUser = await res.json();
      setUser(updatedUser);
      alert("Profile updated successfully!");
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Change password
  const handleChangePassword = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch("http://localhost:8080/api/users/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    // Kiểm tra content-type
    const contentType = res.headers.get("content-type");

    let data: any;
    if (contentType?.includes("application/json")) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    if (!res.ok) throw new Error(data);

    setPasswordMessage("Password changed successfully!");
    setOldPassword("");
    setNewPassword("");
  } catch (err: any) {
    setPasswordMessage(err.message || "Failed to change password");
  }
};


  if (loading) return <div className="text-center mt-10">Loading user...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!user) return <div className="text-center mt-10">No user data found.</div>;

  return (
    <div className="container mx-auto bg-white shadow-md rounded-lg p-6 mt-8 mb-30">
      <h1 className="text-4xl font-bold mb-4 text-center">USER PROFILE</h1>

      {/* Avatar */}
      <div className="flex items-center mb-6">
        <Image
          src={
            typeof avatar === "string"
              ? avatar.startsWith("http")
                ? avatar
                : `http://localhost:8080${avatar}` // prepend backend URL
              : URL.createObjectURL(avatar)
          }
          alt="Avatar"
          width={120}
          height={120}
          className="rounded-full object-cover mr-4 border border-black"
          unoptimized
        />



        <label className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600">
          Change Avatar
          <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
        </label>
      </div>

      {/* Profile Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Phone Number</label>
          <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Address</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full border rounded px-3 py-2">
            <option value="">Select gender</option>
            <option value="Nam">Male</option>
            <option value="Nữ">Female</option>
            <option value="Khác">Other</option>
          </select>
        </div>

        {/* Birthday */}
        <div>
          <label className="block text-sm font-medium">Birthday</label>
          <div className="flex gap-2">
            <select value={birthday.day} onChange={(e) => setBirthday({ ...birthday, day: e.target.value })} className="w-1/3 border px-2 py-2 rounded">
              <option value="">Day</option>
              {Array.from({ length: daysInMonth(birthday.month, birthday.year) }, (_, i) => i + 1).map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <select value={birthday.month} onChange={(e) => setBirthday({ ...birthday, month: e.target.value })} className="w-1/3 border px-2 py-2 rounded">
              <option value="">Month</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select value={birthday.year} onChange={(e) => setBirthday({ ...birthday, year: e.target.value })} className="w-1/3 border px-2 py-2 rounded">
              <option value="">Year</option>
              {Array.from({ length: 100 }, (_, i) => 2025 - i).map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Recovery Email</label>
          <input type="email" value={recoveryEmail} onChange={(e) => setRecoveryEmail(e.target.value)} className="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Email (read only)</label>
          <input type="email" value={email} readOnly className="w-full bg-gray-100 border px-3 py-2 rounded cursor-not-allowed" />
        </div>

        <div className="flex justify-end gap-2 mb-4">
          <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Save Profile</button>
          <button type="button" onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Logout</button>
        </div>
      </form>

      {/* Change Password */}
      <div className="mt-6 p-4 border rounded">
        <h2 className="text-2xl font-semibold mb-4">Change Password</h2>

        {/* Old Password */}
        <div className="relative mb-2">
          <input
            type={showOldPassword ? "text" : "password"}
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          <button
            type="button"
            onClick={() => setShowOldPassword(!showOldPassword)}
            className="absolute right-2 top-2 text-gray-500"
          >
            {showOldPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        </div>

        {/* New Password */}
        <div className="relative mb-2">
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-2 top-2 text-gray-500"
          >
            {showNewPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        </div>

        <button
          onClick={handleChangePassword}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Change Password
        </button>

        {passwordMessage && <p className="mt-2 text-sm text-green-600">{passwordMessage}</p>}
      </div>
    </div>
  );
};

export default UserProfile;
