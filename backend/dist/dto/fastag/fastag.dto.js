"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fastagBalanceSchema = exports.fastagTransactionSchema = exports.fastagFilterSchema = exports.fastagKycSchema = exports.updateFastagStatusSchema = exports.fastagRechargeSchema = exports.updateFastagSchema = exports.createFastagSchema = exports.vehicleTypeEnum = exports.fastagStatusEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   FASTAG STATUS
========================================= */
exports.fastagStatusEnum = zod_1.z.enum([
    "PENDING",
    "ACTIVE",
    "SUSPENDED",
    "BLOCKED",
    "CLOSED",
]);
/* =========================================
   VEHICLE TYPE
========================================= */
exports.vehicleTypeEnum = zod_1.z.enum([
    "CAR",
    "SUV",
    "MUV",
    "BIKE",
    "TRUCK",
    "BUS",
    "TAXI",
    "COMMERCIAL",
]);
/* =========================================
   CREATE FASTAG
========================================= */
exports.createFastagSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(),
    vehicleNumber: zod_1.z.string()
        .min(5)
        .max(20),
    vehicleType: exports.vehicleTypeEnum,
    ownerName: zod_1.z.string()
        .min(3)
        .max(100),
    mobileNumber: zod_1.z.string()
        .regex(/^[6-9]\d{9}$/),
    email: zod_1.z.email(),
    panNo: zod_1.z.string()
        .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
        .optional(),
    bankName: zod_1.z.string().optional(),
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
    amount: zod_1.z.number()
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
   FASTAG KYC
========================================= */
exports.fastagKycSchema = zod_1.z.object({
    fastagId: zod_1.z.string().cuid(),
    documentId: zod_1.z.string().cuid(),
    isVerified: zod_1.z.boolean(),
});
/* =========================================
   FASTAG FILTER
========================================= */
exports.fastagFilterSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    vehicleType: exports.vehicleTypeEnum.optional(),
    status: exports.fastagStatusEnum.optional(),
    userId: zod_1.z.string().cuid().optional(),
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
