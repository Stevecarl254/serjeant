import Member from "../models/Member.js";

// Get all members (admin)
export const getMembers = async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add a new member (admin)
export const addMember = async (req, res) => {
  try {
    const { fullName, email, phone, packageType } = req.body;

    const exists = await Member.findOne({ email });
    if (exists) return res.status(400).json({ message: "Member already exists" });

    const member = await Member.create({
      fullName,
      email,
      phone,
      packageType,
      createdBy: req.user._id,
    });

    res.status(201).json({ member });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get single member (optional)
export const getMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Member not found" });
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
