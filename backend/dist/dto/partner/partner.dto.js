"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partnerAnalyticsSchema = exports.partnerPerformanceSchema = exports.partnerFilterSchema = exports.updatePartnerCommissionSchema = exports.rejectPartnerSchema = exports.approvePartnerSchema = exports.updatePartnerSchema = exports.createPartnerSchema = exports.partnerProductEnum = exports.agreementStatusEnum = exports.partnerStatusEnum = exports.partnerTypeEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   PARTNER TYPE
========================================= */
exports.partnerTypeEnum = zod_1.z.enum([
    "BANK",
    "NBFC",
    "INSURANCE",
    "FINTECH",
    "DSA",
    "CHANNEL_PARTNER",
    "BROKER",
]);
/* =========================================
   PARTNER STATUS
========================================= */
exports.partnerStatusEnum = zod_1.z.enum([
    "PENDING",
    "ACTIVE",
    "SUSPENDED",
    "INACTIVE",
    "REJECTED",
    "BLACKLISTED",
]);
/* =========================================
   AGREEMENT STATUS
========================================= */
exports.agreementStatusEnum = zod_1.z.enum([
    "DRAFT",
    "ACTIVE",
    "EXPIRED",
    "TERMINATED",
]);
/* =========================================
   PRODUCT TYPES
========================================= */
exports.partnerProductEnum = zod_1.z.enum([
    "PERSONAL_LOAN",
    "BUSINESS_LOAN",
    "HOME_LOAN",
    "LAP",
    "CAR_LOAN",
    "EDUCATION_LOAN",
    "GOLD_LOAN",
    "CREDIT_CARD",
    "INSURANCE",
    "FASTAG",
    "DEMAT",
]);
/* =========================================
   CREATE PARTNER
========================================= */
exports.createPartnerSchema = zod_1.z.object({
    companyName: zod_1.z.string()
        .min(2)
        .max(200),
    partnerCode: zod_1.z.string()
        .min(2)
        .max(50)
        .toUpperCase(),
    partnerType: exports.partnerTypeEnum,
    contactPerson: zod_1.z.string()
        .min(2)
        .max(100),
    email: zod_1.z.string().email(),
    phoneNo: zod_1.z.string()
        .regex(/^[6-9]\d{9}$/),
    alternatePhone: zod_1.z.string()
        .optional(),
    website: zod_1.z.string()
        .url()
        .optional(),
    gstNumber: zod_1.z.string()
        .optional(),
    panNumber: zod_1.z.string()
        .optional(),
    address: zod_1.z.string()
        .min(5),
    city: zod_1.z.string(),
    state: zod_1.z.string(),
    pincode: zod_1.z.string(),
    products: zod_1.z.array(exports.partnerProductEnum).min(1),
    agreementStartDate: zod_1.z.string(),
    agreementEndDate: zod_1.z.string(),
    commissionPercentage: zod_1.z.number()
        .min(0)
        .max(100),
    status: exports.partnerStatusEnum
        .default("PENDING"),
});
/* =========================================
   UPDATE PARTNER
========================================= */
exports.updatePartnerSchema = zod_1.z.object({
    companyName: zod_1.z.string().optional(),
    contactPerson: zod_1.z.string().optional(),
    email: zod_1.z.string()
        .email()
        .optional(),
    phoneNo: zod_1.z.string()
        .optional(),
    website: zod_1.z.string()
        .url()
        .optional(),
    address: zod_1.z.string()
        .optional(),
    city: zod_1.z.string()
        .optional(),
    state: zod_1.z.string()
        .optional(),
    pincode: zod_1.z.string()
        .optional(),
    commissionPercentage: zod_1.z.number()
        .optional(),
});
/* =========================================
   PARTNER APPROVAL
========================================= */
exports.approvePartnerSchema = zod_1.z.object({
    partnerId: zod_1.z.string().cuid(),
    remarks: zod_1.z.string()
        .optional(),
});
/* =========================================
   PARTNER REJECTION
========================================= */
exports.rejectPartnerSchema = zod_1.z.object({
    partnerId: zod_1.z.string().cuid(),
    reason: zod_1.z.string()
        .min(3)
        .max(500),
});
/* =========================================
   COMMISSION UPDATE
========================================= */
exports.updatePartnerCommissionSchema = zod_1.z.object({
    partnerId: zod_1.z.string().cuid(),
    commissionPercentage: zod_1.z.number()
        .min(0)
        .max(100),
});
/* =========================================
   PARTNER FILTER
========================================= */
exports.partnerFilterSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    partnerType: exports.partnerTypeEnum.optional(),
    status: exports.partnerStatusEnum.optional(),
    city: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
    page: zod_1.z.coerce.number()
        .default(1),
    limit: zod_1.z.coerce.number()
        .default(20),
});
/* =========================================
   PARTNER PERFORMANCE
========================================= */
exports.partnerPerformanceSchema = zod_1.z.object({
    partnerId: zod_1.z.string().cuid(),
    startDate: zod_1.z.string(),
    endDate: zod_1.z.string(),
});
/* =========================================
   PARTNER ANALYTICS
========================================= */
exports.partnerAnalyticsSchema = zod_1.z.object({
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    partnerType: exports.partnerTypeEnum.optional(),
});
