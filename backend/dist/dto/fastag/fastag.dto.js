"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fastagBalanceSchema = exports.fastagTransactionSchema = exports.fastagFilterSchema = exports.updateFastagStatusSchema = exports.fastagRechargeSchema = exports.updateFastagSchema = exports.createFastagSchema = exports.fastagStatusEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   FASTAG STATUS
========================================= */
exports.fastagStatusEnum = zod_1.z.enum([
    "PENDING",
    "SUCCESS",
    "FAILED",
    "ACTIVE",
    "INACTIVE",
]);
/* =========================================
   CREATE FASTAG
========================================= */
exports.createFastagSchema = zod_1.z.object({
    vehicleNo: zod_1.z.string().min(5).max(20),
    provider: zod_1.z.string().min(2).max(100),
    amount: zod_1.z.coerce.number().positive(),
    userId: zod_1.z.string().min(1),
    slug: zod_1.z.string().optional(),
    status: exports.fastagStatusEnum.optional(),
    isActive: zod_1.z.boolean().optional(),
});
/* =========================================
   UPDATE FASTAG
========================================= */
exports.updateFastagSchema = exports.createFastagSchema.partial();
/* =========================================
   FASTAG RECHARGE
========================================= */
exports.fastagRechargeSchema = zod_1.z.object({
    fastagId: zod_1.z.string().cuid(),
    amount: zod_1.z.coerce.number()
        .positive()
        .min(100),
});
/* =========================================
   FASTAG STATUS UPDATE
========================================= */
exports.updateFastagStatusSchema = zod_1.z.object({
    fastagId: zod_1.z.string().cuid(),
    status: exports.fastagStatusEnum,
    remarks: zod_1.z.string().optional(),
});
/* =========================================
   FASTAG FILTER
========================================= */
exports.fastagFilterSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    status: exports.fastagStatusEnum.optional(),
    userId: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean().optional(),
    page: zod_1.z.coerce.number()
        .default(1),
    limit: zod_1.z.coerce.number()
        .min(1)
        .max(100)
        .default(10),
});
/* =========================================
   FASTAG TRANSACTION FILTER
========================================= */
exports.fastagTransactionSchema = zod_1.z.object({
    fastagId: zod_1.z.string().cuid(),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
});
/* =========================================
   FASTAG BALANCE CHECK
========================================= */
exports.fastagBalanceSchema = zod_1.z.object({
    fastagId: zod_1.z.string().cuid(),
});
