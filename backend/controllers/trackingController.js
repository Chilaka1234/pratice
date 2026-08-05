import { updateShipmentTracking } from "../services/trackingService.js";

/**
 * @desc Update Shipment Tracking
 * @route PUT /api/tracking/:courierId
 * @access Courier Partner
 */
export const updateTrackingHandler = async (req, res) => {
  try {
    const courier = await updateShipmentTracking(
      req.params.courierId,
      req.body,
      req.user._id
    );

    res.status(200).json({
      success: true,
      message: "Tracking updated successfully.",
      courier,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
