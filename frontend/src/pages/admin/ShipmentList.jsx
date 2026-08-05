import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminLayout from "../../layouts/AdminLayout";
import api from "../../services/api";
import StatusBadge from "../../components/common/StatusBadge";

import "./ShipmentList.css";

const ShipmentList = () => {

    const navigate = useNavigate();

    const [shipments, setShipments] = useState([]);

    const [loading, setLoading] = useState(true);

    const fetchShipments = async () => {

        try{

            const { data } = await api.get("/couriers");

            setShipments(data.couriers);

        }
        catch(error){

            console.log(error);

        }
        finally{

            setLoading(false);

        }

    };

    useEffect(()=>{

        const loadShipments = async () => {
            await fetchShipments();
        };

        void loadShipments();

    },[]);

    return(

        <AdminLayout>

            <div className="shipment-header">

                <h1>Shipments</h1>

                <button
                    onClick={()=>navigate("/admin/shipments/add")}
                >
                    + Create Shipment
                </button>

            </div>

            {

                loading

                ?

                <h3>Loading...</h3>

                :

                <table className="shipment-table">

                    <thead>

                        <tr>

                            <th>Tracking No</th>

                            <th>Sender</th>

                            <th>Receiver</th>

                            <th>Status</th>

                            <th>Partner</th>

                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            shipments.map((shipment)=>(

                                <tr key={shipment._id}>

                                    <td>{shipment.trackingNumber}</td>

                                    <td>{shipment.sender.name}</td>

                                    <td>{shipment.receiver.name}</td>

                                   <td>

<StatusBadge status={shipment.status}/>

</td>

                                    <td>

                                        {
                                            shipment.assignedPartner?.name
                                        }

                                    </td>

                                    <td>

                                        <button
  onClick={() =>
    navigate(`/admin/shipments/${shipment._id}`)
  }
>
  View
</button>

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            }

        </AdminLayout>

    );

};

export default ShipmentList;