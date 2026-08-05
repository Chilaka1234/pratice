import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import PartnerLayout from "../../layouts/PartnerLayout";
import "./UpdateShipmentStatus.css";

const UpdateShipmentStatus = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [shipment, setShipment] = useState(null);

  const [formData, setFormData] = useState({
    status: "",
    location: "",
    remarks: "",
  });

  useEffect(() => {
    const loadShipment = async () => {
      try {
        const { data } = await api.get(`/couriers/${id}`);

        setShipment(data.courier);

        setFormData({
          status: data.courier.status,
          location: data.courier.currentLocation,
          remarks: "",
        });
      } catch (error) {
        console.log(error);
      }
    };

    void loadShipment();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/tracking/${id}`, formData);

      alert("Shipment Updated Successfully");

      navigate("/partner/shipments");
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  return (
    <PartnerLayout>

      <div className="update-container">

        <h1>Update Shipment</h1>

        {shipment && (

          <form onSubmit={handleSubmit}>

            <div className="info-box">

              <h3>{shipment.trackingNumber}</h3>

              <p>
                Receiver :
                <strong> {shipment.receiver.name}</strong>
              </p>

            </div>

            <label>Status</label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >

                <option value="Created">Created</option>
              <option value="Picked Up">Picked Up</option>
              <option value="At Origin Hub">At Origin Hub</option>
              <option value="In Transit">In Transit</option>
              <option value="Arrived At Destination Hub">Arrived At Destination Hub</option>
              <option value="Out For Delivery">Out For Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Delivery Attempt Failed">Delivery Attempt Failed</option>
              <option value="Customer Unavailable">Customer Unavailable</option>
              <option value="Returned To Sender">Returned To Sender</option>
              <option value="Cancelled">Cancelled</option>

            </select>

            <label>Current Location</label>

            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
            />

            <label>Remarks</label>

            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
            />

            <button>

              Update Shipment

            </button>

          </form>

        )}

      </div>

    </PartnerLayout>
  );
};

export default UpdateShipmentStatus;