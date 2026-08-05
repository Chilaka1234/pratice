import Sidebar from "../components/admin/Sidebar";
import Header from "../components/common/Header";
import "./AdminLayout.css";

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">

      <Sidebar />

      <main className="admin-content">

        <Header title="Admin Dashboard" />

        {children}

      </main>

    </div>
  );
};

export default AdminLayout;