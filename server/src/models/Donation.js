
import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    donorName: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "Demo Donor",
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
      max: 10000000,
    },
    status: {
      type: String,
      enum: ["demo-success", "demo-pending", "demo-failed"],
      default: "demo-pending",
    },
    reference: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 100,
    },
    mode: {
      type: String,
      enum: ["demo"],
      default: "demo",
      immutable: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Donation", donationSchema);
