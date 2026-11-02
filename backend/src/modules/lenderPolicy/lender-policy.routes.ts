import { Router } from "express";
import { listLenderPolicies } from "./lender-policy.controller";

const router = Router();

router.get("/", listLenderPolicies);

export default router;
