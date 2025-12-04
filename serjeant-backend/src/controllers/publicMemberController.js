import Member from "../models/Member.js";
import { generateMembershipNumber } from "../utils/generateMembershipNumber.js";

export const registerMember = async (req, res) => {
  try {
    const { fullName, email, phone, packageType } = req.body;

    if (!fullName || !email || !phone || !packageType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const pkg = packageType.toLowerCase() === "premium" ? "premium" : "standard";
    const normalizedEmail = email.toLowerCase();

    const exists = await Member.findOne({ email: normalizedEmail });
    if (exists) {
      return res.status(400).json({ message: "A member with this email already exists." });
    }

    const membershipNumber = await generateMembershipNumber();

    const member = await Member.create({
      fullName,
      email: normalizedEmail,
      phone,
      packageType: pkg,
      membershipNumber,
      isActive: true,
      paymentConfirmed: false,
    });

    res.status(201).json({
	message: `🎉 Congratulations, ${member.fullName}. You are our newest member!}.`,
      member,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Duplicate entry.", fields: error.keyValue });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
