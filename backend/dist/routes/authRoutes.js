"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
/* ========================================
   SEND REGISTER OTP
======================================== */
router.post("/send-register-otp", authController_1.otpLimiter, authController_1.sendRegisterOtp);
/* ========================================
   VERIFY REGISTER OTP
======================================== */
router.post("/verify-register-otp", authController_1.verifyRegisterOtp);
/* ========================================
   REGISTER USER
======================================== */
router.post("/register", authController_1.registerUser);
/* ========================================
   LOGIN USER
======================================== */
router.post("/login", authController_1.loginUser);
/* ========================================
   FORGOT PASSWORD
======================================== */
router.post("/forgot-password", authController_1.forgotPassword);
/* ========================================
   RESET PASSWORD
======================================== */
router.post("/reset-password", authController_1.resetPassword);
/* ========================================
   DELETE ACCOUNT
======================================== */
router.delete("/delete-account/:id", authController_1.deleteAccount);
exports.default = router;
