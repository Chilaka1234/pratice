import { searchShipments } from "../services/searchService.js";

export const searchShipmentsHandler = async (req, res) => {
  try {
    const results = await searchShipments(req.query.keyword);

    res.json({
      success: true,
      results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};