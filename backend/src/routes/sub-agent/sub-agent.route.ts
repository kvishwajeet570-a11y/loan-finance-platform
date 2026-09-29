import { Router } from "express";

import {
  createSubAgent,
  getSubAgents,
} from "../../controllers/sub-agent/sub-agent.controller";

const router = Router();

router.post("/", createSubAgent);

router.get("/dsa/:dsaId", getSubAgents);

export default router;
