import "./StatusBadge.css";

const StatusBadge = ({ status }) => {
  const getClassName = () => {
    switch (status) {
      case "Created":
        return "badge created";

      case "Picked Up":
        return "badge picked";

      case "In Transit":
        return "badge transit";

      case "At Origin Hub":
      case "Arrived At Destination Hub":
        return "badge hub";

      case "Out For Delivery":
        return "badge delivery";

      case "Delivered":
        return "badge delivered";

      case "Delivery Attempt Failed":
      case "Customer Unavailable":
      case "Returned To Sender":
      case "Cancelled":
        return "badge failed";

      default:
        return "badge";
    }
  };

  return (
    <span className={getClassName()}>
      {status}
    </span>
  );
};

export default StatusBadge;