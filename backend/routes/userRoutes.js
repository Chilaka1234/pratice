import express from "express";

import {
  addPartner,
  getAllPartners,
  deletePartnerHandler,
  getPartnerByIdHandler,
  updatePartnerHandler,
  getProfileHandler,
  updateProfileHandler,
  changePasswordHandler,
} from "../controllers/userController.js";

import {
  authenticate,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Partner Management
 */

// Create Courier Partner
router.post(
  "/partners",
  authenticate,
  authorize("admin"),
  addPartner
);

// Get All Courier Partners
router.get(
  "/partners",
  authenticate,
  authorize("admin"),
  getAllPartners
);
router.get(
  "/partners/:id",
  authenticate,
  authorize("admin"),
  getPartnerByIdHandler
);
router.put(
  "/partners/:id",
  authenticate,
  authorize("admin"),
  updatePartnerHandler
);
router.delete(
  "/partners/:id",
  authenticate,
  authorize("admin"),
  deletePartnerHandler
);

router.get(
  "/profile",
  authenticate,
  getProfileHandler
);

router.put(
  "/profile",
  authenticate,
  updateProfileHandler
);

router.put(
  "/change-password",
  authenticate,
  changePasswordHandler
);

export default router;