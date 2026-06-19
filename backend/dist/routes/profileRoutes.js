"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const profileController_1 = require("../controllers/profileController");
const router = express_1.default.Router();
/* ========================================
   GET USER PROFILE
======================================== */
router.get("/:userId", profileController_1.getUserProfile);
/* ========================================
   UPDATE PROFILE
======================================== */
router.put("/update/:userId", profileController_1.updateProfile);
/* ========================================
   DELETE PROFILE
======================================== */
router.delete("/delete/:userId", profileController_1.deleteProfile);
/* ========================================
   HEALTH CHECK
======================================== */
router.get("/health/check", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Profile route working successfully",
    });
});
exports.default = router;
