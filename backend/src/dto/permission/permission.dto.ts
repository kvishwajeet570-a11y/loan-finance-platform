import { z } from "zod";

/* =========================================
   PERMISSION MODULE
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
   PERMISSION ACTION
========================================= */

export const permissionActionEnum = z.enum([
  "CREATE",
  "READ",
  "UPDATE",
  "DELETE",
  "APPROVE",
  "REJECT",
  "EXPORT",
  "IMPORT",
  "ASSIGN",
  "VIEW_ALL",
  "MANAGE",
]);

/* =========================================
   PERMISSION STATUS
========================================= */

export const permissionStatusEnum = z.enum([
  "ACTIVE",
  "INACTIVE",
]);

/* =========================================
   CREATE PERMISSION
========================================= */

export const createPermissionSchema =
  z.object({
    name: z.string()
      .min(3)
      .max(100),

    code: z.string()
      .min(3)
      .max(100)
      .toUpperCase(),

    module:
      permissionModuleEnum,

    action:
      permissionActionEnum,

    description:
      z.string()
      .max(500)
      .optional(),

    status:
      permissionStatusEnum
      .default("ACTIVE"),
  });

/* =========================================
   UPDATE PERMISSION
========================================= */

export const updatePermissionSchema =
  z.object({
    name:
      z.string().optional(),

    module:
      permissionModuleEnum.optional(),

    action:
      permissionActionEnum.optional(),

    description:
      z.string().optional(),

    status:
      permissionStatusEnum.optional(),
  });

/* =========================================
   ASSIGN PERMISSION TO ROLE
========================================= */

export const assignPermissionSchema =
  z.object({
    roleId:
      z.string().cuid(),

    permissionIds:
      z.array(
        z.string().cuid()
      ).min(1),
  });

/* =========================================
   REMOVE PERMISSION
========================================= */

export const removePermissionSchema =
  z.object({
    roleId:
      z.string().cuid(),

    permissionId:
      z.string().cuid(),
  });

/* =========================================
   BULK PERMISSION ASSIGN
========================================= */

export const bulkAssignPermissionSchema =
  z.object({
    roleIds:
      z.array(
        z.string().cuid()
      ).min(1),

    permissionIds:
      z.array(
        z.string().cuid()
      ).min(1),
  });

/* =========================================
   PERMISSION FILTER
========================================= */

export const permissionFilterSchema =
  z.object({
    search:
      z.string().optional(),

    module:
      permissionModuleEnum.optional(),

    action:
      permissionActionEnum.optional(),

    status:
      permissionStatusEnum.optional(),

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
   ROLE PERMISSION MATRIX
========================================= */

export const rolePermissionMatrixSchema =
  z.object({
    roleId:
      z.string().cuid(),
  });

/* =========================================
   PERMISSION ANALYTICS
========================================= */

export const permissionAnalyticsSchema =
  z.object({
    startDate:
      z.string().optional(),

    endDate:
      z.string().optional(),
  });

/* =========================================
   TYPES
========================================= */

export type CreatePermissionDto =
  z.infer<typeof createPermissionSchema>;

export type UpdatePermissionDto =
  z.infer<typeof updatePermissionSchema>;

export type AssignPermissionDto =
  z.infer<typeof assignPermissionSchema>;

export type RemovePermissionDto =
  z.infer<typeof removePermissionSchema>;

export type BulkAssignPermissionDto =
  z.infer<
    typeof bulkAssignPermissionSchema
  >;

export type PermissionFilterDto =
  z.infer<
    typeof permissionFilterSchema
  >;

export type RolePermissionMatrixDto =
  z.infer<
    typeof rolePermissionMatrixSchema
  >;

export type PermissionAnalyticsDto =
  z.infer<
    typeof permissionAnalyticsSchema
  >;