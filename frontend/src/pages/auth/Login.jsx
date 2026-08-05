import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import InputField from "../../components/common/InputField";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await api.post("/auth/login", formData);

      login(data.user, data.token);

      toast.success(data.message);

      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (data.user.role === "partner") {
        navigate("/partner/dashboard");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <h1>Courier Tracking System</h1>

        <p>
          Manage shipments, assign courier partners,
          and track deliveries in real time.
        </p>

        <img
          className="login-image"
          src="/delivery.png"
          alt="Courier"
        />
      </div>

      <div className="login-right">
        <div className="login-card">
          <h2>Welcome Back 👋</h2>

          <p>Login to continue</p>

          <form onSubmit={handleSubmit}>
            <InputField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />

            <InputField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />

            <button
              className="login-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging In..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;