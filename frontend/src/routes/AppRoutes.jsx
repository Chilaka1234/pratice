import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import Login from "../pages/auth/Login";

import Home from "../pages/public/Home";
import TrackShipment from "../pages/public/TrackShipment";

import AdminDashboard from "../pages/admin/AdminDashboard";

import PartnerDashboard from "../pages/partner/PartnerDashboard";
import ShipmentList from "../pages/admin/ShipmentList";
import AddShipment from "../pages/admin/AddShipment";
import MyShipments from "../pages/partner/MyShipments";
import UpdateShipmentStatus from "../pages/partner/UpdateShipmentStatus";
import PartnerList from "../pages/admin/PartnerList";
import AddPartner from "../pages/admin/AddPartner";
import EditPartner from "../pages/admin/EditPartner";
import AdminProfile from "../pages/admin/AdminProfile";
import PartnerProfile from "../pages/partner/PartnerProfile";
import ChangePassword from "../pages/ChangePassword";
import ShipmentDetails from "../pages/admin/ShipmentDetails";
import EditShipment from "../pages/admin/EditShipment";
const AppRoutes = () => {
  return (
    <Routes>

      <Route path="/" element={<Home />} />

      <Route path="/track" element={<TrackShipment />} />

      <Route path="/login" element={<Login />} />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/partner/dashboard"
        element={
          <ProtectedRoute role="partner">
            <PartnerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/shipments"
        element={
          <ProtectedRoute role="admin">
            <ShipmentList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/shipments/add"
        element={
          <ProtectedRoute role="admin">
            <AddShipment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/change-password"
        element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        }
      />
      <Route
        path="/partner/shipments"
        element={
          <ProtectedRoute role="partner">
            <MyShipments />
          </ProtectedRoute>
        }
      />
<Route
  path="/partner/shipments/:id"
  element={
    <ProtectedRoute role="partner">
      <UpdateShipmentStatus />
    </ProtectedRoute>
  }
/>
<Route
    path="/admin/partners"
    element={
        <ProtectedRoute role="admin">
            <PartnerList/>
        </ProtectedRoute>
    }
/>
<Route
  path="/admin/partners/add"
  element={
    <ProtectedRoute role="admin">
      <AddPartner />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/partners/:id"
  element={
    <ProtectedRoute role="admin">
      <EditPartner />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/profile"
  element={
    <ProtectedRoute role="admin">
      <AdminProfile />
    </ProtectedRoute>
  }
/>
<Route
    path="/partner/profile"
    element={
        <ProtectedRoute role="partner">
            <PartnerProfile />
        </ProtectedRoute>
    }
/>
<Route
  path="/admin/shipments/:id"
  element={
    <ProtectedRoute role="admin">
      <ShipmentDetails />
    </ProtectedRoute>
  }
/>
<Route
    path="/admin/shipments/edit/:id"
    element={
        <ProtectedRoute role="admin">
            <EditShipment/>
        </ProtectedRoute>
    }
/>
    </Routes>
  );
};

export default AppRoutes;