"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const referralController_1 = require("../controllers/referralController");
const router = express_1.default.Router();
/* ========================================
   CREATE REFERRAL
======================================== */
router.post("/create", referralController_1.createReferral);
/* ========================================
   GET REFERRAL
======================================== */
router.get("/:userId", referralController_1.getReferral);
/* ========================================
   APPLY REFERRAL CODE
======================================== */
router.post("/apply-code", referralController_1.applyReferralCode);
/* ========================================
   HEALTH CHECK
======================================== */
router.get("/health/check", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Referral route working successfully",
    });
});
exports.default = router;
