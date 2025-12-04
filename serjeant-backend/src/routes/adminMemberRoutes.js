import express from "express";
import { getMembers, addMember, getMember } from "../controllers/adminMemberController.js";
import { protect, adminOnly as admin } from "../middleware/authMiddleware.js"; // keep names as-is

const router = express.Router();

// Admin-only routes
router.get("/", protect, admin, getMembers);
router.post("/", protect, admin, addMember);

// Optional: Get one member
router.get("/:id", protect, admin, getMember);

export default router;
