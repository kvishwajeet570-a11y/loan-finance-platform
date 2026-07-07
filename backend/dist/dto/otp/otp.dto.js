"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockOtpSchema = exports.otpAnalyticsSchema = exports.otpFilterSchema = exports.resendOtpSchema = exports.verifyOtpSchema = exports.sendOtpSchema = exports.otpStatusEnum = exports.otpChannelEnum = exports.otpTypeEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   OTP TYPE
========================================= */
exports.otpTypeEnum = zod_1.z.enum([
    "REGISTER",
    "LOGIN",
    "FORGOT_PASSWORD",
    "RESET_PASSWORD",
    "PHONE_VERIFICATION",
    "EMAIL_VERIFICATION",
    "KYC_VERIFICATION",
    "LOAN_VERIFICATION",
    "TRANSACTION_VERIFICATION",
]);
/* =========================================
   OTP CHANNEL
========================================= */
exports.otpChannelEnum = zod_1.z.enum([
    "SMS",
    "EMAIL",
    "WHATSAPP",
]);
/* =========================================
   OTP STATUS
========================================= */
exports.otpStatusEnum = zod_1.z.enum([
    "PENDING",
    "VERIFIED",
    "EXPIRED",
    "FAILED",
    "BLOCKED",
]);
/* =========================================
   SEND OTP
========================================= */
exports.sendOtpSchema = zod_1.z.object({
    phoneNo: zod_1.z.string()
        .regex(/^[6-9]\d{9}$/)
        .optional(),
    email: zod_1.z.string()
        .email()
        .optional(),
    type: exports.otpTypeEnum,
    channel: exports.otpChannelEnum,
    userId: zod_1.z.string()
        .cuid()
        .optional(),
});
/* =========================================
   VERIFY OTP
========================================= */
exports.verifyOtpSchema = zod_1.z.object({
    otp: zod_1.z.string()
        .length(6),
    phoneNo: zod_1.z.string()
        .optional(),
    email: zod_1.z.string()
        .email()
        .optional(),
    type: exports.otpTypeEnum,
});
/* =========================================
   RESEND OTP
========================================= */
exports.resendOtpSchema = zod_1.z.object({
    phoneNo: zod_1.z.string()
        .optional(),
    email: zod_1.z.string()
        .email()
        .optional(),
    type: exports.otpTypeEnum,
});
/* =========================================
   OTP FILTER
========================================= */
exports.otpFilterSchema = zod_1.z.object({
    userId: zod_1.z.string()
        .cuid()
        .optional(),
    type: exports.otpTypeEnum.optional(),
    status: exports.otpStatusEnum.optional(),
    channel: exports.otpChannelEnum.optional(),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    page: zod_1.z.coerce.number()
        .default(1),
    limit: zod_1.z.coerce.number()
        .min(1)
        .max(100)
        .default(20),
});
/* =========================================
   OTP ANALYTICS
========================================= */
exports.otpAnalyticsSchema = zod_1.z.object({
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    channel: exports.otpChannelEnum.optional(),
});
/* =========================================
   BLOCK OTP REQUEST
========================================= */
exports.blockOtpSchema = zod_1.z.object({
    phoneNo: zod_1.z.string().optional(),
    email: zod_1.z.string()
        .email()
        .optional(),
    reason: zod_1.z.string()
        .min(3)
        .max(500),
});
