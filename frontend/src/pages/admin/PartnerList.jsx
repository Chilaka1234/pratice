import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../services/api";
import "./PartnerList.css";

const PartnerList = () => {
  const navigate = useNavigate();

  const [partners, setPartners] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchPartners = async () => {
    try {
      const { data } = await api.get("/users/partners");
      setPartners(data.partners || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadPartners = async () => {
      await fetchPartners();
    };

    void loadPartners();
  }, []);

  const deletePartner = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this courier partner?"
  );

  if (!confirmDelete) return;

  try {
    await api.delete(`/users/partners/${id}`);

    alert("Partner deleted successfully.");

    fetchPartners();
  } catch (error) {
    alert(
      error.response?.data?.message || "Failed to delete partner."
    );
  }
};

  return (
    <AdminLayout>
      <div className="partner-page">

        <div className="partner-header">

          <h1>Courier Partners</h1>

          <button
            onClick={() => navigate("/admin/partners/add")}
          >
            + Add Partner
          </button>

        </div>

        {loading ? (
          <h2>Loading...</h2>
        ) : (
          <table className="partner-table">

            <thead>

              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Assigned Area</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {partners.map((partner) => (

                <tr key={partner._id}>

                  <td>{partner.name}</td>

                  <td>{partner.email}</td>

                  <td>{partner.phone}</td>

                  <td>{partner.assignedArea}</td>

                  <td>

                    {partner.isActive ? (
                      <span className="active-status">
                        Active
                      </span>
                    ) : (
                      <span className="inactive-status">
                        Inactive
                      </span>
                    )}

                  </td>

                 <td>

  <button
    className="edit-btn"
    onClick={() =>
      navigate(`/admin/partners/${partner._id}`)
    }
  >
    Edit
  </button>

  <button
    className="delete-btn"
    onClick={() => deletePartner(partner._id)}
  >
    Delete
  </button>

</td>

                </tr>

              ))}

            </tbody>

          </table>
        )}

      </div>
    </AdminLayout>
  );
};

export default PartnerList;