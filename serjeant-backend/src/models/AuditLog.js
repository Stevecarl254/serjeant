import mongoose from "mongoose";

const auditSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // actions can be anonymous (login attempts)
    },
    action: { type: String, required: true }, // e.g., "login_success", "create_booking"
    meta: { type: Object, default: {} }, // extra context (ip, route, payload summary)
    ip: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("AuditLog", auditSchema);
