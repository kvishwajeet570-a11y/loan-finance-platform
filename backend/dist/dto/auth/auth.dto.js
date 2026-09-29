"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccountSchema = exports.logoutSchema = exports.refreshTokenSchema = exports.changePasswordSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.verifyOtpSchema = exports.sendOtpSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
/* =========================================
   REGISTER
========================================= */
exports.registerSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(3, "Name must be at least 3 characters")
        .max(100),
    email: zod_1.z
        .email("Invalid email address")
        .toLowerCase(),
    phoneNo: zod_1.z
        .string()
        .regex(/^[6-9]\d{9}$/, "Invalid mobile number"),
    password: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(50),
    role: zod_1.z.enum([
        "CUSTOMER",
        "DSA_AGENT",
        "PARTNER_USER",
    ]).default("CUSTOMER"),
});
/* =========================================
   LOGIN
========================================= */
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.email().optional(),
    phoneNo: zod_1.z
        .string()
        .regex(/^[6-9]\d{9}$/)
        .optional(),
    password: zod_1.z.string().min(6),
}).refine(data => data.email || data.phoneNo, {
    message: "Email or phone number is required",
});
/* =========================================
   SEND OTP
========================================= */
exports.sendOtpSchema = zod_1.z.object({
    phoneNo: zod_1.z
        .string()
        .regex(/^[6-9]\d{9}$/),
    purpose: zod_1.z.enum([
        "LOGIN",
        "REGISTER",
        "FORGOT_PASSWORD",
        "KYC_VERIFICATION",
    ]),
});
/* =========================================
   VERIFY OTP
========================================= */
exports.verifyOtpSchema = zod_1.z.object({
    phoneNo: zod_1.z
        .string()
        .regex(/^[6-9]\d{9}$/),
    otp: zod_1.z
        .string()
        .length(6, "OTP must be 6 digits"),
});
/* =========================================
   FORGOT PASSWORD
========================================= */
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.email(),
});
/* =========================================
   RESET PASSWORD
========================================= */
exports.resetPasswordSchema = zod_1.z.object({
    email: zod_1.z.email(),
    otp: zod_1.z
        .string()
        .regex(/^\d{6}$/, "OTP must be 6 digits"),
    password: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(50, "Password must not exceed 50 characters"),
    confirmPassword: zod_1.z
        .string()
        .min(8, "Confirm password must be at least 8 characters")
        .max(50, "Confirm password must not exceed 50 characters"),
}).refine(data => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
});
/* =========================================
   CHANGE PASSWORD
========================================= */
exports.changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z
        .string()
        .min(6, "Current password must be at least 6 characters"),
    newPassword: zod_1.z
        .string()
        .min(8, "New password must be at least 8 characters")
        .max(50, "New password must not exceed 50 characters"),
    confirmPassword: zod_1.z
        .string()
        .min(8, "Confirm password must be at least 8 characters")
        .max(50, "Confirm password must not exceed 50 characters"),
}).refine(data => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
});
/* =========================================
   REFRESH TOKEN
========================================= */
exports.refreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z
        .string()
        .min(1, "Refresh token is required"),
});
/* =========================================
   LOGOUT
========================================= */
exports.logoutSchema = zod_1.z.object({
    refreshToken: zod_1.z
        .string()
        .min(1, "Refresh token is required")
        .optional(),
});
/* =========================================
   VERIFY ACCOUNT
========================================= */
exports.verifyAccountSchema = zod_1.z.object({
    email: zod_1.z.email("Invalid email address"),
    otp: zod_1.z
        .string()
        .regex(/^\d{6}$/, "OTP must be 6 digits"),
});
