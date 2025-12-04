"use client";
import { useState } from "react";
import Image from "next/image";
import AdminHeader from "@/components/layout/AdminHeader";
import SideBar from "@/components/layout/SideBar";

const AdminProfile = () => {
  const [adminProfile, setAdminProfile] = useState({
    name: "Phan Quốc Huy",
    email: "phanquochuy@example.com",
    phone: "0123456789",
    role: "ADMIN",
    avatar: "/images/avatar.png", // Default avatar
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file); // Create a temporary URL for the uploaded image
      setAdminProfile((prev) => ({ ...prev, avatar: imageUrl }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdminProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = () => {
    alert("Hồ sơ đã được cập nhật!");
    setIsEditing(false);
  };

  return (
    <div>
      <AdminHeader />
      <SideBar /> {/* Sidebar with fixed width */}
      <div className="ml-90 p-8 bg-gray-100 min-h-screen"> {/* Added margin-left */}
        <h1 className="text-3xl font-bold mb-8 text-center">Hồ Sơ Quản Trị Viên</h1>
        <div className="bg-white p-6 rounded-lg shadow-md max-w-20xl mx-auto flex gap-8">
          {/* Avatar Column */}
          <div className="flex flex-col items-center mr-30">
            <Image
              src={adminProfile.avatar}
              alt="Admin Avatar"
              width={160} // Adjust width as needed
              height={160} // Adjust height as needed
              className="w-40 h-40 rounded-full object-cover border border-gray-300"
            />
            <label
              htmlFor="avatar-upload"
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
            >
              Chỉnh sửa ảnh
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          {/* Profile Information Column */}
          <div className="flex-2 ml-4"> 
            <div className="flex flex-col gap-4">
              <div>
                <label className="block font-medium mb-1">Tên:</label>
                <input
                  type="text"
                  name="name"
                  value={adminProfile.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full border border-gray-300 rounded px-4 py-3 ${
                    isEditing ? "bg-white" : "bg-gray-100"
                  }`}
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={adminProfile.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full border border-gray-300 rounded px-4 py-3 ${
                    isEditing ? "bg-white" : "bg-gray-100"
                  }`}
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Số điện thoại:</label>
                <input
                  type="text"
                  name="phone"
                  value={adminProfile.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full border border-gray-300 rounded px-4 py-3 ${
                    isEditing ? "bg-white" : "bg-gray-100"
                  }`}
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Vai trò:</label>
                <input
                  type="text"
                  name="role"
                  value={adminProfile.role}
                  disabled
                  className="w-full border border-gray-300 rounded px-4 py-3 bg-gray-100"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              {isEditing ? (
                <button
                  onClick={handleSaveChanges}
                  className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600"
                >
                  Lưu thay đổi
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
                >
                  Chỉnh sửa hồ sơ
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;