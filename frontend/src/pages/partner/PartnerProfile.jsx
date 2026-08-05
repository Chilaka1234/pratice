import { useEffect, useState } from "react";
import PartnerLayout from "../../layouts/PartnerLayout";
import api from "../../services/api";
import "./PartnerProfile.css";

const PartnerProfile = () => {
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    assignedArea: "",
    totalAssigned: 0,
    completed: 0,
    pending: 0,
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await api.get("/users/profile");

        setProfile({
          ...data.user,
          totalAssigned: data.totalAssigned || 0,
          completed: data.completed || 0,
          pending: data.pending || 0,
        });
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
      alert(error.response?.data?.message || "Update Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PartnerLayout>
      <div className="partner-profile">

        <h1>My Profile</h1>

        <div className="profile-top">

          <img
            src="/profile.png"
            alt="Profile"
          />

          <div className="stats">

            <div className="stat-card">
              <h2>{profile.totalAssigned}</h2>
              <p>Total Assigned</p>
            </div>

            <div className="stat-card">
              <h2>{profile.completed}</h2>
              <p>Delivered</p>
            </div>

            <div className="stat-card">
              <h2>{profile.pending}</h2>
              <p>Pending</p>
            </div>

          </div>

        </div>

        <form onSubmit={handleSubmit}>

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

          <div className="form-group">

            <label>Assigned Area</label>

            <input
              value={profile.assignedArea}
              disabled
            />

          </div>

          <button>
            {loading ? "Saving..." : "Save Changes"}
          </button>

        </form>

      </div>
    </PartnerLayout>
  );
};

export default PartnerProfile;