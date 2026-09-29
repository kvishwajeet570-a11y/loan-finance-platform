"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eligibilityCheckSchema = exports.blockCustomerSchema = exports.customerFilterSchema = exports.updateCustomerProfileSchema = exports.updateCustomerSchema = exports.createCustomerSchema = exports.customerStatusEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   CUSTOMER STATUS
========================================= */
exports.customerStatusEnum = zod_1.z.enum([
    "ACTIVE",
    "INACTIVE",
    "BLOCKED",
]);
/* =========================================
   EMPLOYMENT TYPE
========================================= */
const employmentTypeEnum = zod_1.z.enum([
    "SALARIED",
    "SELF_EMPLOYED",
    "BUSINESS_OWNER",
    "FREELANCER",
    "STUDENT",
    "OTHER",
]);
/* =========================================
   CREATE CUSTOMER
========================================= */
exports.createCustomerSchema = zod_1.z.object({
    name: zod_1.z.string().min(3).max(100),
    email: zod_1.z.email(),
    phoneNo: zod_1.z
        .string()
        .regex(/^[6-9]\d{9}$/),
    password: zod_1.z.string().min(8),
    dob: zod_1.z.string().optional(),
    panNo: zod_1.z
        .string()
        .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
        .optional(),
    city: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
    employmentType: employmentTypeEnum.optional(),
    monthlyIncome: zod_1.z
        .number()
        .positive()
        .optional(),
});
/* =========================================
   UPDATE CUSTOMER
========================================= */
exports.updateCustomerSchema = exports.createCustomerSchema.partial();
/* =========================================
   CUSTOMER PROFILE
========================================= */
exports.updateCustomerProfileSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    profileImage: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
    dob: zod_1.z.string().optional(),
    employmentType: employmentTypeEnum.optional(),
    monthlyIncome: zod_1.z.number().positive().optional(),
});
/* =========================================
   CUSTOMER FILTER
========================================= */
exports.customerFilterSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    isVerified: zod_1.z.boolean().optional(),
    isBlocked: zod_1.z.boolean().optional(),
    status: exports.customerStatusEnum.optional(),
    employmentType: employmentTypeEnum.optional(),
    page: zod_1.z.coerce.number().default(1),
    limit: zod_1.z.coerce.number()
        .min(1)
        .max(100)
        .default(10),
});
/* =========================================
   BLOCK CUSTOMER
========================================= */
exports.blockCustomerSchema = zod_1.z.object({
    customerId: zod_1.z.string().cuid(),
    reason: zod_1.z
        .string()
        .min(5)
        .max(500),
});
/* =========================================
   CUSTOMER ELIGIBILITY
========================================= */
exports.eligibilityCheckSchema = zod_1.z.object({
    monthlyIncome: zod_1.z.number().positive(),
    loanAmount: zod_1.z.number().positive(),
    tenureMonths: zod_1.z.number().positive(),
    creditScore: zod_1.z
        .number()
        .min(300)
        .max(900),
});
