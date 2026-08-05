import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminLayout from "../../layouts/AdminLayout";
import api from "../../services/api";

import "./AddShipment.css";

const AddShipment = () => {

    const navigate = useNavigate();

    const [partners, setPartners] = useState([]);

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

        const loadPartners = async () => {
            try{
                const {data}=await api.get("/users/partners");
                setPartners(data.partners);
            }
            catch(error){
                console.log(error);
            }
        };

        void loadPartners();

    },[]);

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

            await api.post("/couriers",formData);

            alert("Shipment Created Successfully");

            navigate("/admin/shipments");

        }

        catch(error){

            alert(error.response?.data?.message);

        }

    };

    return(

        <AdminLayout>

            <div className="add-shipment">

                <h1>Create Shipment</h1>

                <form onSubmit={handleSubmit}>

                    <h2>Sender Details</h2>

                    <input
                        name="sender.name"
                        placeholder="Sender Name"
                        onChange={handleChange}
                    />

                    <input
                        name="sender.phone"
                        placeholder="Sender Phone"
                        onChange={handleChange}
                    />

                    <textarea
                        name="sender.address"
                        placeholder="Sender Address"
                        onChange={handleChange}
                    />

                    <h2>Receiver Details</h2>

                    <input
                        name="receiver.name"
                        placeholder="Receiver Name"
                        onChange={handleChange}
                    />

                    <input
                        name="receiver.phone"
                        placeholder="Receiver Phone"
                        onChange={handleChange}
                    />

                    <textarea
                        name="receiver.address"
                        placeholder="Receiver Address"
                        onChange={handleChange}
                    />

                    <h2>Assign Courier Partner</h2>

                    <select
                        name="assignedPartner"
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

                    <h2>Expected Delivery Date</h2>

                    <input
                        type="date"
                        name="expectedDeliveryDate"
                        onChange={handleChange}
                    />

                    <button>

                        Create Shipment

                    </button>

                </form>

            </div>

        </AdminLayout>

    );

};

export default AddShipment;