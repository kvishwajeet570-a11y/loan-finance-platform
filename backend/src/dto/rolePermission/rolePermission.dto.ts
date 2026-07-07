import { z } from "zod";

/* =========================================
   ROLE PERMISSION STATUS
========================================= */

export const rolePermissionStatusEnum =
  z.enum([
    "ACTIVE",
    "INACTIVE",
  ]);

/* =========================================
   ASSIGN PERMISSIONS TO ROLE
========================================= */

export const assignRolePermissionsSchema =
  z.object({
    roleId: z.string().cuid(),

    permissionIds: z.array(
      z.string().cuid()
    ).min(1),
  });

/* =========================================
   REMOVE ROLE PERMISSION
========================================= */

export const removeRolePermissionSchema =
  z.object({
    roleId:
      z.string().cuid(),

    permissionId:
      z.string().cuid(),
  });

/* =========================================
   BULK ASSIGN
========================================= */

export const bulkAssignRolePermissionsSchema =
  z.object({
    roleIds: z.array(
      z.string().cuid()
    ).min(1),

    permissionIds: z.array(
      z.string().cuid()
    ).min(1),
  });

/* =========================================
   COPY ROLE PERMISSIONS
========================================= */

export const copyRolePermissionsSchema =
  z.object({
    sourceRoleId:
      z.string().cuid(),

    targetRoleId:
      z.string().cuid(),
  });

/* =========================================
   UPDATE ROLE PERMISSION STATUS
========================================= */

export const updateRolePermissionStatusSchema =
  z.object({
    rolePermissionId:
      z.string().cuid(),

    status:
      rolePermissionStatusEnum,
  });

/* =========================================
   ROLE PERMISSION FILTER
========================================= */

export const rolePermissionFilterSchema =
  z.object({
    roleId:
      z.string()
      .cuid()
      .optional(),

    permissionId:
      z.string()
      .cuid()
      .optional(),

    status:
      rolePermissionStatusEnum
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
   ROLE ACCESS MATRIX
========================================= */

export const roleAccessMatrixSchema =
  z.object({
    roleId:
      z.string().cuid(),
  });

/* =========================================
   ROLE PERMISSION AUDIT
========================================= */

export const rolePermissionAuditSchema =
  z.object({
    roleId:
      z.string()
      .cuid()
      .optional(),

    startDate:
      z.string()
      .optional(),

    endDate:
      z.string()
      .optional(),
  });

/* =========================================
   TYPES
========================================= */

export type AssignRolePermissionsDto =
  z.infer<
    typeof assignRolePermissionsSchema
  >;

export type RemoveRolePermissionDto =
  z.infer<
    typeof removeRolePermissionSchema
  >;

export type BulkAssignRolePermissionsDto =
  z.infer<
    typeof bulkAssignRolePermissionsSchema
  >;

export type CopyRolePermissionsDto =
  z.infer<
    typeof copyRolePermissionsSchema
  >;

export type UpdateRolePermissionStatusDto =
  z.infer<
    typeof updateRolePermissionStatusSchema
  >;

export type RolePermissionFilterDto =
  z.infer<
    typeof rolePermissionFilterSchema
  >;

export type RoleAccessMatrixDto =
  z.infer<
    typeof roleAccessMatrixSchema
  >;

export type RolePermissionAuditDto =
  z.infer<
    typeof rolePermissionAuditSchema
  >;