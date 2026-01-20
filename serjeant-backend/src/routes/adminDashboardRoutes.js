import express from "express";
import { getDashboardStats, getRecentActivity } from "../controllers/adminDashboardController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, adminOnly, getDashboardStats);
router.get("/recent-activity", protect, adminOnly, getRecentActivity);

export default router;
