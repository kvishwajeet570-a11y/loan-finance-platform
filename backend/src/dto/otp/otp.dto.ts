import { z } from "zod";

/* =========================================
   OTP TYPE
========================================= */

export const otpTypeEnum = z.enum([
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

export const otpChannelEnum = z.enum([
  "SMS",
  "EMAIL",
  "WHATSAPP",
]);

/* =========================================
   OTP STATUS
========================================= */

export const otpStatusEnum = z.enum([
  "PENDING",
  "VERIFIED",
  "EXPIRED",
  "FAILED",
  "BLOCKED",
]);

/* =========================================
   SEND OTP
========================================= */

export const sendOtpSchema = z.object({
  phoneNo: z.string()
    .regex(/^[6-9]\d{9}$/)
    .optional(),

  email: z.string()
    .email()
    .optional(),

  type: otpTypeEnum,

  channel:
    otpChannelEnum,

  userId:
    z.string()
    .cuid()
    .optional(),
});

/* =========================================
   VERIFY OTP
========================================= */

export const verifyOtpSchema = z.object({
  otp: z.string()
    .length(6),

  phoneNo:
    z.string()
    .optional(),

  email:
    z.string()
    .email()
    .optional(),

  type:
    otpTypeEnum,
});

/* =========================================
   RESEND OTP
========================================= */

export const resendOtpSchema = z.object({
  phoneNo:
    z.string()
    .optional(),

  email:
    z.string()
    .email()
    .optional(),

  type:
    otpTypeEnum,
});

/* =========================================
   OTP FILTER
========================================= */

export const otpFilterSchema = z.object({
  userId:
    z.string()
    .cuid()
    .optional(),

  type:
    otpTypeEnum.optional(),

  status:
    otpStatusEnum.optional(),

  channel:
    otpChannelEnum.optional(),

  startDate:
    z.string().optional(),

  endDate:
    z.string().optional(),

  page:
    z.coerce.number()
    .default(1),

  limit:
    z.coerce.number()
    .min(1)
    .max(100)
    .default(20),
});

/* =========================================
   OTP ANALYTICS
========================================= */

export const otpAnalyticsSchema =
  z.object({
    startDate:
      z.string().optional(),

    endDate:
      z.string().optional(),

    channel:
      otpChannelEnum.optional(),
  });

/* =========================================
   BLOCK OTP REQUEST
========================================= */

export const blockOtpSchema =
  z.object({
    phoneNo:
      z.string().optional(),

    email:
      z.string()
      .email()
      .optional(),

    reason:
      z.string()
      .min(3)
      .max(500),
  });

/* =========================================
   TYPES
========================================= */

export type SendOtpDto =
  z.infer<typeof sendOtpSchema>;

export type VerifyOtpDto =
  z.infer<typeof verifyOtpSchema>;

export type ResendOtpDto =
  z.infer<typeof resendOtpSchema>;

export type OtpFilterDto =
  z.infer<typeof otpFilterSchema>;

export type OtpAnalyticsDto =
  z.infer<typeof otpAnalyticsSchema>;

export type BlockOtpDto =
  z.infer<typeof blockOtpSchema>;