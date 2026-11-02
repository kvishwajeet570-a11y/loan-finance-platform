import { Router } from "express";
import authMiddleware from "../../middlewares/AuthMiddleware";
import { getAchievements } from "../../controllers/achievement/achievement.controller";

const router = Router();

router.use(authMiddleware);
router.get("/", getAchievements);

export default router;
