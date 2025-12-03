import Member from "../models/Member.js";

// Public: Register as a member
export const registerMember = async (req, res) => {
  try {
    const { fullName, email, phone, packageType } = req.body;

    // Basic validation
    if (!fullName || !email || !phone || !packageType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Normalize fields
    const pkg = packageType.toLowerCase() === "premium" ? "premium" : "standard";
    const normalizedEmail = email.toLowerCase();

    // Attempt to create member
    const member = await Member.create({
      fullName,
      email: normalizedEmail,
      phone,
      packageType: pkg,
      isActive: true,
      paymentConfirmed: false,
    });

    // Success response
    res.status(201).json({
      message: `🎉 Congratulations, ${member.fullName}! You have successfully registered for the ${pkg} membership.`,
      member: {
        id: member._id.toString(),
        fullName: member.fullName,
        email: member.email,
        phone: member.phone,
        packageType: member.packageType,
        isActive: member.isActive,
        paymentConfirmed: member.paymentConfirmed,
      },
    });
  } catch (error) {
    console.error("Error registering member:", error);

    // Handle duplicate key errors gracefully
    if (error.code === 11000) {
      return res.status(400).json({
        message: "A member with this email or phone already exists.",
        fields: error.keyValue,
      });
    }

    res.status(500).json({ message: "Server error", error: error.message });
  }
};
