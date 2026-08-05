import express from "express";

import { updateTrackingHandler } from "../controllers/trackingController.js";

import {
  authenticate,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Update shipment tracking
 * Only courier partners can update
 */
router.put(
  "/:courierId",
  authenticate,
 authorize("partner"),
  updateTrackingHandler
);

export default router;