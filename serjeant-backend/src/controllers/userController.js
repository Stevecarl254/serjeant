import User from "../models/User.js";
import { generateToken } from "../config/jwt.js";
import AuditLog from "../models/AuditLog.js";

// Register a new user
export const registerUser = async (req, res) => {
  const { fullName, email, phone, password } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already in use" });

    const phoneExists = await User.findOne({ phone });
    if (phoneExists)
      return res.status(400).json({ message: "Phone already in use" });

    const user = await User.create({
      fullName,
      email,
      phone,
      password,
    });

    res.status(201).json({
      message: "Registered successfully",
      token: generateToken(user._id, user.role),
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      // log failed login attempt (anonymous user)
      await AuditLog.create({
        action: "login_failed",
        meta: { reason: "no_user", email: email },
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const match = await user.matchPassword(password);
    if (!match) {
      await AuditLog.create({
        user: user._id,
        action: "login_failed",
        meta: { reason: "bad_password" },
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // successful login: clear Redis login attempts for this identifier
    try {
      const key = `rl:login:${email.toLowerCase()}`;
      await redisClient.del(key);
    } catch (e) {
      // ignore redis deletion error
    }

    await AuditLog.create({
      user: user._id,
      action: "login_success",
      meta: { ip: req.ip },
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.json({
      message: "Logged in",
      token: generateToken(user._id, user.role),
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("loginUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Logout
export const logoutUser = async (req, res) => {
  res.json({ message: "Logged out successfully" });
};
