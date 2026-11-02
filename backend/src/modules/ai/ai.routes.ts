import { Router } from "express";
import rateLimit from "express-rate-limit";
import { marketingAssistant } from "./ai.controller";

const router = Router();

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many AI requests. Please wait before trying again."
  }
});

router.post("/marketing-assistant", aiLimiter, marketingAssistant);

export default router;