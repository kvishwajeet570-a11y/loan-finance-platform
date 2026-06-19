import express from "express";

import {

  sendRegisterOtp,
  verifyRegisterOtp,
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  deleteAccount,
  otpLimiter,

} from "../controllers/authController";


const router =
  express.Router();


/* ========================================
   SEND REGISTER OTP
======================================== */

router.post(

  "/send-register-otp",

  otpLimiter,

  sendRegisterOtp

);


/* ========================================
   VERIFY REGISTER OTP
======================================== */

router.post(

  "/verify-register-otp",

  verifyRegisterOtp

);


/* ========================================
   REGISTER USER
======================================== */

router.post(

  "/register",

  registerUser

);


/* ========================================
   LOGIN USER
======================================== */

router.post(

  "/login",

  loginUser

);


/* ========================================
   FORGOT PASSWORD
======================================== */

router.post(

  "/forgot-password",

  forgotPassword

);


/* ========================================
   RESET PASSWORD
======================================== */

router.post(

  "/reset-password",

  resetPassword

);


/* ========================================
   DELETE ACCOUNT
======================================== */

router.delete(

  "/delete-account/:id",

  deleteAccount

);


export default router;