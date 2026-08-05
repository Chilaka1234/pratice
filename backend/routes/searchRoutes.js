import express from "express";

import { searchShipmentsHandler } from "../controllers/searchController.js";

import {
  authenticate,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  searchShipmentsHandler
);

export default router;