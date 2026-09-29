import { z } from "zod";

/* =========================================
   MODULE ENUM
========================================= */

export const permissionModuleEnum = z.enum([
  "DASHBOARD",
  "USER",
  "CUSTOMER",
  "LOAN",
  "KYC",
  "DOCUMENT",
  "PAYMENT",
  "COMMISSION",
  "REFERRAL",
  "PARTNER",
  "DSA",
  "INSURANCE",
  "FASTAG",
  "INVESTMENT",
  "BLOG",
  "CMS",
  "MEDIA",
  "REPORT",
  "ANALYTICS",
  "NOTIFICATION",
  "SUPPORT",
  "SETTINGS",
  "ROLE",
  "PERMISSION",
  "ADMIN",
  "AUDIT",
]);

/* =========================================
   STATUS ENUM
========================================= */

export const permissionStatusEnum = z.enum([
  "ACTIVE",
  "INACTIVE",
]);

/* =========================================
   CREATE PERMISSION
========================================= */

export const createPermissionSchema = z.object({
  name: z.string().min(3).max(100),

  code: z.string().min(3).max(100),

  module: permissionModuleEnum,

  description: z.string().max(500).optional(),

  slug: z.string().optional(),

  status: permissionStatusEnum.optional(),
});

/* =========================================
   UPDATE PERMISSION
========================================= */

export const updatePermissionSchema = z.object({
  name: z.string().min(3).max(100).optional(),

  code: z.string().min(3).max(100).optional(),

  module: permissionModuleEnum.optional(),

  description: z.string().max(500).optional(),

  slug: z.string().optional(),

  status: permissionStatusEnum.optional(),
});

/* =========================================
   ASSIGN ROLE PERMISSION
========================================= */

export const assignPermissionToRoleSchema =
  z.object({
    role: z.string().min(1),

    permissionId: z.string().cuid(),
  });

/* =========================================
   ASSIGN USER PERMISSION
========================================= */

export const assignPermissionToUserSchema =
  z.object({
    userId: z.string().cuid(),

    permissionId: z.string().cuid(),
  });

/* =========================================
   BULK ASSIGN
========================================= */

export const bulkAssignPermissionSchema =
  z.object({
    role: z.string().min(1),

    permissionIds: z.array(
      z.string().cuid()
    ).min(1),
  });

/* =========================================
   FILTER
========================================= */

export const permissionFilterSchema =
  z.object({
    search: z.string().optional(),

    module:
      permissionModuleEnum.optional(),

    status:
      permissionStatusEnum.optional(),

    page:
      z.coerce.number().default(1),

    limit:
      z.coerce.number()
        .min(1)
        .max(100)
        .default(20),
  });

/* =========================================
   ANALYTICS
========================================= */

export const permissionAnalyticsSchema =
  z.object({
    startDate: z.string().optional(),

    endDate: z.string().optional(),
  });

/* =========================================
   TYPES
========================================= */

export type CreatePermissionDto =
  z.infer<typeof createPermissionSchema>;

export type UpdatePermissionDto =
  z.infer<typeof updatePermissionSchema>;

export type AssignPermissionToRoleDto =
  z.infer<typeof assignPermissionToRoleSchema>;

export type AssignPermissionToUserDto =
  z.infer<typeof assignPermissionToUserSchema>;

export type BulkAssignPermissionDto =
  z.infer<typeof bulkAssignPermissionSchema>;

export type PermissionFilterDto =
  z.infer<typeof permissionFilterSchema>;

export type PermissionAnalyticsDto =
  z.infer<typeof permissionAnalyticsSchema>;