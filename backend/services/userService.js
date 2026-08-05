import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Courier from "../models/Courier.js";
/**
 * Create a new courier partner
 */
export const createPartner = async (data) => {
  const { name, email, phone, password, assignedArea } = data;

  // Check if email already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("Email already exists.");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create partner
  const partner = await User.create({
    name,
    email,
    phone,
    password: hashedPassword,
    role: "partner",
    assignedArea,
    isActive: true,
  });

  return partner;
};

export const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new Error("User not found.");
  }

  const profile = user.toObject();

  if (profile.role === "partner") {
    const totalAssigned = await Courier.countDocuments({
      assignedPartner: userId,
    });

    const completed = await Courier.countDocuments({
      assignedPartner: userId,
      status: "Delivered",
    });

    const pending = await Courier.countDocuments({
      assignedPartner: userId,
      status: { $ne: "Delivered" },
    });

    return {
      user: profile,
      totalAssigned,
      completed,
      pending,
    };
  }

  return {
    user: profile,
  };
};

export const updateUserProfile = async (userId, data) => {
  const updates = {
    name: data.name,
    phone: data.phone,
  };

  if (data.assignedArea !== undefined && data.assignedArea !== null) {
    updates.assignedArea = data.assignedArea;
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    updates,
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");

  if (!updatedUser) {
    throw new Error("User not found.");
  }

  return updatedUser;
};

export const changeUserPassword = async (
  userId,
  currentPassword,
  newPassword
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    throw new Error("Current password is incorrect.");
  }

  if (!newPassword || newPassword.length < 6) {
    throw new Error("New password must be at least 6 characters long.");
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  return true;
};

/**
 * Get all courier partners
 */
export const getPartners = async () => {
  return await User.find({ role: "partner" }).select("-password");
};

export const getPartnerById = async (partnerId) => {
  const partner = await User.findById(partnerId).select("-password");

  if (!partner || partner.role !== "partner") {
    throw new Error("Partner not found.");
  }

  return partner;
};

export const updatePartner = async (partnerId, data) => {
  const updates = {
    name: data.name,
    phone: data.phone,
    assignedArea: data.assignedArea,
  };

  if (data.isActive !== undefined) {
    updates.isActive = data.isActive;
  }

  const updatedPartner = await User.findByIdAndUpdate(
    partnerId,
    updates,
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");

  if (!updatedPartner) {
    throw new Error("Partner not found.");
  }

  return updatedPartner;
};

export const deletePartner = async (partnerId) => {
  const partner = await User.findById(partnerId);

  if (!partner) {
    throw new Error("Partner not found.");
  }

  const activeShipments = await Courier.countDocuments({
    assignedPartner: partnerId,
    status: { $ne: "Delivered" },
  });

  if (activeShipments > 0) {
    throw new Error(
      `This courier partner has ${activeShipments} active shipment(s). Please reassign or complete them before deleting.`
    );
  }

  await User.findByIdAndDelete(partnerId);

  return true;
};