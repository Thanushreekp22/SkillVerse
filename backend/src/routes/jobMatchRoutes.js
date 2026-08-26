import { Router } from "express";
import { getJobMatch } from "../controllers/jobMatchController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", authMiddleware, getJobMatch);

export default router;