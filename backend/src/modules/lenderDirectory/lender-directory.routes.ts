import { Router } from "express";
import { getLenderDirectory } from "./lender-directory.controller";

const router = Router();

router.get("/directory", getLenderDirectory);

export default router;
