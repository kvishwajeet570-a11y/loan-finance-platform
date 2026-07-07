"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkKycActionSchema = exports.kycAnalyticsSchema = exports.kycFilterSchema = exports.resubmitKycSchema = exports.verifyKycSchema = exports.updateKycSchema = exports.createKycSchema = exports.addressDocumentEnum = exports.identityDocumentEnum = exports.kycTypeEnum = exports.kycStatusEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   KYC STATUS
========================================= */
exports.kycStatusEnum = zod_1.z.enum([
    "PENDING",
    "SUBMITTED",
    "UNDER_REVIEW",
    "APPROVED",
    "REJECTED",
    "RESUBMISSION_REQUIRED",
]);
/* =========================================
   KYC TYPE
========================================= */
exports.kycTypeEnum = zod_1.z.enum([
    "CUSTOMER",
    "DSA",
    "PARTNER",
    "EMPLOYEE",
]);
/* =========================================
   IDENTITY DOCUMENT
========================================= */
exports.identityDocumentEnum = zod_1.z.enum([
    "PAN_CARD",
    "AADHAAR_CARD",
    "PASSPORT",
    "DRIVING_LICENSE",
    "VOTER_ID",
]);
/* =========================================
   ADDRESS DOCUMENT
========================================= */
exports.addressDocumentEnum = zod_1.z.enum([
    "AADHAAR_CARD",
    "PASSPORT",
    "UTILITY_BILL",
    "BANK_STATEMENT",
    "VOTER_ID",
    "DRIVING_LICENSE",
]);
/* =========================================
   CREATE KYC
========================================= */
exports.createKycSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(),
    kycType: exports.kycTypeEnum,
    fullName: zod_1.z.string()
        .min(3)
        .max(100),
    dob: zod_1.z.string(),
    panNo: zod_1.z.string()
        .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/),
    identityDocument: exports.identityDocumentEnum,
    identityDocumentUrl: zod_1.z.string().url(),
    addressDocument: exports.addressDocumentEnum,
    addressDocumentUrl: zod_1.z.string().url(),
    selfieUrl: zod_1.z.string().url().optional(),
});
/* =========================================
   UPDATE KYC
========================================= */
exports.updateKycSchema = exports.createKycSchema.partial();
/* =========================================
   VERIFY KYC
========================================= */
exports.verifyKycSchema = zod_1.z.object({
    kycId: zod_1.z.string().cuid(),
    status: zod_1.z.enum([
        "APPROVED",
        "REJECTED",
        "RESUBMISSION_REQUIRED",
    ]),
    remarks: zod_1.z.string()
        .max(1000)
        .optional(),
});
/* =========================================
   RESUBMIT KYC
========================================= */
exports.resubmitKycSchema = zod_1.z.object({
    kycId: zod_1.z.string().cuid(),
    identityDocumentUrl: zod_1.z.string().url().optional(),
    addressDocumentUrl: zod_1.z.string().url().optional(),
    selfieUrl: zod_1.z.string().url().optional(),
});
/* =========================================
   KYC FILTER
========================================= */
exports.kycFilterSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    userId: zod_1.z.string().cuid().optional(),
    kycType: exports.kycTypeEnum.optional(),
    status: exports.kycStatusEnum.optional(),
    page: zod_1.z.coerce.number()
        .default(1),
    limit: zod_1.z.coerce.number()
        .min(1)
        .max(100)
        .default(10),
});
/* =========================================
   KYC ANALYTICS
========================================= */
exports.kycAnalyticsSchema = zod_1.z.object({
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
});
/* =========================================
   BULK KYC APPROVAL
========================================= */
exports.bulkKycActionSchema = zod_1.z.object({
    kycIds: zod_1.z.array(zod_1.z.string().cuid()).min(1),
    status: zod_1.z.enum([
        "APPROVED",
        "REJECTED",
    ]),
    remarks: zod_1.z.string().optional(),
});
