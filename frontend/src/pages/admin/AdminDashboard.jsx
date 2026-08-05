import { useCallback, useEffect, useRef, useState } from "react";
import {
  Chart,
  ArcElement,
  BarElement,
  BarController,
  DoughnutController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../services/api";
import "./AdminDashboard.css";

Chart.register(
  ArcElement,
  BarElement,
  BarController,
  DoughnutController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const chartColors = [
  "#4f46e5",
  "#22c55e",
  "#f97316",
  "#8b5cf6",
  "#0ea5e9",
  "#facc15",
  "#ef4444",
  "#64748b",
  "#ec4899",
  "#14b8a6",
  "#fb7185",
];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const statusChartRef = useRef(null);
  const monthlyChartRef = useRef(null);
  const partnerChartRef = useRef(null);

  const statusChartInstance = useRef(null);
  const monthlyChartInstance = useRef(null);
  const partnerChartInstance = useRef(null);

  const destroyCharts = () => {
    [statusChartInstance, monthlyChartInstance, partnerChartInstance].forEach(
      (instance) => {
        if (instance.current) {
          instance.current.destroy();
          instance.current = null;
        }
      }
    );
  };

  const renderCharts = useCallback(() => {
    destroyCharts();

    if (statusChartRef.current) {
      statusChartInstance.current = new Chart(statusChartRef.current, {
        type: "doughnut",
        data: {
          labels: stats.statusCounts.map((item) => item.status),
          datasets: [
            {
              data: stats.statusCounts.map((item) => item.count),
              backgroundColor: chartColors,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                boxWidth: 12,
                padding: 16,
              },
            },
          },
        },
      });
    }

    if (monthlyChartRef.current) {
      monthlyChartInstance.current = new Chart(monthlyChartRef.current, {
        type: "bar",
        data: {
          labels: stats.monthlyChart.labels,
          datasets: [
            {
              label: "Shipments Created",
              data: stats.monthlyChart.shipments,
              backgroundColor: "#4f46e5",
            },
            {
              label: "Delivered",
              data: stats.monthlyChart.delivered,
              backgroundColor: "#22c55e",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: false,
              },
            },
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0,
              },
            },
          },
          plugins: {
            legend: {
              position: "top",
            },
          },
        },
      });
    }

    if (partnerChartRef.current) {
      partnerChartInstance.current = new Chart(partnerChartRef.current, {
        type: "bar",
        data: {
          labels: stats.partnerPerformance.map((item) => item.name),
          datasets: [
            {
              label: "Delivered Shipments",
              data: stats.partnerPerformance.map((item) => item.delivered),
              backgroundColor: "#0ea5e9",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              ticks: {
                maxRotation: 0,
                minRotation: 0,
              },
            },
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0,
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
    }
  }, [stats]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const { data } = await api.get("/dashboard/stats");
        setStats(data.stats);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    void loadDashboard();
  }, []);

  useEffect(() => {
    if (!loading && stats) {
      renderCharts();
    }

    return () => {
      destroyCharts();
    };
  }, [loading, stats, renderCharts]);

  if (loading || !stats) {
    return (
      <AdminLayout>
        <div className="dashboard-loading">Loading Dashboard...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="dashboard-container">
        <div className="dashboard-heading">
          <div>
            <h1 className="dashboard-title">Admin Dashboard</h1>
            <p className="dashboard-subtitle">Welcome Back Admin 👋</p>
          </div>
        </div>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h3>Total Shipments</h3>
            <h2>{stats.totalShipments}</h2>
          </div>
          <div className="dashboard-card">
            <h3>Delivered</h3>
            <h2>{stats.delivered}</h2>
          </div>
          <div className="dashboard-card">
            <h3>In Transit</h3>
            <h2>{stats.inTransit}</h2>
          </div>
          <div className="dashboard-card">
            <h3>Out For Delivery</h3>
            <h2>{stats.outForDelivery}</h2>
          </div>
          <div className="dashboard-card">
            <h3>Pending</h3>
            <h2>{stats.pending}</h2>
          </div>
          <div className="dashboard-card">
            <h3>Courier Partners</h3>
            <h2>{stats.partners}</h2>
          </div>
        </div>

        <div className="dashboard-grid">
          <section className="dashboard-panel">
            <div className="panel-header">
              <h2>Shipment Status</h2>
            </div>
            <div className="chart-card">
              <canvas ref={statusChartRef} />
            </div>
          </section>

          <section className="dashboard-panel">
            <div className="panel-header">
              <h2>Monthly Shipments</h2>
            </div>
            <div className="chart-card">
              <canvas ref={monthlyChartRef} />
            </div>
          </section>

          <section className="dashboard-panel">
            <div className="panel-header">
              <h2>Top Partner Performance</h2>
            </div>
            <div className="chart-card partner-chart">
              <canvas ref={partnerChartRef} />
            </div>
          </section>
        </div>

        <div className="recent-section">
          <div className="section-header">
            <h2>Recent Shipments</h2>
          </div>
          <table className="recent-table">
            <thead>
              <tr>
                <th>Tracking</th>
                <th>Receiver</th>
                <th>Status</th>
                <th>Partner</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentShipments.length > 0 ? (
                stats.recentShipments.map((shipment) => (
                  <tr key={shipment._id}>
                    <td>{shipment.trackingNumber}</td>
                    <td>{shipment.receiver?.name}</td>
                    <td>{shipment.status}</td>
                    <td>{shipment.assignedPartner?.name || "Not Assigned"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No Shipments Found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;