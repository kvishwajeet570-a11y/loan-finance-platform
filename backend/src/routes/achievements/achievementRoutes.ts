import express from "express";

import {
getAchievements,
} from "../../controllers/achievement/achievement.controller";

const router = express.Router();

/* ========================================
ACHIEVEMENT ROUTES
======================================== */

router.get("/", getAchievements);

export default router;
