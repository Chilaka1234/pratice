import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    remarks: {
      type: String,
      default: "",
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const courierSchema = new mongoose.Schema(
  {
    trackingNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    sender: {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      phone: {
        type: String,
        required: true,
      },

      address: {
        type: String,
        required: true,
      },
    },

    receiver: {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      phone: {
        type: String,
        required: true,
      },

      address: {
        type: String,
        required: true,
      },
    },

    assignedPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: [
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
      ],
      default: "Created",
    },

    currentLocation: {
      type: String,
      default: "",
    },

    expectedDeliveryDate: {
      type: Date,
    },

    history: [historySchema],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Courier = mongoose.model("Courier", courierSchema);

export default Courier;