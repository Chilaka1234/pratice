import Courier from "../models/Courier.js";

export const searchShipments = async (keyword) => {
  if (!keyword || keyword.trim() === "") {
    return [];
  }

  return await Courier.find({
    $or: [
      {
        trackingNumber: {
          $regex: keyword,
          $options: "i",
        },
      },
      {
        "sender.name": {
          $regex: keyword,
          $options: "i",
        },
      },
      {
        "receiver.name": {
          $regex: keyword,
          $options: "i",
        },
      },
    ],
  }).populate("assignedPartner", "name");
};