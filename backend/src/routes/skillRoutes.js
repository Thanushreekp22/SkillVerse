import { Router } from "express";
import {
  getMySkills,
  addSkill,
  updateSkill,
  deleteSkill,
  getSkillSuggestions,
} from "../controllers/skillController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getMySkills);
router.post("/", addSkill);
router.get("/suggestions", getSkillSuggestions);
router.put("/:id", updateSkill);
router.delete("/:id", deleteSkill);

export default router;