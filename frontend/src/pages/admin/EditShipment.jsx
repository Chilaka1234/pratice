import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AdminLayout from "../../layouts/AdminLayout";
import api from "../../services/api";

import "./EditShipment.css";

const EditShipment = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [partners, setPartners] = useState([]);

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({

        sender:{
            name:"",
            phone:"",
            address:""
        },

        receiver:{
            name:"",
            phone:"",
            address:""
        },

        assignedPartner:"",

        expectedDeliveryDate:""

    });

    useEffect(()=>{

        const loadData = async () => {
            try{
                const [{data: shipmentData},{data: partnersData}] = await Promise.all([
                    api.get(`/couriers/${id}`),
                    api.get("/users/partners"),
                ]);

                const shipment = shipmentData.courier;

                setFormData({
                    sender:shipment.sender,
                    receiver:shipment.receiver,
                    assignedPartner:shipment.assignedPartner?._id || "",
                    expectedDeliveryDate:
                        shipment.expectedDeliveryDate
                        ?.substring(0,10),
                });

                setPartners(partnersData.partners);
            }
            catch(error){
                console.log(error);
            }
        };

        void loadData();

    },[id]);

    const handleChange=(e)=>{

        const {name,value}=e.target;

        if(name.startsWith("sender.")){

            const field=name.split(".")[1];

            setFormData(prev=>({

                ...prev,

                sender:{

                    ...prev.sender,

                    [field]:value

                }

            }));

        }

        else if(name.startsWith("receiver.")){

            const field=name.split(".")[1];

            setFormData(prev=>({

                ...prev,

                receiver:{

                    ...prev.receiver,

                    [field]:value

                }

            }));

        }

        else{

            setFormData(prev=>({

                ...prev,

                [name]:value

            }));

        }

    };

    const handleSubmit=async(e)=>{

        e.preventDefault();

        try{

            setLoading(true);

            await api.put(`/couriers/${id}`,formData);

            alert("Shipment Updated Successfully");

            navigate("/admin/shipments");

        }

        catch(error){

            alert(error.response?.data?.message);

        }

        finally{

            setLoading(false);

        }

    };

    return(

        <AdminLayout>

            <div className="edit-shipment">

                <h1>Edit Shipment</h1>

                <form onSubmit={handleSubmit}>

                    <h2>Sender</h2>

                    <input
                        name="sender.name"
                        value={formData.sender.name}
                        onChange={handleChange}
                        placeholder="Sender Name"
                    />

                    <input
                        name="sender.phone"
                        value={formData.sender.phone}
                        onChange={handleChange}
                        placeholder="Sender Phone"
                    />

                    <textarea
                        name="sender.address"
                        value={formData.sender.address}
                        onChange={handleChange}
                        placeholder="Sender Address"
                    />

                    <h2>Receiver</h2>

                    <input
                        name="receiver.name"
                        value={formData.receiver.name}
                        onChange={handleChange}
                        placeholder="Receiver Name"
                    />

                    <input
                        name="receiver.phone"
                        value={formData.receiver.phone}
                        onChange={handleChange}
                        placeholder="Receiver Phone"
                    />

                    <textarea
                        name="receiver.address"
                        value={formData.receiver.address}
                        onChange={handleChange}
                        placeholder="Receiver Address"
                    />

                    <h2>Courier Partner</h2>

                    <select
                        name="assignedPartner"
                        value={formData.assignedPartner}
                        onChange={handleChange}
                    >

                        <option value="">
                            Select Partner
                        </option>

                        {

                            partners.map(partner=>(

                                <option
                                    key={partner._id}
                                    value={partner._id}
                                >

                                    {partner.name}

                                </option>

                            ))

                        }

                    </select>

                    <h2>Expected Delivery</h2>

                    <input
                        type="date"
                        name="expectedDeliveryDate"
                        value={formData.expectedDeliveryDate}
                        onChange={handleChange}
                    />

                    <button>

                        {

                            loading

                            ?

                            "Updating..."

                            :

                            "Update Shipment"

                        }

                    </button>

                </form>

            </div>

        </AdminLayout>

    );

};

export default EditShipment;