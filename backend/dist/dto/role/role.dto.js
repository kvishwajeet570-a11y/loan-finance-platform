"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleFilterSchema = exports.roleIdSchema = exports.updateRoleSchema = exports.createRoleSchema = exports.sortOrderEnum = exports.roleSortByEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   ENUMS
========================================= */
exports.roleSortByEnum = zod_1.z.enum([
    "name",
    "code",
    "createdAt",
    "updatedAt",
]);
exports.sortOrderEnum = zod_1.z.enum(["asc", "desc"]);
/* =========================================
   CREATE ROLE
========================================= */
exports.createRoleSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .trim()
        .min(2, "Role name must be at least 2 characters")
        .max(100),
    code: zod_1.z
        .string()
        .trim()
        .min(2)
        .max(50)
        .regex(/^[A-Z0-9_]+$/, {
        message: "Code must contain only uppercase letters, numbers and underscores",
    }),
    description: zod_1.z
        .string()
        .trim()
        .max(500)
        .optional(),
    isActive: zod_1.z.boolean().optional(),
});
/* =========================================
   UPDATE ROLE
========================================= */
exports.updateRoleSchema = exports.createRoleSchema.partial();
/* =========================================
   ROLE ID
========================================= */
exports.roleIdSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
});
/* =========================================
   ROLE FILTER
========================================= */
exports.roleFilterSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    isActive: zod_1.z.coerce.boolean().optional(),
    page: zod_1.z.coerce.number().min(1).default(1),
    limit: zod_1.z.coerce.number().min(1).max(100).default(10),
    sortBy: exports.roleSortByEnum.default("createdAt"),
    sortOrder: exports.sortOrderEnum.default("desc"),
});
