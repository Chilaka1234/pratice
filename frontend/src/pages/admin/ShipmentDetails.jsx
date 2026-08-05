import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../services/api";
import StatusBadge from "../../components/common/StatusBadge";
import "./ShipmentDetails.css";
import TrackingTimeline from "../../components/common/TrackingTimeline";
const ShipmentDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [shipment, setShipment] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadShipment = async () => {
      try {
        const { data } = await api.get(`/couriers/${id}`);
        setShipment(data.courier);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    void loadShipment();
  }, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <h2>Loading...</h2>
      </AdminLayout>
    );
  }

  if (!shipment) {
    return (
      <AdminLayout>
        <h2>Shipment Not Found</h2>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>

      <div className="shipment-details-page">

        <div className="details-header">

          <h1>Shipment Details</h1>

          <button
            onClick={() =>
              navigate(`/admin/shipments/edit/${shipment._id}`)
            }
          >
            Edit Shipment
          </button>

        </div>

        <div className="details-grid">

          <div className="details-card">

            <h3>Tracking Number</h3>

            <p>{shipment.trackingNumber}</p>

          </div>

          <div className="details-card">

            <h3>Status</h3>

            <StatusBadge status={shipment.status} />

          </div>

          <div className="details-card">

            <h3>Current Location</h3>

            <p>{shipment.currentLocation}</p>

          </div>

          <div className="details-card">

            <h3>Expected Delivery</h3>

            <p>
              {new Date(
                shipment.expectedDeliveryDate
              ).toLocaleDateString()}
            </p>

          </div>

        </div>

        <div className="info-section">

          <div className="info-card">

            <h2>Sender Details</h2>

            <p><strong>Name:</strong> {shipment.sender.name}</p>

            <p><strong>Phone:</strong> {shipment.sender.phone}</p>

            <p><strong>Address:</strong> {shipment.sender.address}</p>

          </div>

          <div className="info-card">

            <h2>Receiver Details</h2>

            <p><strong>Name:</strong> {shipment.receiver.name}</p>

            <p><strong>Phone:</strong> {shipment.receiver.phone}</p>

            <p><strong>Address:</strong> {shipment.receiver.address}</p>

          </div>

        </div>

        <div className="partner-card">

          <h2>Assigned Courier Partner</h2>

          <p>
            {shipment.assignedPartner?.name || "Not Assigned"}
          </p>

        </div>

      <div className="timeline-card">

    <h2>Tracking History</h2>

    {
        shipment.history?.length > 0 ? (

            <TrackingTimeline
                history={shipment.history}
            />

        ) : (

            <p>No Tracking History Available</p>

        )
    }

</div>

      </div>

    </AdminLayout>
  );
};

export default ShipmentDetails;