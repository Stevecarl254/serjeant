import mongoose from "mongoose";

const councilMemberSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    description: { type: String, default: "" },
    category: {
      type: String,
      enum: ["interim", "secretariat", "executive", "future"],
      default: "interim",
    },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    photoUrl: { type: String, default: null },
    isSecretary: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("CouncilMember", councilMemberSchema);
