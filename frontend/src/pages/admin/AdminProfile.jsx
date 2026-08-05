import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../services/api";
import "./AdminProfile.css";

const AdminProfile = () => {
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await api.get("/users/profile");
        setProfile(data.user);
      } catch (error) {
        console.log(error);
      }
    };

    void loadProfile();
  }, []);

  const handleChange = (e) => {
    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.put("/users/profile", profile);

      alert("Profile Updated Successfully");
    } catch (error) {
      alert(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>

      <div className="profile-container">

        <h1>My Profile</h1>

        <form onSubmit={handleSubmit}>

          <div className="profile-image">

            <img
              src="/profile.png"
              alt="Profile"
            />

          </div>

          <div className="form-group">

            <label>Name</label>

            <input
              name="name"
              value={profile.name}
              onChange={handleChange}
            />

          </div>

          <div className="form-group">

            <label>Email</label>

            <input
              value={profile.email}
              disabled
            />

          </div>

          <div className="form-group">

            <label>Phone</label>

            <input
              name="phone"
              value={profile.phone}
              onChange={handleChange}
            />

          </div>

          <button>

            {loading ? "Saving..." : "Save Changes"}

          </button>

        </form>

      </div>

    </AdminLayout>
  );
};

export default AdminProfile;