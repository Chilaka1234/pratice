import { useState } from "react";
import api from "../../services/api";
import "./TrackShipment.css";

const TrackShipment = () => {
  const [trackingNumber, setTrackingNumber] = useState("");

  const [shipment, setShipment] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await api.get(
        `/couriers/track/${trackingNumber}`
      );

      setShipment(data.courier);
    } catch (error) {
      alert(error.response?.data?.message || "Shipment Not Found");
      setShipment(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tracking-page">

      <div className="tracking-card">

        <h1>Track Shipment</h1>

        <form onSubmit={handleTrack}>

          <input
            type="text"
            placeholder="Enter Tracking Number"
            value={trackingNumber}
            onChange={(e) =>
              setTrackingNumber(e.target.value)
            }
          />

          <button>
            {loading ? "Searching..." : "Track"}
          </button>

        </form>

        {shipment && (

          <div className="shipment-details">

            <h2>{shipment.trackingNumber}</h2>

            <div className="detail-row">
              <strong>Status</strong>
              <span>{shipment.status}</span>
            </div>

            <div className="detail-row">
              <strong>Current Location</strong>
              <span>{shipment.currentLocation}</span>
            </div>

            <div className="detail-row">
              <strong>Receiver</strong>
              <span>{shipment.receiver.name}</span>
            </div>

            <div className="detail-row">
              <strong>Expected Delivery</strong>
              <span>
                {new Date(
                  shipment.expectedDeliveryDate
                ).toLocaleDateString()}
              </span>
            </div>

            <h3>Tracking History</h3>

            <div className="timeline">

              {shipment.history.map((item) => (

                <div
                  className="timeline-item"
                  key={item._id}
                >

                  <div className="timeline-dot"></div>

                  <div>

                    <h4>{item.status}</h4>

                    <p>{item.location}</p>

                    <small>{item.remarks}</small>

                  </div>

                </div>

              ))}

            </div>

          </div>

        )}

      </div>

    </div>
  );
};

export default TrackShipment;