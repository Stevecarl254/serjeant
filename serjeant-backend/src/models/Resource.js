import mongoose from "mongoose";

const ResourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ["PDF", "Link"], required: true },
    category: { type: String, required: true },
    fileUrl: { type: String, required: true },
    description: { type: String }
  },
  { timestamps: true }
);

export default mongoose.models.Resource ||
  mongoose.model("Resource", ResourceSchema);
