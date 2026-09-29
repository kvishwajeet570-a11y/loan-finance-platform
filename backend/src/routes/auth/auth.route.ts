import { Router } from "express";

import {
  sendRegisterOtp,
  verifyRegisterOtp,
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  deleteAccount,
} from "../../controllers/auth/auth.controller";

const router = Router();

router.post("/send-otp", sendRegisterOtp);

router.post("/verify-otp", verifyRegisterOtp);

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

router.delete("/delete-account/:id", deleteAccount);

export default router;
