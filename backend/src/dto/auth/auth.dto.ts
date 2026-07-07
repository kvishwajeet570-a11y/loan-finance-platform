import { z } from "zod";

/* =========================================
   REGISTER
========================================= */

export const registerSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100),

  email: z
    .email("Invalid email address")
    .toLowerCase(),

  phoneNo: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid mobile number"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(50),

  role: z.enum([
    "CUSTOMER",
    "DSA_AGENT",
    "PARTNER_USER",
  ]).default("CUSTOMER"),
});

/* =========================================
   LOGIN
========================================= */

export const loginSchema = z.object({
  email: z.email().optional(),

  phoneNo: z
    .string()
    .regex(/^[6-9]\d{9}$/)
    .optional(),

  password: z.string().min(6),

}).refine(
  data => data.email || data.phoneNo,
  {
    message: "Email or phone number is required",
  }
);

/* =========================================
   SEND OTP
========================================= */

export const sendOtpSchema = z.object({
  phoneNo: z
    .string()
    .regex(/^[6-9]\d{9}$/),

  purpose: z.enum([
    "LOGIN",
    "REGISTER",
    "FORGOT_PASSWORD",
    "KYC_VERIFICATION",
  ]),
});

/* =========================================
   VERIFY OTP
========================================= */

export const verifyOtpSchema = z.object({
  phoneNo: z
    .string()
    .regex(/^[6-9]\d{9}$/),

  otp: z
    .string()
    .length(6, "OTP must be 6 digits"),
});

/* =========================================
   FORGOT PASSWORD
========================================= */

export const forgotPasswordSchema = z.object({
  email: z.email(),
});

/* =========================================
   RESET PASSWORD
========================================= */

export const resetPasswordSchema = z.object({
  token: z.string(),

  password: z
    .string()
    .min(8)
    .max(50),

  confirmPassword: z
    .string()
    .min(8)
    .max(50),

}).refine(
  data => data.password === data.confirmPassword,
  {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  }
);

/* =========================================
   CHANGE PASSWORD
========================================= */

export const changePasswordSchema = z.object({
  oldPassword: z.string(),

  newPassword: z
    .string()
    .min(8)
    .max(50),

  confirmPassword: z.string(),
}).refine(
  data => data.newPassword === data.confirmPassword,
  {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  }
);

/* =========================================
   REFRESH TOKEN
========================================= */

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(20),
});

/* =========================================
   LOGOUT
========================================= */

export const logoutSchema = z.object({
  refreshToken: z.string(),
});

/* =========================================
   ACCOUNT VERIFICATION
========================================= */

export const verifyAccountSchema = z.object({
  email: z.email(),

  otp: z
    .string()
    .length(6),
});

/* =========================================
   TYPES
========================================= */

export type RegisterDto =
  z.infer<typeof registerSchema>;

export type LoginDto =
  z.infer<typeof loginSchema>;

export type SendOtpDto =
  z.infer<typeof sendOtpSchema>;

export type VerifyOtpDto =
  z.infer<typeof verifyOtpSchema>;

export type ForgotPasswordDto =
  z.infer<typeof forgotPasswordSchema>;

export type ResetPasswordDto =
  z.infer<typeof resetPasswordSchema>;

export type ChangePasswordDto =
  z.infer<typeof changePasswordSchema>;

export type RefreshTokenDto =
  z.infer<typeof refreshTokenSchema>;

export type LogoutDto =
  z.infer<typeof logoutSchema>;

export type VerifyAccountDto =
  z.infer<typeof verifyAccountSchema>;