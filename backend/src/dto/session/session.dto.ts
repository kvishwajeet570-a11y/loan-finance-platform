import { z } from "zod";

/* ==========================================================
   COMMON ENUMS
========================================================== */

export const sessionStatusSchema = z.enum([
  "ACTIVE",
  "INACTIVE",
]);

/* ==========================================================
   CREATE SESSION
========================================================== */

export const createSessionSchema = z.object({
  userId: z.string().cuid("Invalid User ID"),

  token: z
    .string()
    .min(32, "Token is too short")
    .max(500),

  ipAddress: z
    .string()
    .max(100)
    .optional(),

  userAgent: z
    .string()
    .max(1000)
    .optional(),

  isActive: z
    .boolean()
    .default(true)
    .optional(),

  expiresAt: z.coerce.date(),
});

/* ==========================================================
   UPDATE SESSION
========================================================== */

export const updateSessionSchema = z.object({
  token: z
    .string()
    .min(32)
    .max(500)
    .optional(),

  ipAddress: z
    .string()
    .max(100)
    .optional(),

  userAgent: z
    .string()
    .max(1000)
    .optional(),

  isActive: z
    .boolean()
    .optional(),

  logoutAt: z
    .coerce
    .date()
    .optional(),

  expiresAt: z
    .coerce
    .date()
    .optional(),
});

/* ==========================================================
   SESSION ID PARAM
========================================================== */

export const sessionIdSchema = z.object({
  id: z.string().cuid("Invalid Session ID"),
});

/* ==========================================================
   USER SESSION PARAM
========================================================== */

export const userSessionSchema = z.object({
  userId: z.string().cuid("Invalid User ID"),
});

/* ==========================================================
   SESSION QUERY
========================================================== */

export const sessionQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1).optional(),

  limit: z.coerce.number().min(1).max(100).default(20).optional(),

  search: z.string().optional(),

  isActive: z
    .enum(["true", "false"])
    .optional(),

  from: z
    .string()
    .optional(),

  to: z
    .string()
    .optional(),
});

/* ==========================================================
   CLEANUP QUERY
========================================================== */

export const cleanupSessionSchema = z.object({
  days: z.coerce
    .number()
    .min(1)
    .max(3650)
    .default(90)
    .optional(),
});

/* ==========================================================
   TYPE EXPORTS
========================================================== */

export type CreateSessionDto = z.infer<
  typeof createSessionSchema
>;

export type UpdateSessionDto = z.infer<
  typeof updateSessionSchema
>;

export type SessionIdDto = z.infer<
  typeof sessionIdSchema
>;

export type UserSessionDto = z.infer<
  typeof userSessionSchema
>;

export type SessionQueryDto = z.infer<
  typeof sessionQuerySchema
>;

export type CleanupSessionDto = z.infer<
  typeof cleanupSessionSchema
>;