import { useEffect, useState } from "react";
import PartnerLayout from "../../layouts/PartnerLayout";
import api from "../../services/api";
import "./PartnerDashboard.css";

const PartnerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({
    assignedShipments: 0,
    deliveredToday: 0,
    pending: 0,
  });

  useEffect(() => {
    const loadShipments = async () => {
      try {
        const { data } = await api.get("/partner/shipments");
        const shipments = data.shipments || [];

        const today = new Date().toDateString();
        const deliveredToday = shipments.filter((shipment) => {
          if (shipment.status !== "Delivered") return false;
          const deliveredAt = new Date(
            shipment.updatedAt || shipment.createdAt
          );
          return deliveredAt.toDateString() === today;
        }).length;

        const pending = shipments.filter(
          (shipment) => shipment.status !== "Delivered"
        ).length;

        setTotals({
          assignedShipments: shipments.length,
          deliveredToday,
          pending,
        });
      } catch (error) {
        console.error("Partner dashboard load failed:", error);
      } finally {
        setLoading(false);
      }
    };

    void loadShipments();
  }, []);

  return (
    <PartnerLayout>
      <div className="partner-dashboard">

        <h1 className="dashboard-title">
          Partner Dashboard
        </h1>

        <p className="dashboard-subtitle">
          Welcome Back 👋
        </p>

        <div className="partner-cards">

          <div className="partner-card">
            <h3>Assigned Shipments</h3>
            <h2>{loading ? "..." : totals.assignedShipments}</h2>
          </div>

          <div className="partner-card">
            <h3>Delivered Today</h3>
            <h2>{loading ? "..." : totals.deliveredToday}</h2>
          </div>

          <div className="partner-card">
            <h3>Pending</h3>
            <h2>{loading ? "..." : totals.pending}</h2>
          </div>

        </div>

      </div>
    </PartnerLayout>
  );
};

export default PartnerDashboard;