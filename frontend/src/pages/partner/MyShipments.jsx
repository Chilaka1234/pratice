import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import PartnerLayout from "../../layouts/PartnerLayout";
import "./MyShipments.css";
import StatusBadge from "../../components/common/StatusBadge";

const MyShipments = () => {
  const navigate = useNavigate();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadShipments = async () => {
      try {
        const { data } = await api.get("/partner/shipments");
        setShipments(data.shipments || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    void loadShipments();
  }, []);

  return (
    <PartnerLayout>
      <div className="my-shipments">

        <div className="page-header">
          <h1>My Shipments</h1>
        </div>

        {loading ? (
          <h3>Loading...</h3>
        ) : (
          <table className="shipment-table">

            <thead>

              <tr>
                <th>Tracking No</th>
                <th>Receiver</th>
                <th>Location</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {shipments.map((shipment) => (

                <tr key={shipment._id}>

                  <td>{shipment.trackingNumber}</td>

                  <td>{shipment.receiver.name}</td>

                  <td>{shipment.currentLocation}</td>

                  <td>
                    <StatusBadge status={shipment.status}/>
                  </td>

                  <td>

                    <button
  onClick={() =>
    navigate(`/partner/shipments/${shipment._id}`)
  }
>
  Update
</button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>
        )}

      </div>
    </PartnerLayout>
  );
};

export default MyShipments;