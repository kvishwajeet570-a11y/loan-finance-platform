import { z } from "zod";

/* =========================================
   SUPER ADMIN ROLE
========================================= */

export const superAdminRoleEnum = z.enum([
  "SUPER_ADMIN",
  "ROOT_ADMIN",
  "PLATFORM_ADMIN",
]);

/* =========================================
   ADMIN STATUS
========================================= */

export const adminStatusEnum = z.enum([
  "ACTIVE",
  "INACTIVE",
  "BLOCKED",
  "SUSPENDED",
]);

/* =========================================
   MAINTENANCE MODE
========================================= */

export const maintenanceModeSchema =
  z.object({
    enabled: z.boolean(),

    title: z.string()
      .max(200)
      .optional(),

    message: z.string()
      .max(1000)
      .optional(),

    estimatedRestoreTime:
      z.string()
      .optional(),
  });

/* =========================================
   CREATE ADMIN
========================================= */

export const createAdminBySuperAdminSchema =
  z.object({
    name: z.string()
      .min(2)
      .max(100),

    email: z.string()
      .email(),

    phoneNo: z.string()
      .min(10)
      .max(15),

    password: z.string()
      .min(8),

    roleId: z.string()
      .cuid(),
  });

/* =========================================
   UPDATE ADMIN
========================================= */

export const updateAdminBySuperAdminSchema =
  z.object({
    adminId:
      z.string().cuid(),

    name:
      z.string()
      .min(2)
      .max(100)
      .optional(),

    email:
      z.string()
      .email()
      .optional(),

    phoneNo:
      z.string()
      .optional(),

    roleId:
      z.string()
      .cuid()
      .optional(),
  });

/* =========================================
   BLOCK ADMIN
========================================= */

export const blockAdminSchema =
  z.object({
    adminId:
      z.string().cuid(),

    reason:
      z.string()
      .min(3)
      .max(500),
  });

/* =========================================
   UNBLOCK ADMIN
========================================= */

export const unblockAdminSchema =
  z.object({
    adminId:
      z.string().cuid(),
  });

/* =========================================
   RESET ADMIN PASSWORD
========================================= */

export const resetAdminPasswordSchema =
  z.object({
    adminId:
      z.string().cuid(),

    newPassword:
      z.string()
      .min(8),
  });

/* =========================================
   ASSIGN ROLE
========================================= */

export const assignRoleToAdminSchema =
  z.object({
    adminId:
      z.string().cuid(),

    roleId:
      z.string().cuid(),
  });

/* =========================================
   GLOBAL SETTINGS UPDATE
========================================= */

export const updateGlobalSettingsSchema =
  z.object({
    settings: z.record(
      z.string(),
      z.any()
    ),
  });

/* =========================================
   SYSTEM ANNOUNCEMENT
========================================= */

export const systemAnnouncementSchema =
  z.object({
    title:
      z.string()
      .min(3)
      .max(200),

    message:
      z.string()
      .min(5)
      .max(5000),

    expiresAt:
      z.string()
      .optional(),
  });

/* =========================================
   PLATFORM FILTER
========================================= */

export const superAdminFilterSchema =
  z.object({
    startDate:
      z.string()
      .optional(),

    endDate:
      z.string()
      .optional(),

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
   EMERGENCY SYSTEM ACTION
========================================= */

export const emergencyActionSchema =
  z.object({
    action: z.enum([
      "DISABLE_LOGIN",
      "DISABLE_REGISTRATION",
      "DISABLE_LOAN_APPLICATION",
      "ENABLE_MAINTENANCE",
      "DISABLE_API_ACCESS",
    ]),

    reason:
      z.string()
      .min(5)
      .max(1000),
  });

/* =========================================
   PLATFORM ANALYTICS
========================================= */

export const platformAnalyticsSchema =
  z.object({
    startDate:
      z.string(),

    endDate:
      z.string(),
  });

/* =========================================
   TYPES
========================================= */

export type CreateAdminBySuperAdminDto =
  z.infer<
    typeof createAdminBySuperAdminSchema
  >;

export type UpdateAdminBySuperAdminDto =
  z.infer<
    typeof updateAdminBySuperAdminSchema
  >;

export type BlockAdminDto =
  z.infer<
    typeof blockAdminSchema
  >;

export type UnblockAdminDto =
  z.infer<
    typeof unblockAdminSchema
  >;

export type ResetAdminPasswordDto =
  z.infer<
    typeof resetAdminPasswordSchema
  >;

export type AssignRoleToAdminDto =
  z.infer<
    typeof assignRoleToAdminSchema
  >;

export type UpdateGlobalSettingsDto =
  z.infer<
    typeof updateGlobalSettingsSchema
  >;

export type MaintenanceModeDto =
  z.infer<
    typeof maintenanceModeSchema
  >;

export type SystemAnnouncementDto =
  z.infer<
    typeof systemAnnouncementSchema
  >;

export type EmergencyActionDto =
  z.infer<
    typeof emergencyActionSchema
  >;

export type PlatformAnalyticsDto =
  z.infer<
    typeof platformAnalyticsSchema
  >;

export type SuperAdminFilterDto =
  z.infer<
    typeof superAdminFilterSchema
  >;