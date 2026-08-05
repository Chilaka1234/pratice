import express from "express";

import {
  createCourierHandler,
  getAllCouriersHandler,
  trackCourierHandler,
  getCourierByIdHandler,
  updateCourierHandler,
} from "../controllers/courierController.js";

import {
  authenticate,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * ==============================
 * Admin Routes
 * ==============================
 */

// Create Courier
router.post(
  "/",
  authenticate,
  authorize("admin"),
  createCourierHandler
);

// Get All Couriers
router.get(
  "/",
  authenticate,
  authorize("admin"),
  getAllCouriersHandler
);

// Track Courier
router.get(
  "/track/:trackingNumber",
  trackCourierHandler
);

// Get single courier by id
router.get(
  "/:id",
  authenticate,
  getCourierByIdHandler
);

// Update courier shipment
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  updateCourierHandler
);

export default router;