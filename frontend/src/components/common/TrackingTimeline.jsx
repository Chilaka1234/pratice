import "./TrackingTimeline.css";

const TrackingTimeline = ({ history = [] }) => {
  return (
    <div className="tracking-timeline">

      {history.map((item, index) => (

        <div className="timeline-row" key={index}>

          <div className="timeline-left">

            <div className="timeline-circle"></div>

            {index !== history.length - 1 && (
              <div className="timeline-line"></div>
            )}

          </div>

          <div className="timeline-right">

            <h4>{item.status}</h4>

            <p>
              <strong>Location:</strong> {item.location}
            </p>

            <p>
              <strong>Remarks:</strong> {item.remarks}
            </p>

            <small>
              {new Date(item.updatedAt).toLocaleString()}
            </small>

          </div>

        </div>

      ))}

    </div>
  );
};

export default TrackingTimeline;