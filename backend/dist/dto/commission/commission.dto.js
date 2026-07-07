"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commissionReportSchema = exports.commissionFilterSchema = exports.payCommissionSchema = exports.rejectCommissionSchema = exports.approveCommissionSchema = exports.updateCommissionSchema = exports.createCommissionSchema = exports.commissionStatusEnum = exports.commissionTypeEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   COMMISSION TYPE
========================================= */
exports.commissionTypeEnum = zod_1.z.enum([
    "LOAN",
    "INSURANCE",
    "CREDIT_CARD",
    "SAVINGS_ACCOUNT",
    "DEMAT_ACCOUNT",
    "REFERRAL",
]);
/* =========================================
   COMMISSION STATUS
========================================= */
exports.commissionStatusEnum = zod_1.z.enum([
    "PENDING",
    "APPROVED",
    "PAID",
    "REJECTED",
    "HOLD",
]);
/* =========================================
   CREATE COMMISSION
========================================= */
exports.createCommissionSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(),
    loanApplicationId: zod_1.z.string().cuid().optional(),
    commissionType: exports.commissionTypeEnum,
    amount: zod_1.z
        .number()
        .positive(),
    percentage: zod_1.z
        .number()
        .min(0)
        .max(100),
    remarks: zod_1.z
        .string()
        .max(500)
        .optional(),
    status: exports.commissionStatusEnum
        .default("PENDING"),
});
/* =========================================
   UPDATE COMMISSION
========================================= */
exports.updateCommissionSchema = exports.createCommissionSchema.partial();
/* =========================================
   APPROVE COMMISSION
========================================= */
exports.approveCommissionSchema = zod_1.z.object({
    commissionId: zod_1.z.string().cuid(),
    remarks: zod_1.z.string().optional(),
});
/* =========================================
   REJECT COMMISSION
========================================= */
exports.rejectCommissionSchema = zod_1.z.object({
    commissionId: zod_1.z.string().cuid(),
    reason: zod_1.z
        .string()
        .min(5)
        .max(500),
});
/* =========================================
   PAY COMMISSION
========================================= */
exports.payCommissionSchema = zod_1.z.object({
    commissionId: zod_1.z.string().cuid(),
    transactionId: zod_1.z.string(),
    paidAmount: zod_1.z.number().positive(),
});
/* =========================================
   COMMISSION FILTER
========================================= */
exports.commissionFilterSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    userId: zod_1.z.string().cuid().optional(),
    commissionType: exports.commissionTypeEnum.optional(),
    status: exports.commissionStatusEnum.optional(),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    page: zod_1.z.coerce.number().default(1),
    limit: zod_1.z.coerce.number()
        .min(1)
        .max(100)
        .default(10),
});
/* =========================================
   COMMISSION REPORT
========================================= */
exports.commissionReportSchema = zod_1.z.object({
    startDate: zod_1.z.string(),
    endDate: zod_1.z.string(),
    status: exports.commissionStatusEnum.optional(),
});
