import Courier from "../models/Courier.js";
import User from "../models/User.js";
import generateTrackingNumber from "../utils/generateTrackingNumber.js";

/**
 * Create Courier
 */
export const createCourier = async (data, adminId) => {
  const {
    sender,
    receiver,
    assignedPartner,
    expectedDeliveryDate,
  } = data;

  // Check Partner
  const partner = await User.findOne({
    _id: assignedPartner,
    role: "partner",
  });

  if (!partner) {
    throw new Error("Invalid courier partner selected.");
  }

  // Generate Tracking Number
  const trackingNumber = await generateTrackingNumber();

  // Create Courier
  const courier = await Courier.create({
    trackingNumber,

    sender,

    receiver,

    assignedPartner,

    expectedDeliveryDate,

    createdBy: adminId,

    status: "Created",

    currentLocation: sender.address,

    history: [
      {
        status: "Created",
        location: sender.address,
        remarks: "Shipment Created",
        updatedBy: adminId,
        updatedAt: new Date(),
      },
    ],
  });

  return await Courier.findById(courier._id)
    .populate("assignedPartner", "name email phone assignedArea")
    .populate("createdBy", "name email");
};

/**
 * Get All Couriers
 */
export const getAllCouriers = async () => {
  return await Courier.find()
    .populate("assignedPartner", "name phone assignedArea")
    .populate("createdBy", "name")
    .sort({ createdAt: -1 });
};

/**
 * Get Courier By Tracking Number
 */
export const getCourierByTrackingNumber = async (
  trackingNumber
) => {
  const courier = await Courier.findOne({
    trackingNumber: trackingNumber.toUpperCase(),
  })
    .populate("assignedPartner", "name phone")
    .populate("history.updatedBy", "name role");

  if (!courier) {
    throw new Error("Tracking Number Not Found");
  }

  return courier;
};

/**
 * Get Courier By ID
 */
export const getCourierById = async (id) => {
  const courier = await Courier.findById(id)
    .populate("assignedPartner", "name phone assignedArea")
    .populate("createdBy", "name")
    .populate("history.updatedBy", "name");

  if (!courier) {
    throw new Error("Courier Not Found");
  }

  return courier;
};

/**
 * Update Courier
 */
export const updateCourier = async (id, data) => {
  const courier = await Courier.findById(id);

  if (!courier) {
    throw new Error("Courier Not Found");
  }

  const partner = await User.findOne({
    _id: data.assignedPartner,
    role: "partner",
  });

  if (!partner) {
    throw new Error("Invalid courier partner selected.");
  }

  courier.sender = data.sender;
  courier.receiver = data.receiver;
  courier.assignedPartner = data.assignedPartner;
  courier.expectedDeliveryDate = data.expectedDeliveryDate;

  await courier.save();

  return await Courier.findById(id)
    .populate("assignedPartner", "name phone assignedArea")
    .populate("createdBy", "name");
};

/**
 * Get Shipments for a Partner
 */
export const getPartnerShipments = async (partnerId) => {
  return await Courier.find({
    assignedPartner: partnerId,
  })
    .populate("assignedPartner", "name phone assignedArea")
    .populate("createdBy", "name")
    .sort({ createdAt: -1 });
};

/**
 * Delete Courier
 */
export const deleteCourier = async (id) => {
  const courier = await Courier.findById(id);

  if (!courier) {
    throw new Error("Courier Not Found");
  }

  if (courier.status !== "Created") {
    throw new Error(
      "Only newly created shipments can be deleted."
    );
  }

  await Courier.findByIdAndDelete(id);

  return true;
};