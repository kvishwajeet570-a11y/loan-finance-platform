"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leadAnalyticsSchema = exports.leadConversionSchema = exports.bulkAssignLeadSchema = exports.leadFilterSchema = exports.leadFollowUpSchema = exports.updateLeadStatusSchema = exports.assignLeadSchema = exports.updateLeadSchema = exports.createLeadSchema = exports.leadProductEnum = exports.leadPriorityEnum = exports.leadStatusEnum = exports.leadSourceEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   LEAD SOURCE
========================================= */
exports.leadSourceEnum = zod_1.z.enum([
    "WEBSITE",
    "MOBILE_APP",
    "DSA",
    "PARTNER",
    "FACEBOOK",
    "INSTAGRAM",
    "GOOGLE_ADS",
    "YOUTUBE",
    "WHATSAPP",
    "REFERRAL",
    "TELECALLER",
    "WALK_IN",
    "OTHER",
]);
/* =========================================
   LEAD STATUS
========================================= */
exports.leadStatusEnum = zod_1.z.enum([
    "NEW",
    "CONTACTED",
    "FOLLOW_UP",
    "DOCUMENT_PENDING",
    "KYC_PENDING",
    "UNDER_REVIEW",
    "APPROVED",
    "REJECTED",
    "DISBURSED",
    "LOST",
]);
/* =========================================
   LEAD PRIORITY
========================================= */
exports.leadPriorityEnum = zod_1.z.enum([
    "LOW",
    "MEDIUM",
    "HIGH",
    "URGENT",
]);
/* =========================================
   PRODUCT TYPE
========================================= */
exports.leadProductEnum = zod_1.z.enum([
    "PERSONAL_LOAN",
    "BUSINESS_LOAN",
    "HOME_LOAN",
    "LAP",
    "CAR_LOAN",
    "CREDIT_CARD",
    "INSURANCE",
    "FASTAG",
    "INVESTMENT",
    "DEMAT_ACCOUNT",
]);
/* =========================================
   CREATE LEAD
========================================= */
exports.createLeadSchema = zod_1.z.object({
    fullName: zod_1.z.string()
        .min(3)
        .max(100),
    mobileNumber: zod_1.z.string()
        .regex(/^[6-9]\d{9}$/),
    email: zod_1.z.email().optional(),
    city: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
    pincode: zod_1.z.string().optional(),
    productType: exports.leadProductEnum,
    loanAmount: zod_1.z.number()
        .positive()
        .optional(),
    monthlyIncome: zod_1.z.number().positive().optional(),
    panNo: zod_1.z.string()
        .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
        .optional(),
    source: exports.leadSourceEnum,
    remarks: zod_1.z.string().max(1000).optional(),
    priority: exports.leadPriorityEnum.default("MEDIUM"),
});
/* =========================================
   UPDATE LEAD
========================================= */
exports.updateLeadSchema = exports.createLeadSchema.partial();
/* =========================================
   ASSIGN LEAD
========================================= */
exports.assignLeadSchema = zod_1.z.object({
    leadId: zod_1.z.string().cuid(),
    assignedTo: zod_1.z.string().cuid(),
    assignedRole: zod_1.z.enum([
        "DSA",
        "EMPLOYEE",
        "PARTNER",
        "MANAGER",
    ]),
});
/* =========================================
   UPDATE LEAD STATUS
========================================= */
exports.updateLeadStatusSchema = zod_1.z.object({
    leadId: zod_1.z.string().cuid(),
    status: exports.leadStatusEnum,
    remarks: zod_1.z.string()
        .max(1000)
        .optional(),
    nextFollowUpDate: zod_1.z.string()
        .optional(),
});
/* =========================================
   FOLLOW UP
========================================= */
exports.leadFollowUpSchema = zod_1.z.object({
    leadId: zod_1.z.string().cuid(),
    followUpDate: zod_1.z.string(),
    remarks: zod_1.z.string()
        .min(3)
        .max(1000),
    outcome: zod_1.z.string()
        .optional(),
});
/* =========================================
   LEAD FILTER
========================================= */
exports.leadFilterSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    productType: exports.leadProductEnum.optional(),
    status: exports.leadStatusEnum.optional(),
    source: exports.leadSourceEnum.optional(),
    priority: exports.leadPriorityEnum.optional(),
    assignedTo: zod_1.z.string().cuid().optional(),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    page: zod_1.z.coerce.number()
        .default(1),
    limit: zod_1.z.coerce.number()
        .min(1)
        .max(100)
        .default(10),
});
/* =========================================
   BULK LEAD ASSIGNMENT
========================================= */
exports.bulkAssignLeadSchema = zod_1.z.object({
    leadIds: zod_1.z.array(zod_1.z.string().cuid()).min(1),
    assignedTo: zod_1.z.string().cuid(),
    assignedRole: zod_1.z.string(),
});
/* =========================================
   LEAD CONVERSION
========================================= */
exports.leadConversionSchema = zod_1.z.object({
    leadId: zod_1.z.string().cuid(),
    convertedTo: zod_1.z.enum([
        "CUSTOMER",
        "LOAN_APPLICATION",
        "INSURANCE_POLICY",
        "INVESTMENT_ACCOUNT",
    ]),
});
/* =========================================
   LEAD ANALYTICS
========================================= */
exports.leadAnalyticsSchema = zod_1.z.object({
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    source: exports.leadSourceEnum.optional(),
    productType: exports.leadProductEnum.optional(),
});
