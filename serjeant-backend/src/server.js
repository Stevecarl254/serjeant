import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import connectDB from "./config/db.js";
import { connectRedis } from "./config/redis.js";

import userRoutes from "./routes/userRoutes.js"
import adminRoutes from "./routes/adminRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
import adminEventsRoutes from "./routes/adminEventsRoutes.js";
import eventsRoutes from "./routes/eventsRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();

    const app = express();

    const corsOptions = {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    };
    app.use(cors());

    app.use(express.json());

    // Static files
    app.use(
      "/uploads",
      express.static(path.join(__dirname, "uploads"), {
        setHeaders: (res) => {
          res.setHeader("Cache-Control", "public, max-age=31536000");
        },
      })
    );

    // API Routes
    app.use("/api/users", userRoutes);
    app.use("/api/admin", adminRoutes);
    app.use("/api/members", memberRoutes);
    app.use("/api/admin/events", adminEventsRoutes);
    app.use("/api/events", eventsRoutes);

    // Not found handler
    app.use((req, res) => {
      res.status(404).json({ message: "Route not found" });
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();
