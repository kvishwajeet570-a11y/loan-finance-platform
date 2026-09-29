"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commissionReportSchema = exports.commissionFilterSchema = exports.payCommissionSchema = exports.rejectCommissionSchema = exports.approveCommissionSchema = exports.updateCommissionSchema = exports.createCommissionSchema = exports.commissionStatusEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   COMMISSION STATUS
========================================= */
exports.commissionStatusEnum = zod_1.z.enum([
    "PENDING",
    "APPROVED",
    "PAID",
    "REJECTED",
]);
/* =========================================
   CREATE COMMISSION
========================================= */
exports.createCommissionSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(),
    loanId: zod_1.z.string().cuid().optional(),
    partnerId: zod_1.z.string().cuid().optional(),
    source: zod_1.z.string().max(100).optional(),
    amount: zod_1.z.number().positive(),
    loanAmount: zod_1.z.number().min(0),
    commissionAmount: zod_1.z.number().min(0),
    status: exports.commissionStatusEnum.default("PENDING"),
});
/* =========================================
   UPDATE COMMISSION
========================================= */
exports.updateCommissionSchema = zod_1.z.object({
    amount: zod_1.z.number().positive().optional(),
    loanAmount: zod_1.z.number().min(0).optional(),
    commissionAmount: zod_1.z.number().min(0).optional(),
    partnerId: zod_1.z.string().cuid().optional(),
    source: zod_1.z.string().max(100).optional(),
    status: exports.commissionStatusEnum.optional(),
    rejectionReason: zod_1.z.string().max(500).optional(),
});
/* =========================================
   APPROVE COMMISSION
========================================= */
exports.approveCommissionSchema = zod_1.z.object({
    commissionId: zod_1.z.string().cuid(),
});
/* =========================================
   REJECT COMMISSION
========================================= */
exports.rejectCommissionSchema = zod_1.z.object({
    commissionId: zod_1.z.string().cuid(),
    rejectionReason: zod_1.z.string().min(5).max(500),
});
/* =========================================
   PAY COMMISSION
========================================= */
exports.payCommissionSchema = zod_1.z.object({
    commissionId: zod_1.z.string().cuid(),
});
/* =========================================
   COMMISSION FILTER
========================================= */
exports.commissionFilterSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    userId: zod_1.z.string().cuid().optional(),
    partnerId: zod_1.z.string().cuid().optional(),
    status: exports.commissionStatusEnum.optional(),
    source: zod_1.z.string().optional(),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    page: zod_1.z.coerce.number().min(1).default(1),
    limit: zod_1.z.coerce.number().min(1).max(100).default(10),
});
/* =========================================
   COMMISSION REPORT
========================================= */
exports.commissionReportSchema = zod_1.z.object({
    startDate: zod_1.z.string(),
    endDate: zod_1.z.string(),
    status: exports.commissionStatusEnum.optional(),
});
