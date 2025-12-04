"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

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

  const [avatar, setAvatar] = useState("/images/avatar.png");
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

        const res = await fetch("http://localhost:8080/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          setError("Failed to authenticate. Please login again.");
          setLoading(false);
          return;
        }

        const data = await res.json();
        setUser(data);

        // Gán dữ liệu vào form
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
      } catch (error) {
        setError("Cannot load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Change avatar
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar(url);
    }
  };

  // Save profile
  const handleSaveProfile = () => {
    console.log("Saving profile", {
      fullName,
      phoneNumber,
      address,
      gender,
      birthday,
      recoveryEmail,
    });
  };

  // Loading
  if (loading) return <div className="text-center mt-10">Loading user...</div>;

  // Error
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;

  // Not logged in
  if (!user)
    return <div className="text-center mt-10">No user data found.</div>;

  return (
    <div className="container mx-auto bg-white shadow-md rounded-lg p-6 mt-8 mb-30">
      <h1 className="text-4xl font-bold mb-4 text-center">USER PROFILE</h1>

      {/* Avatar */}
      <div className="flex items-center mb-6">
        <Image
          src={avatar}
          alt="Avatar"
          width={120}
          height={120}
          className="rounded-full object-cover mr-4 border border-black"
        />

        <label className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600">
          Change Avatar
          <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
        </label>
      </div>

      {/* Profile Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSaveProfile();
        }}
        className="space-y-4"
      >
        {/* NAME */}
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* PHONE */}
        <div>
          <label className="block text-sm font-medium">Phone Number</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* ADDRESS */}
        <div>
          <label className="block text-sm font-medium">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* GENDER */}
        <div>
          <label className="block text-sm font-medium">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select gender</option>
            <option value="Nam">Male</option>
            <option value="Nữ">Female</option>
            <option value="Khác">Other</option>
          </select>
        </div>
        {/* BIRTHDAY */}
<div>
  <label className="block text-sm font-medium">Birthday</label>
  <div className="flex gap-2">

    {/* DAY */}
    <select
      value={birthday.day}
      onChange={(e) =>
        setBirthday({ ...birthday, day: e.target.value })
      }
      className="w-1/3 border px-2 py-2 rounded"
    >
      <option value="">Day</option>
      {Array.from({ length: daysInMonth(birthday.month, birthday.year) }, (_, i) => i + 1).map(
        (d) => (
          <option key={d} value={d}>{d}</option>
        )
      )}
    </select>

    {/* MONTH */}
    <select
      value={birthday.month}
      onChange={(e) =>
        setBirthday({ ...birthday, month: e.target.value })
      }
      className="w-1/3 border px-2 py-2 rounded"
    >
      <option value="">Month</option>
      {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
        <option key={m} value={m}>{m}</option>
      ))}
    </select>

    {/* YEAR */}
    <select
      value={birthday.year}
      onChange={(e) =>
        setBirthday({ ...birthday, year: e.target.value })
      }
      className="w-1/3 border px-2 py-2 rounded"
    >
      <option value="">Year</option>
      {Array.from({ length: 100 }, (_, i) => 2025 - i).map((y) => (
        <option key={y} value={y}>{y}</option>
      ))}
    </select>

  </div>
</div>


        {/* RECOVERY EMAIL */}
        <div>
          <label className="block text-sm font-medium">Recovery Email</label>
          <input
            type="email"
            value={recoveryEmail}
            onChange={(e) => setRecoveryEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* EMAIL READONLY */}
        <div>
          <label className="block text-sm font-medium">Email (read only)</label>
          <input
            type="email"
            value={email}
            readOnly
            className="w-full bg-gray-100 border px-3 py-2 rounded cursor-not-allowed"
          />
        </div>

        
        <div className="flex justify-end mb-4">
          <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Save Profile
          </button>
          <button
            onClick={() => handleLogout()}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
