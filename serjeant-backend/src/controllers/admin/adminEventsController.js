import Event from "../../models/Event.js";

// GET all events (admin)
export const getAllEventsAdmin = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    return res.json({ events });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch events" });
  }
};

// CREATE event
export const createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    return res.status(201).json({ event });
  } catch (err) {
    return res.status(400).json({ message: "Failed to create event" });
  }
};

// UPDATE event
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!event) return res.status(404).json({ message: "Event not found" });
    return res.json({ event });
  } catch (err) {
    return res.status(400).json({ message: "Failed to update event" });
  }
};

// DELETE event
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    return res.json({ message: "Deleted" });
  } catch (err) {
    return res.status(400).json({ message: "Failed to delete event" });
  }
};
