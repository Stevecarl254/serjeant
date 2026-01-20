import Member from "../models/Member.js";
import { generateCertificate } from "../utils/generateCertificate.js";

// -------- REGISTER MEMBER ----------
export const registerMember = async (req, res) => {
  try {
    const { fullName, email, phone, packageType } = req.body;

    console.log("registerMember() called with:", req.body);

    if (!fullName || !email || !phone || !packageType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const normalizedEmail = email.toLowerCase();
    const pkg = packageType.toLowerCase() === "premium" ? "premium" : "standard";

    const exists = await Member.findOne({ email: normalizedEmail });
    if (exists) {
      console.warn("Duplicate member registration attempt:", normalizedEmail);
      return res.status(400).json({ message: "A member with this email already exists." });
    }

    const member = await Member.create({
      fullName,
      email: normalizedEmail,
      phone,
      packageType: pkg,
      isActive: false,
      paymentConfirmed: false,
    });

    res.status(201).json({
      message: `🎉 Hi ${member.fullName}, please complete payment to activate membership.`,
      memberId: member._id,
    });
  } catch (err) {
    console.error("registerMember() error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// -------- GET PUBLIC MEMBER ----------
export const getPublicMember = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("getPublicMember() ID:", id);

    const member = await Member.findById(id).select("-__v");
    if (!member) {
      console.warn("Member not found:", id);
      return res.status(404).json({ message: "Member not found" });
    }

    let nextRenewal = null;
    if (member.lastPaymentDate) {
      const expiry = new Date(member.lastPaymentDate);
      expiry.setFullYear(expiry.getFullYear() + 1);
      nextRenewal = expiry;
    }

    res.json({ member: { ...member.toObject(), nextRenewal } });
  } catch (err) {
    console.error("getPublicMember() error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// -------- DOWNLOAD CERTIFICATE ----------
export const downloadCertificate = async (req, res) => {
  try {
    const { memberId } = req.params;
    console.log("downloadCertificate() memberId:", memberId);

    const member = await Member.findById(memberId);
    if (!member || !member.paymentConfirmed) {
      console.warn("Attempted certificate download without payment:", memberId);
      return res.status(403).json({ message: "Certificate unavailable." });
    }

    // Stream PDF
    await generateCertificate(member, res);
  } catch (err) {
    console.error("downloadCertificate() error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
