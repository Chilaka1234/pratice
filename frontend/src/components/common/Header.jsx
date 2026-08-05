import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaUserCircle,
  FaChevronDown,
  FaSignOutAlt,
  FaUserCog,
  FaLock,
} from "react-icons/fa";

import api from "../../services/api";
import NotificationBell from "./NotificationBell";
import { useAuth } from "../../context/AuthContext";

import "./Header.css";

const Header = ({ title }) => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [open, setOpen] = useState(false);

  const [keyword, setKeyword] = useState("");

  const [results, setResults] = useState([]);

  const [showResults, setShowResults] = useState(false);

  const menuRef = useRef();

  const searchRef = useRef();

  useEffect(() => {
    const close = (e) => {

      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpen(false);
      }

      if (
        searchRef.current &&
        !searchRef.current.contains(e.target)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("click", close);

    return () => document.removeEventListener("click", close);

  }, []);

  const searchShipment = async (value) => {

    setKeyword(value);

    if (value.trim() === "") {

      setResults([]);

      setShowResults(false);

      return;

    }

    try {

      const { data } = await api.get(
        `/search?keyword=${value}`
      );

      setResults(data.results);

      setShowResults(true);

    } catch (error) {

      console.log(error);

    }

  };

  const handleLogout = () => {

    logout();

    navigate("/login");

  };

  return (
    <header className="header">

      <div className="header-left">

        <h2>{title}</h2>

      </div>

      <div className="header-center">

        <div
          className="search-box"
          ref={searchRef}
        >

          <FaSearch />

          <input
            type="text"
            placeholder="Search Tracking Number..."
            value={keyword}
            onChange={(e) =>
              searchShipment(e.target.value)
            }
          />

          {showResults && (

            <div className="search-results">

              {results.length === 0 ? (

                <div className="search-item">

                  No Shipment Found

                </div>

              ) : (

                results.map((shipment) => (

                  <div
                    className="search-item"
                    key={shipment._id}
                    onClick={() => {

                      navigate(
                        user?.role === "partner"
                          ? `/partner/shipments/${shipment._id}`
                          : `/admin/shipments/${shipment._id}`
                      );

                      setKeyword("");

                      setShowResults(false);

                    }}
                  >

                    <strong>

                      {shipment.trackingNumber}

                    </strong>

                    <br />

                    {shipment.sender?.name}

                    {" → "}

                    {shipment.receiver?.name}

                  </div>

                ))

              )}

            </div>

          )}

        </div>

      </div>

      <div className="header-right">

        <NotificationBell />

        <div
          className="profile-menu"
          ref={menuRef}
        >

          <div
            className="profile-btn"
            onClick={() => setOpen(!open)}
          >

            <FaUserCircle size={30} />

            <div>

              <h4>{user?.name}</h4>

              <small>{user?.role}</small>

            </div>

            <FaChevronDown />

          </div>

          {open && (

            <div className="profile-dropdown">

              <div
                onClick={() =>
                  navigate(
                    user?.role === "admin"
                      ? "/admin/profile"
                      : "/partner/profile"
                  )
                }
              >

                <FaUserCog />

                <span>My Profile</span>

              </div>

              <div
                onClick={() =>
                  navigate("/change-password")
                }
              >

                <FaLock />

                <span>Change Password</span>

              </div>

              <div
                onClick={handleLogout}
              >

                <FaSignOutAlt />

                <span>Logout</span>

              </div>

            </div>

          )}

        </div>

      </div>

    </header>
  );
};

export default Header;