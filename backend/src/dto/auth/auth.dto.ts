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
  email: z.email(),

  otp: z
    .string()
    .regex(/^\d{6}$/, "OTP must be 6 digits"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password must not exceed 50 characters"),

  confirmPassword: z
    .string()
    .min(8, "Confirm password must be at least 8 characters")
    .max(50, "Confirm password must not exceed 50 characters"),
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
  currentPassword: z
    .string()
    .min(6, "Current password must be at least 6 characters"),

  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters")
    .max(50, "New password must not exceed 50 characters"),

  confirmPassword: z
    .string()
    .min(8, "Confirm password must be at least 8 characters")
    .max(50, "Confirm password must not exceed 50 characters"),
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
  refreshToken: z
    .string()
    .min(1, "Refresh token is required"),
});

/* =========================================
   LOGOUT
========================================= */

export const logoutSchema = z.object({
  refreshToken: z
    .string()
    .min(1, "Refresh token is required")
    .optional(),
});

/* =========================================
   VERIFY ACCOUNT
========================================= */

export const verifyAccountSchema = z.object({
  email: z.email("Invalid email address"),

  otp: z
    .string()
    .regex(/^\d{6}$/, "OTP must be 6 digits"),
});
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

