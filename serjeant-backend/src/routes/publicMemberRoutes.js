import express from "express";
import { registerMember } from "../controllers/publicMemberController.js";

const router = express.Router();

// POST /api/members/register
router.post("/register", registerMember);

export default router;
