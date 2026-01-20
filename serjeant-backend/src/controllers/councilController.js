import CouncilMember from "../models/CouncilMember.js";

/** Create Council Member */
export const createCouncilMember = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.photoUrl = `/uploads/images/${req.file.filename}`;

    // auto-set secretary
    data.isSecretary = data.role.toLowerCase().includes("secretar");

    // ensure only ONE secretary exists
    if (data.isSecretary) {
      await CouncilMember.updateMany({}, { isSecretary: false });
    }

    const member = await CouncilMember.create(data);
    res.status(201).json({ member });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/** Update Council Member */
export const updateCouncilMember = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) updates.photoUrl = `/uploads/images/${req.file.filename}`;

    // auto-set secretary based on role
    updates.isSecretary = updates.role?.toLowerCase().includes("secretar");

    if (updates.isSecretary) {
      await CouncilMember.updateMany({}, { isSecretary: false });
    }

    const updated = await CouncilMember.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Council member not found" });

    res.json({ member: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/** Delete Council Member */
export const deleteCouncilMember = async (req, res) => {
  try {
    const member = await CouncilMember.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ message: "Council member not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/** Toggle Active/Visibility */
export const toggleCouncilMember = async (req, res) => {
  try {
    const member = await CouncilMember.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Council member not found" });

    member.active = !member.active;
    await member.save();
    res.json({ member });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/** Get All Council Members (Admin) */
export const getAllCouncil = async (req, res) => {
  try {
    const council = await CouncilMember.find().sort({ order: 1 });
    res.json({ council });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/** Drag & Drop Reorder */
export const reorderCouncil = async (req, res) => {
  try {
    const updates = req.body; // array [{ id, order }]
    const ops = updates.map((m) =>
      CouncilMember.findByIdAndUpdate(m.id, { order: m.order })
    );
    await Promise.all(ops);
    res.json({ message: "Reordered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSecretary = async () => {
  return CouncilMember.findOne({ isSecretary: true });
};
