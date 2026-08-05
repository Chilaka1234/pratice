import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();

  const menus = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
    },
   {
    name:"Shipments",
    path:"/admin/shipments"
},
   {
  name: "Courier Partners",
  path: "/admin/partners",
},
  {
    name:"Profile",
    path:"/admin/profile"
},
  ];

  return (
    <div className="sidebar">

      <div className="sidebar-logo">
        CTS
      </div>

      <ul>

        {menus.map((menu) => (

          <li
            key={menu.path}
            className={
              location.pathname === menu.path
                ? "active"
                : ""
            }
          >
            <Link to={menu.path}>
              {menu.name}
            </Link>
          </li>

        ))}

      </ul>

    </div>
  );
};

export default Sidebar;