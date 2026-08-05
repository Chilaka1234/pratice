import Courier from "../models/Courier.js";

const statusLabels = [
  "Created",
  "Picked Up",
  "At Origin Hub",
  "In Transit",
  "Arrived At Destination Hub",
  "Out For Delivery",
  "Delivered",
  "Delivery Attempt Failed",
  "Customer Unavailable",
  "Returned To Sender",
  "Cancelled",
];

export const getDashboardStats = async () => {
  const totalShipments = await Courier.countDocuments();

  const delivered = await Courier.countDocuments({
    status: "Delivered",
  });

  const inTransit = await Courier.countDocuments({
    status: "In Transit",
  });

  const outForDelivery = await Courier.countDocuments({
    status: "Out For Delivery",
  });

  const pending = await Courier.countDocuments({
    status: {
      $nin: ["Delivered"],
    },
  });

  const partnersIds = await Courier.distinct("assignedPartner", {
    assignedPartner: { $ne: null },
  });

  const partners = partnersIds.length;

  const recentShipments = await Courier.find()
    .populate("assignedPartner", "name")
    .sort({ createdAt: -1 })
    .limit(5);

  const statusAggregation = await Courier.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const statusCounts = statusLabels.map((status) => {
    const record = statusAggregation.find((item) => item._id === status);
    return {
      status,
      count: record ? record.count : 0,
    };
  });

  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1, 0, 0, 0, 0);

  const monthlyAggregation = await Courier.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        totalShipments: { $sum: 1 },
        delivered: {
          $sum: {
            $cond: [{ $eq: ["$status", "Delivered"] }, 1, 0],
          },
        },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
  ]);

  const monthlyLabels = [];
  const monthlyShipments = [];
  const monthlyDelivered = [];

  for (let index = 0; index < 6; index += 1) {
    const date = new Date(startDate.getFullYear(), startDate.getMonth() + index, 1);
    const label = date.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });

    const bucket = monthlyAggregation.find(
      (item) =>
        item._id.year === date.getFullYear() && item._id.month === date.getMonth() + 1
    );

    monthlyLabels.push(label);
    monthlyShipments.push(bucket?.totalShipments ?? 0);
    monthlyDelivered.push(bucket?.delivered ?? 0);
  }

  const partnerPerformanceAggregation = await Courier.aggregate([
    {
      $match: {
        assignedPartner: { $ne: null },
      },
    },
    {
      $group: {
        _id: "$assignedPartner",
        totalShipments: { $sum: 1 },
        delivered: {
          $sum: {
            $cond: [{ $eq: ["$status", "Delivered"] }, 1, 0],
          },
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "partner",
      },
    },
    {
      $unwind: {
        path: "$partner",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        name: { $ifNull: ["$partner.name", "Unknown Partner"] },
        totalShipments: 1,
        delivered: 1,
      },
    },
    {
      $sort: {
        delivered: -1,
        totalShipments: -1,
      },
    },
    {
      $limit: 5,
    },
  ]);

  const partnerPerformance = partnerPerformanceAggregation.map((item) => ({
    name: item.name,
    totalShipments: item.totalShipments,
    delivered: item.delivered,
  }));

  return {
    totalShipments,
    delivered,
    inTransit,
    outForDelivery,
    pending,
    partners,
    recentShipments,
    statusCounts,
    monthlyChart: {
      labels: monthlyLabels,
      shipments: monthlyShipments,
      delivered: monthlyDelivered,
    },
    partnerPerformance,
  };
};