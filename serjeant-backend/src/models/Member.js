import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    packageType: {
      type: String,
      enum: ["standard", "premium"],
      default: "standard",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    paymentConfirmed: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    membershipNumber: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Member", memberSchema);
