import { z } from "zod";

/* =========================================
   ASSIGN ROLE PERMISSIONS
========================================= */

export const assignRolePermissionsSchema = z.object({
  roleId: z.string().cuid(),

  permissionIds: z
    .array(z.string().cuid())
    .min(1, "At least one permission is required"),
});

/* =========================================
   REMOVE ROLE PERMISSION
========================================= */

export const removeRolePermissionSchema = z.object({
  roleId: z.string().cuid(),

  permissionId: z.string().cuid(),
});

/* =========================================
   BULK ASSIGN ROLE PERMISSIONS
========================================= */

export const bulkAssignRolePermissionsSchema = z.object({
  roleIds: z
    .array(z.string().cuid())
    .min(1, "At least one role is required"),

  permissionIds: z
    .array(z.string().cuid())
    .min(1, "At least one permission is required"),
});

/* =========================================
   COPY ROLE PERMISSIONS
========================================= */

export const copyRolePermissionsSchema = z.object({
  sourceRoleId: z.string().cuid(),

  targetRoleId: z.string().cuid(),
});

/* =========================================
   ROLE PERMISSION FILTER
========================================= */

export const rolePermissionFilterSchema = z.object({
  roleId: z.string().cuid().optional(),

  permissionId: z.string().cuid().optional(),

  page: z.coerce.number().min(1).default(1),

  limit: z.coerce.number().min(1).max(100).default(20),
});

/* =========================================
   ROLE ACCESS MATRIX
========================================= */

export const roleAccessMatrixSchema = z.object({
  roleId: z.string().cuid(),
});

/* =========================================
   ROLE PERMISSION AUDIT FILTER
========================================= */

export const rolePermissionAuditSchema = z.object({
  roleId: z.string().cuid().optional(),

  startDate: z.string().optional(),

  endDate: z.string().optional(),
});

/* =========================================
   TYPES
========================================= */

export type AssignRolePermissionsDto = z.infer<
  typeof assignRolePermissionsSchema
>;

export type RemoveRolePermissionDto = z.infer<
  typeof removeRolePermissionSchema
>;

export type BulkAssignRolePermissionsDto = z.infer<
  typeof bulkAssignRolePermissionsSchema
>;

export type CopyRolePermissionsDto = z.infer<
  typeof copyRolePermissionsSchema
>;

export type RolePermissionFilterDto = z.infer<
  typeof rolePermissionFilterSchema
>;

export type RoleAccessMatrixDto = z.infer<
  typeof roleAccessMatrixSchema
>;

export type RolePermissionAuditDto = z.infer<
  typeof rolePermissionAuditSchema
>;