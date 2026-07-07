"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.faqAnalyticsSchema = exports.faqFilterSchema = exports.reorderFaqSchema = exports.featureFaqSchema = exports.updateFaqStatusSchema = exports.updateFaqSchema = exports.createFaqSchema = exports.faqStatusEnum = exports.faqCategoryEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   FAQ CATEGORY
========================================= */
exports.faqCategoryEnum = zod_1.z.enum([
    "GENERAL",
    "PERSONAL_LOAN",
    "BUSINESS_LOAN",
    "HOME_LOAN",
    "LAP",
    "CAR_LOAN",
    "CREDIT_CARD",
    "INSURANCE",
    "KYC",
    "PAYMENT",
    "DSA",
    "PARTNER",
    "ACCOUNT",
    "TECHNICAL",
]);
/* =========================================
   FAQ STATUS
========================================= */
exports.faqStatusEnum = zod_1.z.enum([
    "ACTIVE",
    "INACTIVE",
    "DRAFT",
]);
/* =========================================
   CREATE FAQ
========================================= */
exports.createFaqSchema = zod_1.z.object({
    question: zod_1.z.string()
        .min(5)
        .max(300),
    answer: zod_1.z.string()
        .min(10)
        .max(10000),
    category: exports.faqCategoryEnum,
    displayOrder: zod_1.z.number()
        .int()
        .min(0)
        .default(0),
    isFeatured: zod_1.z.boolean()
        .default(false),
    status: exports.faqStatusEnum
        .default("ACTIVE"),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
});
/* =========================================
   UPDATE FAQ
========================================= */
exports.updateFaqSchema = exports.createFaqSchema.partial();
/* =========================================
   FAQ STATUS UPDATE
========================================= */
exports.updateFaqStatusSchema = zod_1.z.object({
    faqId: zod_1.z.string().cuid(),
    status: exports.faqStatusEnum,
});
/* =========================================
   FEATURE FAQ
========================================= */
exports.featureFaqSchema = zod_1.z.object({
    faqId: zod_1.z.string().cuid(),
    isFeatured: zod_1.z.boolean(),
});
/* =========================================
   FAQ REORDER
========================================= */
exports.reorderFaqSchema = zod_1.z.object({
    faqId: zod_1.z.string().cuid(),
    displayOrder: zod_1.z.number().int().min(0),
});
/* =========================================
   FAQ FILTER
========================================= */
exports.faqFilterSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    category: exports.faqCategoryEnum.optional(),
    status: exports.faqStatusEnum.optional(),
    isFeatured: zod_1.z.boolean().optional(),
    page: zod_1.z.coerce.number()
        .default(1),
    limit: zod_1.z.coerce.number()
        .min(1)
        .max(100)
        .default(10),
});
/* =========================================
   FAQ ANALYTICS
========================================= */
exports.faqAnalyticsSchema = zod_1.z.object({
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
});
