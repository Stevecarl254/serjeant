import express from "express";
import upload from "../utils/uploadImage.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { logAction } from "../middleware/auditMiddleware.js";
import {
  createCouncilMember,
  updateCouncilMember,
  deleteCouncilMember,
  toggleCouncilMember,
  getAllCouncil,
  reorderCouncil,
  getSecretary,
} from "../controllers/councilController.js";

const router = express.Router();

// Admin-only
router.get("/", protect, adminOnly, logAction("VIEW_ALL_COUNCIL"), getAllCouncil);
router.post(
  "/",
  protect,
  adminOnly,
  upload.single("photo"),
  logAction("CREATE_COUNCIL_MEMBER"),
  createCouncilMember
);
router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("photo"),
  logAction("UPDATE_COUNCIL_MEMBER"),
  updateCouncilMember
);
router.delete(
  "/:id",
  protect,
  adminOnly,
  logAction("DELETE_COUNCIL_MEMBER"),
  deleteCouncilMember
);
router.patch(
  "/:id/toggle",
  protect,
  adminOnly,
  logAction("TOGGLE_COUNCIL_MEMBER"),
  toggleCouncilMember
);
router.post(
  "/reorder",
  protect,
  adminOnly,
  logAction("REORDER_COUNCIL"),
  reorderCouncil
);

export default router;
