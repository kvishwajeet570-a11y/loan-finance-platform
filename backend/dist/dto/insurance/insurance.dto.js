"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insuranceAnalyticsSchema = exports.insuranceFilterSchema = exports.renewPolicySchema = exports.claimInsuranceSchema = exports.updatePolicyStatusSchema = exports.updateInsuranceSchema = exports.createInsuranceSchema = exports.insurancePaymentStatusEnum = exports.policyStatusEnum = exports.insuranceTypeEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   INSURANCE TYPE
========================================= */
exports.insuranceTypeEnum = zod_1.z.enum([
    "HEALTH",
    "MOTOR",
    "LIFE",
    "TRAVEL",
    "HOME",
    "COMMERCIAL",
    "PERSONAL_ACCIDENT",
    "CYBER",
]);
/* =========================================
   POLICY STATUS
========================================= */
exports.policyStatusEnum = zod_1.z.enum([
    "PENDING",
    "ACTIVE",
    "EXPIRED",
    "CANCELLED",
    "REJECTED",
    "CLAIMED",
]);
/* =========================================
   POLICY PAYMENT STATUS
========================================= */
exports.insurancePaymentStatusEnum = zod_1.z.enum([
    "PENDING",
    "PAID",
    "FAILED",
    "REFUNDED",
]);
/* =========================================
   CREATE INSURANCE POLICY
========================================= */
exports.createInsuranceSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(),
    insuranceType: exports.insuranceTypeEnum,
    policyHolderName: zod_1.z.string()
        .min(3)
        .max(100),
    mobileNumber: zod_1.z.string()
        .regex(/^[6-9]\d{9}$/),
    email: zod_1.z.string().email(),
    sumInsured: zod_1.z.number().positive(),
    premiumAmount: zod_1.z.number().positive(),
    tenureMonths: zod_1.z.number().positive(),
    nomineeName: zod_1.z.string().optional(),
    nomineeRelation: zod_1.z.string().optional(),
    insurerName: zod_1.z.string().min(2),
});
/* =========================================
   UPDATE INSURANCE
========================================= */
exports.updateInsuranceSchema = exports.createInsuranceSchema.partial();
/* =========================================
   POLICY STATUS UPDATE
========================================= */
exports.updatePolicyStatusSchema = zod_1.z.object({
    policyId: zod_1.z.string().cuid(),
    status: exports.policyStatusEnum,
    remarks: zod_1.z.string().optional(),
});
/* =========================================
   CLAIM REQUEST
========================================= */
exports.claimInsuranceSchema = zod_1.z.object({
    policyId: zod_1.z.string().cuid(),
    claimAmount: zod_1.z.number().positive(),
    claimReason: zod_1.z.string()
        .min(10)
        .max(1000),
});
/* =========================================
   POLICY RENEWAL
========================================= */
exports.renewPolicySchema = zod_1.z.object({
    policyId: zod_1.z.string().cuid(),
    tenureMonths: zod_1.z.number().positive(),
    premiumAmount: zod_1.z.number().positive(),
});
/* =========================================
   INSURANCE FILTER
========================================= */
exports.insuranceFilterSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    insuranceType: exports.insuranceTypeEnum.optional(),
    status: exports.policyStatusEnum.optional(),
    paymentStatus: exports.insurancePaymentStatusEnum.optional(),
    userId: zod_1.z.string().cuid().optional(),
    page: zod_1.z.coerce.number().default(1),
    limit: zod_1.z.coerce.number()
        .min(1)
        .max(100)
        .default(10),
});
/* =========================================
   POLICY ANALYTICS
========================================= */
exports.insuranceAnalyticsSchema = zod_1.z.object({
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    insuranceType: exports.insuranceTypeEnum.optional(),
});
