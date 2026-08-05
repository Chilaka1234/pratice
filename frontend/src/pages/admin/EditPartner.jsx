import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AdminLayout from "../../layouts/AdminLayout";
import api from "../../services/api";

import "./EditPartner.css";

const EditPartner = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    assignedArea: "",
    isActive: true,
  });

  useEffect(() => {
    const loadPartner = async () => {
      try {
        const { data } = await api.get(`/users/partners/${id}`);

        setFormData({
          name: data.partner.name,
          email: data.partner.email,
          phone: data.partner.phone,
          assignedArea: data.partner.assignedArea,
          isActive: data.partner.isActive,
        });
      } catch (error) {
        console.log(error);
      }
    };

    void loadPartner();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.put(
        `/users/partners/${id}`,
        formData
      );

      alert("Partner Updated Successfully");

      navigate("/admin/partners");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Update Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>

      <div className="edit-partner-container">

        <h1>Edit Courier Partner</h1>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <div className="form-group">

              <label>Name</label>

              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
              />

            </div>

            <div className="form-group">

              <label>Email</label>

              <input
                name="email"
                value={formData.email}
                disabled
              />

            </div>

            <div className="form-group">

              <label>Phone</label>

              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />

            </div>

            <div className="form-group">

              <label>Assigned Area</label>

              <input
                name="assignedArea"
                value={formData.assignedArea}
                onChange={handleChange}
              />

            </div>

          </div>

          <div className="status-section">

            <label>

              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />

              Active Partner

            </label>

          </div>

          <button
            className="update-btn"
            disabled={loading}
          >
            {loading
              ? "Updating..."
              : "Update Partner"}
          </button>

        </form>

      </div>

    </AdminLayout>
  );
};

export default EditPartner;