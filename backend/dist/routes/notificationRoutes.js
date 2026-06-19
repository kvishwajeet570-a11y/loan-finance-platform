"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notificationController_1 = require("../controllers/notificationController");
const router = express_1.default.Router();
/* ========================================
   GET NOTIFICATIONS
======================================== */
router.get("/", notificationController_1.getNotifications);
/* ========================================
   HEALTH CHECK
======================================== */
router.get("/health", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Notification route working successfully",
    });
});
exports.default = router;
