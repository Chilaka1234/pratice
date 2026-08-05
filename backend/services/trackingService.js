import Courier from "../models/Courier.js";

/**
 * Update shipment tracking
 */
export const updateShipmentTracking = async (
  shipmentId,
  data,
  userId
) => {

  const shipment = await Courier.findById(shipmentId);

  if (!shipment) {
    throw new Error("Shipment not found.");
  }

  shipment.status = data.status;

  shipment.currentLocation = data.location;

  shipment.history.push({
    status: data.status,
    location: data.location,
    remarks: data.remarks,
    updatedBy: userId,
    updatedAt: new Date(),
  });

  await shipment.save();

  return shipment;
};