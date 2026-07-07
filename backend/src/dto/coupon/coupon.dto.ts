import { z } from "zod";

/* =========================================
   COUPON TYPE
========================================= */

export const couponTypeEnum = z.enum([
  "PERCENTAGE",
  "FLAT",
]);

/* =========================================
   COUPON STATUS
========================================= */

export const couponStatusEnum = z.enum([
  "ACTIVE",
  "INACTIVE",
  "EXPIRED",
]);

/* =========================================
   CREATE COUPON
========================================= */

export const createCouponSchema = z.object({
  code: z
    .string()
    .min(3)
    .max(30)
    .transform(val => val.toUpperCase()),

  title: z
    .string()
    .min(3)
    .max(150),

  description: z
    .string()
    .max(500)
    .optional(),

  type: couponTypeEnum,

  value: z
    .number()
    .positive(),

  minimumAmount: z
    .number()
    .nonnegative()
    .default(0),

  maximumDiscount: z
    .number()
    .nonnegative()
    .optional(),

  usageLimit: z
    .number()
    .int()
    .positive(),

  usagePerUser: z
    .number()
    .int()
    .positive()
    .default(1),

  validFrom: z.coerce.date(),

  validTill: z.coerce.date(),

  isActive: z
    .boolean()
    .default(true),
});

/* =========================================
   UPDATE COUPON
========================================= */

export const updateCouponSchema =
  createCouponSchema.partial();

/* =========================================
   APPLY COUPON
========================================= */

export const applyCouponSchema = z.object({
  code: z.string(),

  amount: z
    .number()
    .positive(),

  userId: z
    .string()
    .cuid(),
});

/* =========================================
   COUPON FILTER
========================================= */

export const couponFilterSchema = z.object({
  search: z.string().optional(),

  status: couponStatusEnum.optional(),

  isActive: z.boolean().optional(),

  page: z.coerce.number().default(1),

  limit: z.coerce.number()
    .min(1)
    .max(100)
    .default(10),
});

/* =========================================
   UPDATE STATUS
========================================= */

export const updateCouponStatusSchema =
  z.object({
    couponId: z.string().cuid(),

    isActive: z.boolean(),
  });

/* =========================================
   TYPES
========================================= */

export type CreateCouponDto =
  z.infer<typeof createCouponSchema>;

export type UpdateCouponDto =
  z.infer<typeof updateCouponSchema>;

export type ApplyCouponDto =
  z.infer<typeof applyCouponSchema>;

export type CouponFilterDto =
  z.infer<typeof couponFilterSchema>;

export type UpdateCouponStatusDto =
  z.infer<typeof updateCouponStatusSchema>;