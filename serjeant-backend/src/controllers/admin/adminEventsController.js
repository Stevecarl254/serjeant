// controllers/admin/adminEventsController.js
import Event from "../../models/Event.js";

// GET paginated events (admin)
export const getAllEventsAdmin = async (req, res) => {
  try {
    // Query params with sensible defaults
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const totalEvents = await Event.countDocuments();
    const totalPages = Math.ceil(totalEvents / limit);

    const events = await Event.find()
      .sort({ createdAt: -1 }) // latest first
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      page,
      totalPages,
      totalEvents,
      limit,
      events,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch events", error: err.message });
  }
};

// CREATE event

// @desc Create a new event
// @route POST /api/admin/events
// @access Admin only
export const createEvent = async (req, res) => {
  try {
    const { title, description, location, date, time, category } = req.body;

    if (!title || !location || !date || !time) {
      return res.status(400).json({ message: "Title, location, date, and time are required" });
    }

    // Convert date string + time to JS Date object
    const dateTime = new Date(`${date}T${time}:00Z`);

    const newEvent = await Event.create({
      title,
      description,
      location,
      date: dateTime, // store as Date
      time,           // keep as string for display purposes
      category,
      isActive: true
    });

    return res.status(201).json(newEvent);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to create event" });
  }
};

// UPDATE event
export const updateEvent = async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ success: true, event: updated });
  } catch (err) {
    res.status(500).json({ message: "Failed to update event", error: err.message });
  }
};

// DELETE event
export const deleteEvent = async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ success: true, message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete event", error: err.message });
  }
};
