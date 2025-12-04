import Member from "../models/Member.js";
import { generateMembershipNumber } from "../utils/generateMembershipNumber.js";

export const getMembers = async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addMember = async (req, res) => {
  try {
    const { fullName, email, phone, packageType } = req.body;

    const exists = await Member.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: `${exists.fullName} already exists` });
    }

    const membershipNumber = await generateMembershipNumber();

    const member = await Member.create({
      fullName,
      email: email.toLowerCase(),
      phone,
      packageType,
      membershipNumber,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: `${member.fullName} added successfully`,
      member,
    });

  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.membershipNumber) {
      return res.status(500).json({ message: "Membership number conflict. Try again." });
    }

    res.status(500).json({ message: "Server error", error: error.message });
  }
};
