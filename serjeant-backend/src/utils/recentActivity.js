import Member from "../models/Member.js";
import CouncilMember from "../models/CouncilMember.js";
import Event from "../models/Event.js";

// Persistent in-memory cache (could also be in DB or Redis if needed)
let activityCache = [];

export const fetchRecentActivity = async ({ type, limit = 20, skip = 0, months = 3 } = {}) => {
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - months);

  const fetchers = {
    Council: () =>
      CouncilMember.find({ createdAt: { $gte: cutoffDate } })
        .sort({ createdAt: -1 })
        .skip(Number(skip))
        .limit(Number(limit))
        .select("fullName createdAt")
        .lean()
        .then((data) => data.map((c) => ({ type: "Council", name: c.fullName, date: c.createdAt }))),

    Member: () =>
      Member.find({ createdAt: { $gte: cutoffDate } })
        .sort({ createdAt: -1 })
        .skip(Number(skip))
        .limit(Number(limit))
        .select("fullName createdAt")
        .lean()
        .then((data) => data.map((m) => ({ type: "Member", name: m.fullName, date: m.createdAt }))),

    Event: () =>
      Event.find({ createdAt: { $gte: cutoffDate } })
        .sort({ createdAt: -1 })
        .skip(Number(skip))
        .limit(Number(limit))
        .select("title createdAt")
        .lean()
        .then((data) => data.map((e) => ({ type: "Event", name: e.title, date: e.createdAt }))),
  };

  let newActivities = [];

  if (type && fetchers[type]) {
    newActivities = await fetchers[type]();
  } else {
    const results = await Promise.all([fetchers.Council(), fetchers.Member(), fetchers.Event()]);
    newActivities = results.flat().sort((a, b) => b.date - a.date);
  }

  // Merge new activities into cache, keeping newest first
  activityCache = [...newActivities, ...activityCache];

  // Trim only the oldest items to maintain the limit
  if (activityCache.length > limit) {
    activityCache = activityCache.slice(0, limit);
  }

  return activityCache;
};
