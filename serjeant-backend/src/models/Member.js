import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },

    packageType: { type: String, enum: ["standard", "premium"], default: "standard" },

    isActive: { type: Boolean, default: false },
    paymentConfirmed: { type: Boolean, default: false },

    firstPaymentDate: { type: Date }, // First-ever payment
    lastPaymentDate: { type: Date },  // Most recent payment
    expiryDate: { type: Date },       // lastPaymentDate + 1 year

    payments: [
      {
        amount: Number,
        method: String, // mpesa, visa, paypal, etc
        date: Date,
        transactionId: String,
      }
    ],

    membershipNumber: String,
  },
  { timestamps: true }
);

export default mongoose.model("Member", memberSchema);
