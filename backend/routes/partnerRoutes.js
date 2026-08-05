import express from "express";
import { getPartnerShipmentsHandler } from "../controllers/courierController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/shipments",
  authenticate,
  authorize("partner"),
  getPartnerShipmentsHandler
);

export default router;
