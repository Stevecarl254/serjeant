import Event from "../../models/Event.js";
import dayjs from "dayjs";

export const getEventsUnified = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const filter = { isActive: true };

    const total = await Event.countDocuments(filter);

    const events = await Event.find(filter)
      .sort({ date: 1 })
      .skip(skip)
      .limit(limit)
      .select("title description date time location image");

    // Format dates cleanly for frontend consumption
    const formatted = events.map((e) => ({
      _id: e._id,
      title: e.title,
      description: e.description,
      location: e.location,
      image: e.image,
      date: dayjs(e.date).format("MMM D, YYYY"),
      time: e.time,
    }));

    return res.json({
      events: formatted,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch {
    return res.status(500).json({
      message: "Failed to load events",
    });
  }
};
