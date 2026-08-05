import { useNavigate } from "react-router-dom";
import TrackShipment from "./TrackShipment";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="logo">Courier Tracking</div>
        <button className="login-btn-nav" onClick={() => navigate("/login")}>Login</button>
      </header>
      <main className="home-main">
        <TrackShipment />
      </main>
    </div>
  );
};

export default Home;