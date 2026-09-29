"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const revenue_controller_1 = require("../../controllers/revenue/revenue.controller");
// Optional (Uncomment if your project uses authentication)
// import { authenticate } from "../../middlewares/auth.middleware";
// import { authorize } from "../../middlewares/authorize.middleware";
const router = (0, express_1.Router)();
/* =========================================
   REVENUE ANALYTICS
========================================= */
// Dashboard Analytics
router.get("/analytics", 
// authenticate,
// authorize("SUPER_ADMIN", "ADMIN"),
revenue_controller_1.getRevenueAnalytics);
// Monthly Revenue
router.get("/monthly", 
// authenticate,
// authorize("SUPER_ADMIN", "ADMIN"),
revenue_controller_1.getMonthlyRevenue);
// Top Users
router.get("/top-users", 
// authenticate,
// authorize("SUPER_ADMIN", "ADMIN"),
revenue_controller_1.getTopUsers);
exports.default = router;
