import { generateMembershipNumber } from "../utils/generateMembershipNumber.js";
import Member from "../models/Member.js";

// Mock M-Pesa payment endpoint
export const processPayment = async (req, res) => {
  try {
    const { memberId, phone, amount } = req.body;

    if (!memberId || !phone || !amount) {
      return res.status(400).json({ message: "Missing payment details" });
    }

    const member = await Member.findById(memberId);
    if (!member) return res.status(404).json({ message: "Member not found" });

    // Simulate successful payment
    const now = new Date();

    // Generate membership number
    const membershipNumber = await generateMembershipNumber();

    member.phone = phone;
    member.membershipNumber = membershipNumber;
    member.isActive = true;
    member.paymentConfirmed = true;

    if (!member.firstPaymentDate) member.firstPaymentDate = now;

    member.lastPaymentDate = now;

    const expiry = new Date(now);
    expiry.setFullYear(expiry.getFullYear() + 1);
    member.expiryDate = expiry;

    member.payments.push({
      amount,
      method: "M-Pesa",
      date: now,
      transactionId: "mock-" + Date.now(),
    });

    await member.save();

    res.status(201).json({
      message: "Payment successful! Membership activated.",
      member,
    });
  } catch (error) {
    console.error("processPayment() error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
