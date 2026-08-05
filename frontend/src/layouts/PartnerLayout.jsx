import SidebarPartner from "../components/partner/SidebarPartner";
import Header from "../components/common/Header";
import "./PartnerLayout.css";

const PartnerLayout = ({ children }) => {
  return (
    <div className="partner-layout">

      <SidebarPartner />

      <main className="partner-content">

        <Header title="Courier Partner Dashboard" />

        {children}

      </main>

    </div>
  );
};

export default PartnerLayout;