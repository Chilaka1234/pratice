import {
    getNotifications,
    markAsRead
} from "../services/notificationService.js";

export const getNotificationsHandler=async(req,res)=>{

    try{

        const notifications=await getNotifications(req.user.id);

        res.json({

            success:true,

            notifications

        });

    }

    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};

export const markAsReadHandler=async(req,res)=>{

    try{

        const notification=await markAsRead(req.params.id);

        res.json({

            success:true,

            notification

        });

    }

    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};