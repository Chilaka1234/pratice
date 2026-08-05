import express from "express";

import { getDashboardStatsHandler } from "../controllers/dashboardController.js";

import {
    authenticate,
    authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
    "/stats",
    authenticate,
    authorize("admin"),
    getDashboardStatsHandler
);

export default router;