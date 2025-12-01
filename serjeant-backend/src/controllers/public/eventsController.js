import Event from "../../models/Event.js";

// Member-facing: GET all active events
export const getActiveEvents = async (req, res) => {
  try {
    const events = await Event.find({ isActive: true }).sort({ date: 1 });
    return res.json({ events });
  } catch (err) {
    return res.status(500).json({ message: "Failed to load events" });
  }
};
