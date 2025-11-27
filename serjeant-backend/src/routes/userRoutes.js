import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/userController.js";
import { loginLimiter } from "../middleware/rateLimiter.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/login", loginLimiter, loginUser);

// Protected
router.post("/logout", protect, logoutUser);

// protected admin route
router.get("/admin/dashboard", protect, adminOnly, (req, res) => {
  res.json({ message: "Admin dashboard access granted" });
});

export default router;
