import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "General enquiry",
        "Education & scholarships",
        "Samuhik Vivah",
        "Women's skill training",
        "Volunteering",
        "Documentation & transparency",
        "Other",
      ],
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ["new", "in-progress", "resolved"],
      default: "new",
    },
    emailStatus: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },
    emailError: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Enquiry", enquirySchema);
