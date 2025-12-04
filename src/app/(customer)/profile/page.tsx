"use client";

import { useState, useEffect } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const API_BASE = "http://localhost:8080/api/user";

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

// Password
const [oldPassword, setOldPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [passwordMessage, setPasswordMessage] = useState("");
const [showOldPassword, setShowOldPassword] = useState(false);
const [showNewPassword, setShowNewPassword] = useState(false);

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

    const res = await fetch(`${API_BASE}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      setError("Failed to authenticate. Please login again.");
      setLoading(false);
      return;
    }

    const data = await res.json();
    const userData = data.data; // ApiResponse structure
    setUser(userData);

    setFullName(userData.fullName || "");
    setPhoneNumber(userData.phone || "");
    setAddress(userData.address || "");
    setEmail(userData.email || "");
    setGender(userData.gender || "");
    setBirthday({
      day: userData.day || "",
      month: userData.month || "",
      year: userData.year || "",
    });
    setRecoveryEmail(userData.recoveryEmail || "");
  } catch (err) {
    setError("Cannot load user data");
  } finally {
    setLoading(false);
  }
};
fetchUser();

}, []);

const handleSaveProfile = async () => {
try {
const token = localStorage.getItem("token");
if (!token) return;

  const body = {
    fullName: fullName,
    phone: phoneNumber,
    address,
    gender,
    day: birthday.day,
    month: birthday.month,
    year: birthday.year,
    recoveryEmail
  };

  const res = await fetch(`${API_BASE}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Failed to update profile");

  const data = await res.json();
  setUser(data.data);
  alert("Profile updated successfully!");
} catch (err: any) {
  alert(err.message);
}

};

const [confirmPassword, setConfirmPassword] = useState("");

const handleChangePassword = async () => {
  // validation frontend
  if (!oldPassword || !newPassword || !confirmPassword) {
    setPasswordMessage("Please fill in all fields");
    return;
  }
  if (newPassword.length < 6) {
    setPasswordMessage("New password must be at least 6 characters");
    return;
  }
  if (newPassword !== confirmPassword) {
    setPasswordMessage("New password and confirm password do not match");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const body = {
      currentPassword: oldPassword,
      newPassword,
      confirmPassword,
    };

    const res = await fetch(`${API_BASE}/change-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Failed to change password");

    setPasswordMessage("Password changed successfully!");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  } catch (err: any) {
    setPasswordMessage(err.message || "Failed to change password");
  }
};


if (loading) return <div className="text-center mt-10">Loading user...</div>;
if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

return ( <div className="container mx-auto bg-white shadow-md rounded-lg p-6 mt-8 mb-30"> <h1 className="text-4xl font-bold mb-4 text-center">USER PROFILE</h1>
<div className="mb-6 flex flex-col items-center gap-4">
  <img
    src={user?.avatar || "/default-avatar.png"}
    alt="Avatar"
    className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
  />
  <label className="cursor-pointer px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    Chọn ảnh
    <input
      type="file"
      accept="image/*"
      className="hidden"
      onChange={async (e) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("file", file);

        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`${API_BASE}/profile/avatar`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || "Failed to update avatar");
          setUser(data.data);
          alert("Avatar updated successfully!");
        } catch (err: any) {
          alert(err.message);
        }
      }}
    />
  </label>
</div>




  <form onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }} className="space-y-4">
    <div>
      <label className="block text-sm font-medium">Full Name</label>
      <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full border rounded px-3 py-2" />
    </div>

    <div>
      <label className="block text-sm font-medium">Phone</label>
      <input type="text" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} className="w-full border rounded px-3 py-2" />
    </div>

    <div>
      <label className="block text-sm font-medium">Address</label>
      <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full border rounded px-3 py-2" />
    </div>

    <div>
      <label className="block text-sm font-medium">Gender</label>
      <select value={gender} onChange={e => setGender(e.target.value)} className="w-full border rounded px-3 py-2">
        <option value="">Select gender</option>
        <option value="Nam">Male</option>
        <option value="Nữ">Female</option>
        <option value="Khác">Other</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium">Recovery Email</label>
      <input type="email" value={recoveryEmail} onChange={e => setRecoveryEmail(e.target.value)} className="w-full border rounded px-3 py-2" />
    </div>

    <div>
      <label className="block text-sm font-medium">Email (read only)</label>
      <input type="email" value={email} readOnly className="w-full bg-gray-100 border rounded px-3 py-2 cursor-not-allowed" />
    </div>

    <div className="flex justify-end gap-2 mt-4">
      <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Save Profile</button>
      <button type="button" onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Logout</button>
    </div>
  </form>

  <div className="mt-6 p-4 border rounded">
    <h2 className="text-2xl font-semibold mb-4">Change Password</h2>

  {/* Current Password */}

    <div className="relative mb-3">
      <input
        type={showOldPassword ? "text" : "password"}
        placeholder="Current Password"
        value={oldPassword}
        onChange={e => setOldPassword(e.target.value)}
        className="w-full border rounded px-3 py-2 h-12"
      />
      <button
        type="button"
        onClick={() => setShowOldPassword(!showOldPassword)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
      >
        {showOldPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
      </button>
    </div>

  {/* New Password */}

    <div className="relative mb-3">
      <input
        type={showNewPassword ? "text" : "password"}
        placeholder="New Password"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
        className="w-full border rounded px-3 py-2 h-12"
      />
      <button
        type="button"
        onClick={() => setShowNewPassword(!showNewPassword)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
      >
        {showNewPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
      </button>
    </div>

  {/* Confirm Password */}

    <div className="relative mb-3">
      <input
        type={showNewPassword ? "text" : "password"}
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        className="w-full border rounded px-3 py-2 h-12"
      />
      <button
        type="button"
        onClick={() => setShowNewPassword(!showNewPassword)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
      >
        {showNewPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
      </button>
    </div>

  <button
  onClick={handleChangePassword}
  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
  >Change Password</button>
  {passwordMessage && (
  <p
  className={`mt-2 text-sm ${
          passwordMessage.includes("successfully") ? "text-green-600" : "text-red-600"
        }`}
  >
  {passwordMessage} </p>
  )}

  </div>


</div>

);
};

export default UserProfile;
