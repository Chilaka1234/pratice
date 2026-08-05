import { Link, useLocation } from "react-router-dom";
import "./SidebarPartner.css";

const SidebarPartner = () => {

    const location = useLocation();

  const menus = [
  {
    name: "Dashboard",
    path: "/partner/dashboard",
  },
  {
    name: "My Shipments",
    path: "/partner/shipments",
  },
{
    name:"Profile",
    path:"/partner/profile"
},
];
    return(

        <div className="partner-sidebar">

            <div className="partner-logo">

                CTS

            </div>

            <ul>

                {

                    menus.map((menu)=>(

                        <li
                            key={menu.path}
                            className={
                                location.pathname===menu.path
                                ? "active":""
                            }
                        >

                            <Link to={menu.path}>

                                {menu.name}

                            </Link>

                        </li>

                    ))

                }

            </ul>

        </div>

    )

}

export default SidebarPartner;