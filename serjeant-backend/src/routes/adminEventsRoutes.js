// routes/adminEventsRoutes.js
import express from "express";
import {
  getAllEventsAdmin,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/admin/adminEventsController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authorize.js";
import { PERMISSIONS } from "../config/permissions.js";
import { logAction } from "../middleware/auditMiddleware.js";

const router = express.Router();

// GET all events (admin only) — NOW WITH PAGINATION
router.get(
  "/",
  protect,
  adminOnly,
  authorize(PERMISSIONS.MANAGE_EVENTS),
  logAction("view_all_events"),
  getAllEventsAdmin
);

// CREATE event
router.post(
  "/",
  protect,
  adminOnly,
  authorize(PERMISSIONS.MANAGE_EVENTS),
  logAction("create_event"),
  createEvent
);

// UPDATE event
router.put(
  "/:id",
  protect,
  adminOnly,
  authorize(PERMISSIONS.MANAGE_EVENTS),
  logAction("update_event"),
  updateEvent
);

// DELETE event
router.delete(
  "/:id",
  protect,
  adminOnly,
  authorize(PERMISSIONS.MANAGE_EVENTS),
  logAction("delete_event"),
  deleteEvent
);

export default router;
