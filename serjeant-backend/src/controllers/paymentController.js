import { generateMembershipNumber } from "../utils/generateMembershipNumber.js";
import Member from "../models/Member.js";

// Mock M-Pesa payment endpoint
export const processPayment = async (req, res) => {
  try {
    const { memberId, phone, amount } = req.body;

    // Minimal validation
    if (!memberId || !phone || !amount) {
      return res.status(400).json({ message: "Missing payment details" });
    }

    // Fetch the member record
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Simulate payment success (replace with real M-Pesa integration)
    const paymentConfirmed = true;

    if (!paymentConfirmed) {
      return res.status(402).json({ message: "Payment failed" });
    }

    // Generate membership number only now
    const membershipNumber = await generateMembershipNumber();

    // Update existing member record
    member.phone = phone; // update with M-Pesa number
    member.membershipNumber = membershipNumber;
    member.isActive = true;
    member.paymentConfirmed = true;

    await member.save();

    res.status(201).json({
      message: "Payment successful! Membership activated.",
      member,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
