import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminLayout from "../../layouts/AdminLayout";
import api from "../../services/api";

import "./AddPartner.css";

const AddPartner = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    assignedArea: "",
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

      await api.post("/users/partners", formData);

      alert("Courier Partner Created Successfully");

      navigate("/admin/partners");
    } catch (error) {
      alert(error.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="add-partner-container">

        <h1>Add Courier Partner</h1>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <div className="form-group">

              <label>Full Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />

            </div>

            <div className="form-group">

              <label>Email</label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />

            </div>

            <div className="form-group">

              <label>Phone Number</label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />

            </div>

            <div className="form-group">

              <label>Password</label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />

            </div>

            <div className="form-group full-width">

              <label>Assigned Area</label>

              <input
                type="text"
                name="assignedArea"
                value={formData.assignedArea}
                onChange={handleChange}
                placeholder="Ex: Hyderabad"
                required
              />

            </div>

          </div>

          <button
            className="save-btn"
            disabled={loading}
          >
            {loading ? "Saving..." : "Create Partner"}
          </button>

        </form>

      </div>
    </AdminLayout>
  );
};

export default AddPartner;