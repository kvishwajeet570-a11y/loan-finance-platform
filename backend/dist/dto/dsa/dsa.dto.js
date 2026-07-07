"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dsaPerformanceSchema = exports.dsaFilterSchema = exports.dsaTargetSchema = exports.assignLeadToDsaSchema = exports.dsaCommissionSchema = exports.approveDsaSchema = exports.updateDsaSchema = exports.createDsaSchema = exports.dsaLevelEnum = exports.dsaTypeEnum = exports.dsaStatusEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   DSA STATUS
========================================= */
exports.dsaStatusEnum = zod_1.z.enum([
    "PENDING",
    "ACTIVE",
    "INACTIVE",
    "BLOCKED",
    "REJECTED",
]);
/* =========================================
   DSA TYPE
========================================= */
exports.dsaTypeEnum = zod_1.z.enum([
    "INDIVIDUAL",
    "CORPORATE",
]);
/* =========================================
   DSA LEVEL
========================================= */
exports.dsaLevelEnum = zod_1.z.enum([
    "BRONZE",
    "SILVER",
    "GOLD",
    "PLATINUM",
    "DIAMOND",
]);
/* =========================================
   CREATE DSA
========================================= */
exports.createDsaSchema = zod_1.z.object({
    name: zod_1.z.string().min(3).max(100),
    email: zod_1.z.email(),
    phoneNo: zod_1.z
        .string()
        .regex(/^[6-9]\d{9}$/),
    password: zod_1.z.string().min(8),
    dsaType: exports.dsaTypeEnum,
    companyName: zod_1.z.string().optional(),
    panNo: zod_1.z
        .string()
        .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/),
    city: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
    pincode: zod_1.z.string().optional(),
});
/* =========================================
   UPDATE DSA
========================================= */
exports.updateDsaSchema = exports.createDsaSchema.partial();
/* =========================================
   DSA APPROVAL
========================================= */
exports.approveDsaSchema = zod_1.z.object({
    dsaId: zod_1.z.string().cuid(),
    status: zod_1.z.enum([
        "ACTIVE",
        "REJECTED",
    ]),
    remarks: zod_1.z.string()
        .max(500)
        .optional(),
});
/* =========================================
   DSA COMMISSION
========================================= */
exports.dsaCommissionSchema = zod_1.z.object({
    dsaId: zod_1.z.string().cuid(),
    loanType: zod_1.z.enum([
        "PERSONAL_LOAN",
        "BUSINESS_LOAN",
        "HOME_LOAN",
        "LAP",
        "CAR_LOAN",
        "CREDIT_CARD",
    ]),
    commissionRate: zod_1.z.number().min(0),
    effectiveFrom: zod_1.z.string(),
});
/* =========================================
   ASSIGN LEAD
========================================= */
exports.assignLeadToDsaSchema = zod_1.z.object({
    dsaId: zod_1.z.string().cuid(),
    leadId: zod_1.z.string().cuid(),
});
/* =========================================
   DSA TARGET
========================================= */
exports.dsaTargetSchema = zod_1.z.object({
    dsaId: zod_1.z.string().cuid(),
    targetLeads: zod_1.z.number().positive(),
    targetDisbursal: zod_1.z.number().positive(),
    month: zod_1.z.number()
        .min(1)
        .max(12),
    year: zod_1.z.number()
        .min(2024),
});
/* =========================================
   DSA FILTER
========================================= */
exports.dsaFilterSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    status: exports.dsaStatusEnum.optional(),
    dsaType: exports.dsaTypeEnum.optional(),
    level: exports.dsaLevelEnum.optional(),
    page: zod_1.z.coerce.number()
        .default(1),
    limit: zod_1.z.coerce.number()
        .min(1)
        .max(100)
        .default(10),
});
/* =========================================
   DSA PERFORMANCE
========================================= */
exports.dsaPerformanceSchema = zod_1.z.object({
    dsaId: zod_1.z.string().cuid(),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
});
