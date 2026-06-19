"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const leaderboardController_1 = require("../controllers/leaderboardController");
const router = express_1.default.Router();
/* ========================================
   GET LEADERBOARD
======================================== */
router.get("/", leaderboardController_1.getLeaderboard);
/* ========================================
   HEALTH CHECK
======================================== */
router.get("/health", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Leaderboard route working successfully",
    });
});
exports.default = router;
