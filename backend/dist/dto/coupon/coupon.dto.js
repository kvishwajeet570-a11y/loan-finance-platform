"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCouponStatusSchema = exports.couponFilterSchema = exports.applyCouponSchema = exports.updateCouponSchema = exports.createCouponSchema = exports.couponStatusEnum = exports.couponTypeEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   COUPON TYPE
========================================= */
exports.couponTypeEnum = zod_1.z.enum([
    "PERCENTAGE",
    "FLAT",
]);
/* =========================================
   COUPON STATUS
========================================= */
exports.couponStatusEnum = zod_1.z.enum([
    "ACTIVE",
    "INACTIVE",
    "EXPIRED",
]);
/* =========================================
   CREATE COUPON
========================================= */
exports.createCouponSchema = zod_1.z.object({
    code: zod_1.z
        .string()
        .min(3)
        .max(30)
        .transform(val => val.toUpperCase()),
    title: zod_1.z
        .string()
        .min(3)
        .max(150),
    description: zod_1.z
        .string()
        .max(500)
        .optional(),
    type: exports.couponTypeEnum,
    value: zod_1.z
        .number()
        .positive(),
    minimumAmount: zod_1.z
        .number()
        .nonnegative()
        .default(0),
    maximumDiscount: zod_1.z
        .number()
        .nonnegative()
        .optional(),
    usageLimit: zod_1.z
        .number()
        .int()
        .positive(),
    usagePerUser: zod_1.z
        .number()
        .int()
        .positive()
        .default(1),
    validFrom: zod_1.z.coerce.date(),
    validTill: zod_1.z.coerce.date(),
    isActive: zod_1.z
        .boolean()
        .default(true),
});
/* =========================================
   UPDATE COUPON
========================================= */
exports.updateCouponSchema = exports.createCouponSchema.partial();
/* =========================================
   APPLY COUPON
========================================= */
exports.applyCouponSchema = zod_1.z.object({
    code: zod_1.z.string(),
    amount: zod_1.z
        .number()
        .positive(),
    userId: zod_1.z
        .string()
        .cuid(),
});
/* =========================================
   COUPON FILTER
========================================= */
exports.couponFilterSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    status: exports.couponStatusEnum.optional(),
    isActive: zod_1.z.boolean().optional(),
    page: zod_1.z.coerce.number().default(1),
    limit: zod_1.z.coerce.number()
        .min(1)
        .max(100)
        .default(10),
});
/* =========================================
   UPDATE STATUS
========================================= */
exports.updateCouponStatusSchema = zod_1.z.object({
    couponId: zod_1.z.string().cuid(),
    isActive: zod_1.z.boolean(),
});
