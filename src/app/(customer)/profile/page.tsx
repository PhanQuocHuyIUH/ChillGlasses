"use client";

import { useState } from "react";
import Image from "next/image";

const UserProfile = () => {
  const [fullName, setFullName] = useState("John Doe");
  const [phoneNumber, setPhoneNumber] = useState("123-456-7890");
  const [address, setAddress] = useState("123 Main St, City, Country");
  const [email] = useState("johndoe@example.com"); // Read-only
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState("/images/avatar.png"); // Default avatar
  const [passwordChanged, setPasswordChanged] = useState(false); // State for success message

  // Separate states for toggling visibility of each password field
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSaveProfile = () => {
    console.log("Profile saved:", { fullName, phoneNumber, address });
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all password fields!");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }
    console.log("Password changed:", { currentPassword, newPassword });
    setPasswordChanged(true); // Set success message
    setTimeout(() => setPasswordChanged(false), 3000); // Hide message after 3 seconds
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Create a temporary URL for the uploaded image
      setAvatar(imageUrl);
    }
  };

  return (
    <div className="container mx-auto bg-white shadow-md rounded-lg p-6 mt-8 mb-30">
      <h1 className="text-4xl font-bold mb-4 self-center text-center">USER PROFILE</h1>

      {/* Avatar */}
      <div className="flex items-center mb-6">
        <Image
          src={avatar}
          alt="User Avatar"
          width={120}
          height={120}
          className="rounded-full object-cover mr-4 border border-black"
        />
        <label className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer">
          Change Avatar
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
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
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            title="Full Name"
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Phone Number</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            title="Phone Number"
            placeholder="Enter your phone number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            title="Address"
            placeholder="Enter your address"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            readOnly
            title="Email"
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Save Profile
        </button>
      </form>

      {/* Change Password */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Change Password</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleChangePassword();
          }}
          className="space-y-4"
        >
          <div className="relative">
            <label className="block text-sm font-medium">Current Password</label>
            <input
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              title="Current Password"
              placeholder="Enter your current password"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showCurrentPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium">New Password</label>
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              title="New Password"
              placeholder="Enter your new password"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showNewPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium">Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              title="Confirm Password"
              placeholder="Confirm your new password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Change Password
          </button>
        </form>
        {/* Success Message */}
        {passwordChanged && (
          <div className="mt-4 text-green-500 font-medium">
            Password changed successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;