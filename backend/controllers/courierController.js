import {
  createCourier,
  getAllCouriers,
  getCourierByTrackingNumber,
  getCourierById,
  updateCourier,
  getPartnerShipments,
} from "../services/courierService.js";

/**
 * @desc Create Courier
 * @route POST /api/couriers
 * @access Admin
 */
export const createCourierHandler = async (req, res) => {
  try {
    const courier = await createCourier(req.body, req.user._id);

    res.status(201).json({
      success: true,
      message: "Courier created successfully.",
      courier,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Get Courier by ID
 * @route GET /api/couriers/:id
 * @access Admin
 */
export const getCourierByIdHandler = async (req, res) => {
  try {
    const courier = await getCourierById(req.params.id);

    if (req.user.role === "partner") {
      if (!courier.assignedPartner || courier.assignedPartner._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to view this shipment.",
        });
      }
    }

    res.status(200).json({
      success: true,
      courier,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Update Courier
 * @route PUT /api/couriers/:id
 * @access Admin
 */
export const updateCourierHandler = async (req, res) => {
  try {
    const courier = await updateCourier(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Shipment updated successfully.",
      courier,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Get current partner shipments
 * @route GET /api/partner/shipments
 * @access Partner
 */
export const getPartnerShipmentsHandler = async (req, res) => {
  try {
    const shipments = await getPartnerShipments(req.user._id);

    res.status(200).json({
      success: true,
      shipments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Get All Couriers
 * @route GET /api/couriers
 * @access Admin
 */
export const getAllCouriersHandler = async (req, res) => {
  try {
    const couriers = await getAllCouriers();

    res.status(200).json({
      success: true,
      count: couriers.length,
      couriers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Track Courier
 * @route GET /api/couriers/track/:trackingNumber
 * @access Public
 */
export const trackCourierHandler = async (req, res) => {
  try {
    const courier = await getCourierByTrackingNumber(
      req.params.trackingNumber
    );

    res.status(200).json({
      success: true,
      courier,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};