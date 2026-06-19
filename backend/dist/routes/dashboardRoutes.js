"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dashboardController_1 = require("../controllers/dashboardController");
const router = express_1.default.Router();
/* ========================================
   GET DASHBOARD STATS
======================================== */
router.get("/", dashboardController_1.getDashboardStats);
/* ========================================
   DASHBOARD HEALTH CHECK
======================================== */
router.get("/health", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Dashboard route working successfully",
    });
});
exports.default = router;
