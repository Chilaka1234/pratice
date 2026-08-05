import Notification from "../models/Notification.js";

export const createNotification = async (
    user,
    title,
    message,
    type="system"
)=>{

    return await Notification.create({

        user,

        title,

        message,

        type

    });

};

export const getNotifications=async(userId)=>{

    return await Notification.find({

        user:userId

    }).sort({

        createdAt:-1

    });

};

export const markAsRead=async(id)=>{

    return await Notification.findByIdAndUpdate(

        id,

        {

            isRead:true

        },

        {

            new:true

        }

    );

};