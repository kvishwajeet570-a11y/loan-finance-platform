import { Router } from "express";

import adminRoutes from "./admin.route";

const router = Router();

/* ========================================
   ADMIN ROUTES
======================================== */

router.use("/", adminRoutes);

export default router;