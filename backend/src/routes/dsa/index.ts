import { Router } from "express";
import dsaRoutes from "./dsa.route";

const router = Router();

router.use("/", dsaRoutes);

export default router;