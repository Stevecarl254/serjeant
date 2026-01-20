import Member from "../models/Member.js";
import CouncilMember from "../models/CouncilMember.js";
import Event from "../models/Event.js";
import { fetchRecentActivity } from "../utils/recentActivity.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [totalMembers, totalCouncils, totalEvents] = await Promise.all([
      Member.countDocuments(),
      CouncilMember.countDocuments(),
      Event.countDocuments(),
    ]);

    // Fetch last 7 items for dashboard
    const recentActivity = await fetchRecentActivity({ limit: 7 });

    res.status(200).json({
      success: true,
      data: { members: totalMembers, councils: totalCouncils, events: totalEvents, recentActivity },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getRecentActivity = async (req, res) => {
  try {
    const { type, limit = 20, skip = 0 } = req.query;
    const activities = await fetchRecentActivity({ type, limit, skip });
    res.status(200).json({ success: true, data: activities });
  } catch (err) {
    console.error("Error fetching recent activity:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
