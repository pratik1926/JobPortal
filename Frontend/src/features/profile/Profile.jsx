import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";

export default function Profile() {
  const [user, setUser] = useState(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔹 Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosClient.get("/user/profile");
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  // 🔹 Change password
  const handleChangePassword = async () => {
    setLoading(true);
    setMessage("");

    try {
      await axiosClient.put("/user/change-password", {
        currentPassword,
        newPassword,
      });

      setMessage("✅ Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "❌ Failed to update password"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      {/* 🔹 Profile Info */}
      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">My Profile</h2>

        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>

      {/* 🔹 Change Password */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>

        <input
          type="password"
          placeholder="Current Password"
          className="w-full border p-2 mb-3 rounded"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="New Password"
          className="w-full border p-2 mb-3 rounded"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button
          onClick={handleChangePassword}
          disabled={loading}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

        {/* 🔹 Message */}
        {message && (
          <p className="mt-3 text-sm">{message}</p>
        )}
      </div>
    </div>
  );
}