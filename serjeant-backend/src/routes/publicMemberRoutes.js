import express from "express";
import { requestInspector } from "../middleware/requestInspector.js";
import {
  registerMember,
  getPublicMember,
  downloadCertificate,
} from "../controllers/publicMemberController.js";

const router = express.Router();

// apply request inspector to ALL member routes
router.use(requestInspector);

router.post("/register", registerMember);
router.get("/:id", getPublicMember);
router.get("/:memberId/certificate", downloadCertificate);

export default router;
