import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    location: { type: String, required: true },
    date: { type: Date, required: true },   // <-- changed to Date
    time: { type: String, required: true }, // keep as string (HH:mm)
    category: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Event", EventSchema);
