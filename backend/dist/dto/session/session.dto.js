"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupSessionSchema = exports.sessionQuerySchema = exports.userSessionSchema = exports.sessionIdSchema = exports.updateSessionSchema = exports.createSessionSchema = exports.sessionStatusSchema = void 0;
const zod_1 = require("zod");
/* ==========================================================
   COMMON ENUMS
========================================================== */
exports.sessionStatusSchema = zod_1.z.enum([
    "ACTIVE",
    "INACTIVE",
]);
/* ==========================================================
   CREATE SESSION
========================================================== */
exports.createSessionSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid("Invalid User ID"),
    token: zod_1.z
        .string()
        .min(32, "Token is too short")
        .max(500),
    ipAddress: zod_1.z
        .string()
        .max(100)
        .optional(),
    userAgent: zod_1.z
        .string()
        .max(1000)
        .optional(),
    isActive: zod_1.z
        .boolean()
        .default(true)
        .optional(),
    expiresAt: zod_1.z.coerce.date(),
});
/* ==========================================================
   UPDATE SESSION
========================================================== */
exports.updateSessionSchema = zod_1.z.object({
    token: zod_1.z
        .string()
        .min(32)
        .max(500)
        .optional(),
    ipAddress: zod_1.z
        .string()
        .max(100)
        .optional(),
    userAgent: zod_1.z
        .string()
        .max(1000)
        .optional(),
    isActive: zod_1.z
        .boolean()
        .optional(),
    logoutAt: zod_1.z
        .coerce
        .date()
        .optional(),
    expiresAt: zod_1.z
        .coerce
        .date()
        .optional(),
});
/* ==========================================================
   SESSION ID PARAM
========================================================== */
exports.sessionIdSchema = zod_1.z.object({
    id: zod_1.z.string().cuid("Invalid Session ID"),
});
/* ==========================================================
   USER SESSION PARAM
========================================================== */
exports.userSessionSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid("Invalid User ID"),
});
/* ==========================================================
   SESSION QUERY
========================================================== */
exports.sessionQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().min(1).default(1).optional(),
    limit: zod_1.z.coerce.number().min(1).max(100).default(20).optional(),
    search: zod_1.z.string().optional(),
    isActive: zod_1.z
        .enum(["true", "false"])
        .optional(),
    from: zod_1.z
        .string()
        .optional(),
    to: zod_1.z
        .string()
        .optional(),
});
/* ==========================================================
   CLEANUP QUERY
========================================================== */
exports.cleanupSessionSchema = zod_1.z.object({
    days: zod_1.z.coerce
        .number()
        .min(1)
        .max(3650)
        .default(90)
        .optional(),
});
