import express from "express";

import {

getNotificationsHandler,

markAsReadHandler

}

from "../controllers/notificationController.js";

import {

authenticate

}

from "../middleware/authMiddleware.js";

const router=express.Router();

router.get(

"/",

authenticate,

getNotificationsHandler

);

router.put(

"/:id",

authenticate,

markAsReadHandler

);

export default router;