import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import courierRoutes from "./routes/courierRoutes.js";
import trackingRoutes from "./routes/trackingRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import partnerRoutes from "./routes/partnerRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";

import authRoutes from "./routes/authRoutes.js";

// Load environment variables early so CORS and other config can use them
dotenv.config();

const app = express();

// Build allowed origins list from env (comma-separated) and always allow localhost during development
const defaultAllowed = ["http://localhost:5173"];
const envOrigins = process.env.FRONTEND_URLS || process.env.CLIENT_URLS || process.env.FRONTEND_URL || process.env.CLIENT_URL || "";
const extraOrigins = envOrigins
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const allowedOrigins = Array.from(new Set([...defaultAllowed, ...extraOrigins]));

const corsOptions = {
  origin: function (origin, callback) {
    // Allow non-browser clients (curl, server-to-server) which have no origin
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error("CORS policy: This origin is not allowed"));
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  preflightContinue: false,
};

app.use(cors(corsOptions));
// Ensure OPTIONS preflight requests are handled
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Courier Tracking API Running...",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/couriers", courierRoutes);
app.use("/api/tracking", trackingRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/partner", partnerRoutes);
app.use("/api/search", searchRoutes);

export default app;