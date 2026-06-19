"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const rechargeController_1 = require("../controllers/rechargeController");
const router = express_1.default.Router();
/* ========================================
   CREATE RECHARGE
======================================== */
router.post("/create", rechargeController_1.createRecharge);
/* ========================================
   GET USER RECHARGES
======================================== */
router.get("/:userId", rechargeController_1.getUserRecharges);
/* ========================================
   HEALTH CHECK
======================================== */
router.get("/health/check", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Recharge route working successfully",
    });
});
exports.default = router;
