import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authorize.js";
import { PERMISSIONS } from "../config/permissions.js";
import { logAction } from "../middleware/auditMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// simple admin dashboard summary
router.get(
  "/dashboard",
  protect,
  authorize(PERMISSIONS.VIEW_ADMIN_DASHBOARD),
  logAction("view_admin_dashboard"),
  async (req, res) => {
    try {
      const totalUsers = await User.countDocuments();
      const recentUsers = await User.find().sort({ createdAt: -1 }).limit(10).select("fullName email role createdAt");
      res.json({
        message: "Admin dashboard",
        stats: { totalUsers, recentUsers },
      });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
