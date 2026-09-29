import { z } from "zod";

/* =========================================
   ENUMS
========================================= */

export const roleSortByEnum = z.enum([
  "name",
  "code",
  "createdAt",
  "updatedAt",
]);

export const sortOrderEnum = z.enum(["asc", "desc"]);

/* =========================================
   CREATE ROLE
========================================= */

export const createRoleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Role name must be at least 2 characters")
    .max(100),

  code: z
    .string()
    .trim()
    .min(2)
    .max(50)
    .regex(/^[A-Z0-9_]+$/, {
      message: "Code must contain only uppercase letters, numbers and underscores",
    }),

  description: z
    .string()
    .trim()
    .max(500)
    .optional(),

  isActive: z.boolean().optional(),
});

/* =========================================
   UPDATE ROLE
========================================= */

export const updateRoleSchema = createRoleSchema.partial();

/* =========================================
   ROLE ID
========================================= */

export const roleIdSchema = z.object({
  id: z.string().cuid(),
});

/* =========================================
   ROLE FILTER
========================================= */

export const roleFilterSchema = z.object({
  search: z.string().optional(),

  isActive: z.coerce.boolean().optional(),

  page: z.coerce.number().min(1).default(1),

  limit: z.coerce.number().min(1).max(100).default(10),

  sortBy: roleSortByEnum.default("createdAt"),

  sortOrder: sortOrderEnum.default("desc"),
});

/* =========================================
   TYPES
========================================= */

export type CreateRoleDTO = z.infer<typeof createRoleSchema>;

export type UpdateRoleDTO = z.infer<typeof updateRoleSchema>;

export type RoleIdDTO = z.infer<typeof roleIdSchema>;

export type RoleFilterDTO = z.infer<typeof roleFilterSchema>;