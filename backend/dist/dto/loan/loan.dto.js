"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loanAnalyticsSchema = exports.loanFilterSchema = exports.disburseLoanSchema = exports.emiCalculatorSchema = exports.loanEligibilitySchema = exports.assignLoanSchema = exports.updateLoanStatusSchema = exports.updateLoanSchema = exports.createLoanSchema = exports.employmentTypeEnum = exports.loanStatusEnum = exports.loanTypeEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   LOAN TYPE
========================================= */
exports.loanTypeEnum = zod_1.z.enum([
    "PERSONAL_LOAN",
    "BUSINESS_LOAN",
    "HOME_LOAN",
    "LAP",
    "CAR_LOAN",
    "EDUCATION_LOAN",
    "CREDIT_CARD",
    "BALANCE_TRANSFER",
]);
/* =========================================
   LOAN STATUS
========================================= */
exports.loanStatusEnum = zod_1.z.enum([
    "DRAFT",
    "SUBMITTED",
    "DOCUMENT_PENDING",
    "KYC_PENDING",
    "UNDER_REVIEW",
    "APPROVED",
    "REJECTED",
    "DISBURSED",
    "CLOSED",
    "CANCELLED",
]);
/* =========================================
   EMPLOYMENT TYPE
========================================= */
exports.employmentTypeEnum = zod_1.z.enum([
    "SALARIED",
    "SELF_EMPLOYED",
    "BUSINESS_OWNER",
    "PROFESSIONAL",
]);
/* =========================================
   CREATE LOAN APPLICATION
========================================= */
exports.createLoanSchema = zod_1.z.object({
    fullName: zod_1.z.string()
        .min(3)
        .max(100),
    email: zod_1.z.email(),
    phone: zod_1.z.string()
        .regex(/^[6-9]\d{9}$/),
    dob: zod_1.z.string(),
    panNo: zod_1.z.string()
        .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/),
    loanType: exports.loanTypeEnum,
    amount: zod_1.z.number()
        .positive()
        .min(10000)
        .max(100000000),
    tenureMonths: zod_1.z.number()
        .int()
        .positive(),
    monthlyIncome: zod_1.z.number()
        .positive(),
    employmentType: exports.employmentTypeEnum,
    city: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
    pincode: zod_1.z.string().optional(),
    existingEMI: zod_1.z.number()
        .min(0)
        .optional(),
    remarks: zod_1.z.string()
        .max(1000)
        .optional(),
});
/* =========================================
   UPDATE LOAN
========================================= */
exports.updateLoanSchema = exports.createLoanSchema.partial();
/* =========================================
   UPDATE LOAN STATUS
========================================= */
exports.updateLoanStatusSchema = zod_1.z.object({
    loanId: zod_1.z.string().cuid(),
    status: exports.loanStatusEnum,
    remarks: zod_1.z.string()
        .max(1000)
        .optional(),
});
/* =========================================
   ASSIGN LOAN
========================================= */
exports.assignLoanSchema = zod_1.z.object({
    loanId: zod_1.z.string().cuid(),
    assignedTo: zod_1.z.string().cuid(),
    assignedRole: zod_1.z.enum([
        "DSA",
        "PARTNER",
        "EMPLOYEE",
        "MANAGER",
    ]),
});
/* =========================================
   LOAN ELIGIBILITY
========================================= */
exports.loanEligibilitySchema = zod_1.z.object({
    monthlyIncome: zod_1.z.number().positive(),
    existingEMI: zod_1.z.number()
        .min(0)
        .default(0),
    requestedAmount: zod_1.z.number().positive(),
    creditScore: zod_1.z.number()
        .min(300)
        .max(900),
});
/* =========================================
   EMI CALCULATOR
========================================= */
exports.emiCalculatorSchema = zod_1.z.object({
    principal: zod_1.z.number().positive(),
    interestRate: zod_1.z.number().positive(),
    tenureMonths: zod_1.z.number().positive(),
});
/* =========================================
   DISBURSE LOAN
========================================= */
exports.disburseLoanSchema = zod_1.z.object({
    loanId: zod_1.z.string().cuid(),
    disbursedAmount: zod_1.z.number().positive(),
    interestRate: zod_1.z.number().positive(),
    disbursementDate: zod_1.z.string(),
    transactionRef: zod_1.z.string(),
});
/* =========================================
   LOAN FILTER
========================================= */
exports.loanFilterSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    loanType: exports.loanTypeEnum.optional(),
    status: exports.loanStatusEnum.optional(),
    assignedTo: zod_1.z.string().cuid().optional(),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    minAmount: zod_1.z.number().optional(),
    maxAmount: zod_1.z.number().optional(),
    page: zod_1.z.coerce.number()
        .default(1),
    limit: zod_1.z.coerce.number()
        .min(1)
        .max(100)
        .default(10),
});
/* =========================================
   LOAN ANALYTICS
========================================= */
exports.loanAnalyticsSchema = zod_1.z.object({
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    loanType: exports.loanTypeEnum.optional(),
    status: exports.loanStatusEnum.optional(),
});
