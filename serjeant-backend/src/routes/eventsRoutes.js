import express from "express";
import { getEventsUnified } from "../controllers/public/eventsController.js";
import { logAction } from "../middleware/auditMiddleware.js";

const router = express.Router();

/* Single production endpoint */
router.get("/", logAction("view_events"), getEventsUnified);

export default router;
