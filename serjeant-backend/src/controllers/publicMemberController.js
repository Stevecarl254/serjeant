import Member from "../models/Member.js";

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

    // Create member record without membership number (payment pending)
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
      memberId: member._id, // we’ll pass this to payment page
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Duplicate entry.", fields: error.keyValue });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
