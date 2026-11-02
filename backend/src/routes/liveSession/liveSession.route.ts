import { Router } from "express";
import authMiddleware from "../../middlewares/auth";
import adminMiddleware from "../../middlewares/admin";
import { createSession, listSessions, publishSession, registerForSession } from "../../controllers/liveSession/liveSession.controller";

const router = Router();

router.get("/", authMiddleware, listSessions);
router.get("/admin/all", authMiddleware, adminMiddleware, listSessions);
router.post("/admin", authMiddleware, adminMiddleware, createSession);
router.patch("/admin/:id/publish", authMiddleware, adminMiddleware, publishSession);
router.post("/:id/register", authMiddleware, registerForSession);

export default router;
