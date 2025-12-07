"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const API_BASE = "http://localhost:8080/api/admin";

export default function AdminProfile() {
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  // Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [avatar, setAvatar] = useState("");

  // =====================
  // LOAD PROFILE
  // =====================
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          setError("No token found");
          setLoading(false);
          return;
        }

        const res = await fetch(`http://localhost:8080/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          setError("Failed to load admin profile");
          setLoading(false);
          return;
        }

        const data = await res.json();
        const p = data.data;

        setAdmin(p);
        setName(p.fullName);
        setEmail(p.email);
        setPhone(p.phone);
        setRole(p.role);
        setAvatar(p.avatar);

      } catch (e) {
        setError("Error loading profile");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, []);

  // =====================
  // SAVE CHANGES
  // =====================
  const handleSave = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const body = {
        fullName: name,
        phone,
      };

      const res = await fetch(`http://localhost:8080/api/user/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setAdmin(data.data);
      alert("Profile updated!");
      setIsEditing(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  // =====================
  // UPLOAD AVATAR
  // =====================
  const handleAvatarChange = async (e: any) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const token = sessionStorage.getItem("token");
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`http://localhost:8080/api/user/profile/avatar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setAvatar(data.data.avatar);
      alert("Avatar updated!");
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading admin...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Profile</h1>

      <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto flex gap-8">
        
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <Image
            src={avatar || "/default-avatar.png"}
            alt="Admin Avatar"
            width={160}
            height={160}
            className="rounded-full border border-gray-300"
            unoptimized
          />

          <label
            htmlFor="avatar-upload"
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
          >
            Change Avatar
          </label>

          <input
            id="avatar-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleAvatarChange}
          />
        </div>

        {/* Form */}
        <div className="flex-1">
          <div className="flex flex-col gap-4">
            <div>
              <label className="block font-medium mb-1">Name</label>
              <input
                type="text"
                value={name}
                disabled={!isEditing}
                onChange={(e) => setName(e.target.value)}
                className={`w-full border px-4 py-3 rounded ${
                  isEditing ? "bg-white" : "bg-gray-100"
                }`}
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full border px-4 py-3 rounded bg-gray-100"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Phone</label>
              <input
                type="text"
                value={phone}
                disabled={!isEditing}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full border px-4 py-3 rounded ${
                  isEditing ? "bg-white" : "bg-gray-100"
                }`}
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Role</label>
              <input
                type="text"
                value={role}
                disabled
                className="w-full border px-4 py-3 rounded bg-gray-100"
              />
            </div>
          </div>

          <div className="flex justify-end mt-6 gap-4">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
