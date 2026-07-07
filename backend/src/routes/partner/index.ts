import { Router } from "express";
import partnerRoutes from "./partner.route";

const router = Router();

router.use("/", partnerRoutes);

export default router;