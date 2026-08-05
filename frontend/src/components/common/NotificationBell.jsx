import { useEffect, useRef, useState } from "react";
import api from "../../services/api";
import "./NotificationBell.css";

const NotificationBell = () => {

    const [notifications,setNotifications]=useState([]);

    const [open,setOpen]=useState(false);

    const dropdownRef=useRef();

    useEffect(()=>{

        const loadNotifications=async()=>{
            try{
                const {data}=await api.get("/notifications");
                setNotifications(data.notifications);
            }
            catch(error){
                console.log(error);
            }
        };

        void loadNotifications();

    },[]);

    useEffect(()=>{

        const close=(e)=>{

            if(
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ){

                setOpen(false);

            }

        };

        document.addEventListener("click",close);

        return()=>document.removeEventListener("click",close);

    },[]);

    const fetchNotifications=async()=>{

        try{

            const {data}=await api.get("/notifications");

            setNotifications(data.notifications);

        }

        catch(error){

            console.log(error);

        }

    };

    const unread=notifications.filter(

        n=>!n.isRead

    ).length;

    const markRead=async(id)=>{

        await api.put(`/notifications/${id}`);

        fetchNotifications();

    };

    return(

        <div
            className="notification-wrapper"
            ref={dropdownRef}
        >

            <button

                className="bell-btn"

                onClick={()=>setOpen(!open)}

            >

                🔔

                {

                    unread>0&&(

                        <span className="count">

                            {unread}

                        </span>

                    )

                }

            </button>

            {

                open&&(

                    <div className="notification-dropdown">

                        <h3>

                            Notifications

                        </h3>

                        {

                            notifications.length===0

                            ?

                            <p>No Notifications</p>

                            :

                            notifications.map(notification=>(

                                <div

                                    className={`notification-item ${notification.isRead?"":"unread"}`}

                                    key={notification._id}

                                    onClick={()=>markRead(notification._id)}

                                >

                                    <h4>

                                        {notification.title}

                                    </h4>

                                    <p>

                                        {notification.message}

                                    </p>

                                </div>

                            ))

                        }

                    </div>

                )

            }

        </div>

    );

};

export default NotificationBell;