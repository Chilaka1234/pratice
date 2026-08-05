import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminLayout from "../layouts/AdminLayout";
import PartnerLayout from "../layouts/PartnerLayout";
import api from "../services/api";
import "./ChangePassword.css";

const ChangePassword = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    if (!formData.currentPassword || !formData.newPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    try {
      setLoading(true);
      await api.put("/users/change-password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      setMessage("Password updated successfully.");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => navigate(user?.role === "admin" ? "/admin/dashboard" : "/partner/dashboard"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  const layout = user?.role === "partner" ? PartnerLayout : AdminLayout;
  const PageLayout = layout;

  return (
    <PageLayout>
      <div className="change-password-container">
        <div className="change-password-card">
          <h1>Change Password</h1>
          <form onSubmit={handleSubmit}>
            <label>Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Enter current password"
            />
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
            />
            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
            />
            {error && <p className="change-password-error">{error}</p>}
            {message && <p className="change-password-success">{message}</p>}
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </PageLayout>
  );
};

export default ChangePassword;
