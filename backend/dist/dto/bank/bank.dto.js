"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bankCommissionSchema = exports.assignBankManagerSchema = exports.bankFilterSchema = exports.bankLoanProductSchema = exports.updateBankSchema = exports.createBankSchema = exports.bankTypeEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   BANK TYPES
========================================= */
exports.bankTypeEnum = zod_1.z.enum([
    "BANK",
    "NBFC",
    "FINTECH",
    "INSURANCE",
]);
/* =========================================
   CREATE BANK
========================================= */
exports.createBankSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2)
        .max(150),
    shortName: zod_1.z
        .string()
        .min(2)
        .max(20),
    type: exports.bankTypeEnum,
    website: zod_1.z
        .url()
        .optional(),
    email: zod_1.z
        .email()
        .optional(),
    phone: zod_1.z
        .string()
        .regex(/^[6-9]\d{9}$/)
        .optional(),
    logo: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
    pincode: zod_1.z
        .string()
        .regex(/^\d{6}$/)
        .optional(),
    isActive: zod_1.z.boolean().default(true),
});
/* =========================================
   UPDATE BANK
========================================= */
exports.updateBankSchema = exports.createBankSchema.partial();
/* =========================================
   BANK LOAN PRODUCT
========================================= */
exports.bankLoanProductSchema = zod_1.z.object({
    bankId: zod_1.z.string().cuid(),
    loanType: zod_1.z.enum([
        "PERSONAL_LOAN",
        "BUSINESS_LOAN",
        "HOME_LOAN",
        "LAP",
        "CAR_LOAN",
        "EDUCATION_LOAN",
        "CREDIT_CARD",
    ]),
    minAmount: zod_1.z.number().positive(),
    maxAmount: zod_1.z.number().positive(),
    minTenure: zod_1.z.number().positive(),
    maxTenure: zod_1.z.number().positive(),
    interestRate: zod_1.z.number().min(0),
    processingFee: zod_1.z.number().min(0),
    isActive: zod_1.z.boolean().default(true),
});
/* =========================================
   BANK FILTER
========================================= */
exports.bankFilterSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    type: exports.bankTypeEnum.optional(),
    isActive: zod_1.z.boolean().optional(),
    page: zod_1.z.coerce.number().default(1),
    limit: zod_1.z.coerce.number()
        .min(1)
        .max(100)
        .default(10),
});
/* =========================================
   ASSIGN BANK MANAGER
========================================= */
exports.assignBankManagerSchema = zod_1.z.object({
    bankId: zod_1.z.string().cuid(),
    userId: zod_1.z.string().cuid(),
});
/* =========================================
   BANK COMMISSION
========================================= */
exports.bankCommissionSchema = zod_1.z.object({
    bankId: zod_1.z.string().cuid(),
    loanType: zod_1.z.string(),
    commissionPercent: zod_1.z
        .number()
        .min(0)
        .max(100),
    isActive: zod_1.z.boolean().default(true),
});
