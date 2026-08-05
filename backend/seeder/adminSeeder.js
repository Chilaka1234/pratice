import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      email: "admin@courier.com",
    });

    if (existingAdmin) {
      console.log("⚠️ Admin already exists.");
      process.exit();
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    // Create admin
    await User.create({
      name: "System Admin",
      email: "admin@courier.com",
      phone: "9876543210",
      password: hashedPassword,
      role: "admin",
      assignedArea: "",
    });

    console.log("✅ Admin account created successfully!");
    console.log("------------------------------------");
    console.log("Email    : admin@courier.com");
    console.log("Password : Admin@123");
    console.log("------------------------------------");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();