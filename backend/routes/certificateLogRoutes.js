import express from "express";
import { adminAuth } from "../middleware/adminAuth.js";
import { createCertificateLog, listCertificateLogs } from "../controllers/certificateLogController.js";

const router = express.Router();

router.post("/", adminAuth, createCertificateLog);
router.get("/", adminAuth, listCertificateLogs);

export default router;
