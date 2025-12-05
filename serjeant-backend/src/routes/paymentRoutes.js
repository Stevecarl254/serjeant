import express from "express";
import { processPayment } from "../controllers/paymentController.js";

const router = express.Router();

// POST /api/payments/process
router.post("/process", processPayment);

export default router;
