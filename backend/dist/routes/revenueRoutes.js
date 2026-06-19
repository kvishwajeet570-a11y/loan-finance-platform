"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const revenueController_1 = require("../controllers/revenueController");
const router = express_1.default.Router();
/* ========================================
   GET REVENUE ANALYTICS
======================================== */
router.get("/analytics", revenueController_1.getRevenueAnalytics);
/* ========================================
   GET MONTHLY REVENUE
======================================== */
router.get("/monthly", revenueController_1.getMonthlyRevenue);
/* ========================================
   HEALTH CHECK
======================================== */
router.get("/health/check", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Revenue route working successfully",
    });
});
exports.default = router;
