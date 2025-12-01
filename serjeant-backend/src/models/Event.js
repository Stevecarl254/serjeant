import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    location: { type: String, required: true },
    date: { type: String, required: true },   // ISO yyyy-mm-dd
    time: { type: String, required: true },   // "09:00", "18:30"
    category: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Event", EventSchema);
