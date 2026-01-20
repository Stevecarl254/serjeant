import express from "express";
import upload from "../utils/uploadFile.js";

import {
  addResource,
  getResources,
  deleteResource
} from "../controllers/adminResourceController.js";

const router = express.Router();

// Upload PDF or image → then create resource
router.post("/",
  upload.single("file"),
  addResource
);

// Get all resources
router.get("/", getResources);

// Delete
router.delete("/:id", deleteResource);

export default router;
