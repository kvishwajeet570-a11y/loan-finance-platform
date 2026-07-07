"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadAnalyticsSchema = exports.uploadFilterSchema = exports.bulkDeleteFileSchema = exports.fileExpirySchema = exports.shareFileSchema = exports.rejectDocumentSchema = exports.verifyDocumentSchema = exports.updateFileSchema = exports.uploadFileSchema = exports.storageProviderEnum = exports.uploadStatusEnum = exports.uploadCategoryEnum = exports.uploadFileTypeEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   FILE TYPE
========================================= */
exports.uploadFileTypeEnum = zod_1.z.enum([
    "PAN_CARD",
    "AADHAAR_CARD",
    "PASSPORT",
    "VOTER_ID",
    "DRIVING_LICENSE",
    "BANK_STATEMENT",
    "SALARY_SLIP",
    "ITR",
    "GST_CERTIFICATE",
    "BUSINESS_PROOF",
    "PROPERTY_DOCUMENT",
    "PROFILE_PHOTO",
    "SIGNATURE",
    "LOAN_DOCUMENT",
    "INSURANCE_DOCUMENT",
    "FASTAG_DOCUMENT",
    "AGREEMENT",
    "INVOICE",
    "MEDIA",
    "OTHER",
]);
/* =========================================
   FILE CATEGORY
========================================= */
exports.uploadCategoryEnum = zod_1.z.enum([
    "KYC",
    "LOAN",
    "CUSTOMER",
    "PARTNER",
    "DSA",
    "INSURANCE",
    "FASTAG",
    "RECHARGE",
    "INVESTMENT",
    "PROFILE",
    "MEDIA",
    "SYSTEM",
]);
/* =========================================
   FILE STATUS
========================================= */
exports.uploadStatusEnum = zod_1.z.enum([
    "UPLOADING",
    "UPLOADED",
    "VERIFIED",
    "REJECTED",
    "EXPIRED",
    "DELETED",
]);
/* =========================================
   STORAGE PROVIDER
========================================= */
exports.storageProviderEnum = zod_1.z.enum([
    "LOCAL",
    "AWS_S3",
    "CLOUDINARY",
    "AZURE_BLOB",
    "GOOGLE_CLOUD",
]);
/* =========================================
   UPLOAD FILE
========================================= */
exports.uploadFileSchema = zod_1.z.object({
    uploadedBy: zod_1.z.string().cuid(),
    fileName: zod_1.z.string()
        .min(2)
        .max(255),
    originalName: zod_1.z.string()
        .min(2)
        .max(255),
    fileType: exports.uploadFileTypeEnum,
    category: exports.uploadCategoryEnum,
    mimeType: zod_1.z.string(),
    fileSize: zod_1.z.number().positive(),
    fileUrl: zod_1.z.string().url(),
    storageProvider: exports.storageProviderEnum,
    remarks: zod_1.z.string()
        .max(1000)
        .optional(),
});
/* =========================================
   UPDATE FILE
========================================= */
exports.updateFileSchema = zod_1.z.object({
    fileId: zod_1.z.string().cuid(),
    fileName: zod_1.z.string()
        .min(2)
        .max(255)
        .optional(),
    remarks: zod_1.z.string()
        .max(1000)
        .optional(),
});
/* =========================================
   VERIFY DOCUMENT
========================================= */
exports.verifyDocumentSchema = zod_1.z.object({
    fileId: zod_1.z.string().cuid(),
    verifiedBy: zod_1.z.string().cuid(),
    remarks: zod_1.z.string()
        .max(1000)
        .optional(),
});
/* =========================================
   REJECT DOCUMENT
========================================= */
exports.rejectDocumentSchema = zod_1.z.object({
    fileId: zod_1.z.string().cuid(),
    reason: zod_1.z.string()
        .min(5)
        .max(1000),
});
/* =========================================
   SHARE FILE
========================================= */
exports.shareFileSchema = zod_1.z.object({
    fileId: zod_1.z.string().cuid(),
    sharedWith: zod_1.z.string().cuid(),
    expiryDate: zod_1.z.string()
        .optional(),
});
/* =========================================
   FILE EXPIRY
========================================= */
exports.fileExpirySchema = zod_1.z.object({
    fileId: zod_1.z.string().cuid(),
    expiryDate: zod_1.z.string(),
});
/* =========================================
   BULK DELETE
========================================= */
exports.bulkDeleteFileSchema = zod_1.z.object({
    fileIds: zod_1.z.array(zod_1.z.string().cuid()).min(1),
});
/* =========================================
   FILE FILTER
========================================= */
exports.uploadFilterSchema = zod_1.z.object({
    uploadedBy: zod_1.z.string()
        .cuid()
        .optional(),
    category: exports.uploadCategoryEnum
        .optional(),
    fileType: exports.uploadFileTypeEnum
        .optional(),
    status: exports.uploadStatusEnum
        .optional(),
    startDate: zod_1.z.string()
        .optional(),
    endDate: zod_1.z.string()
        .optional(),
    page: zod_1.z.coerce.number()
        .default(1),
    limit: zod_1.z.coerce.number()
        .min(1)
        .max(100)
        .default(20),
});
/* =========================================
   FILE ANALYTICS
========================================= */
exports.uploadAnalyticsSchema = zod_1.z.object({
    startDate: zod_1.z.string(),
    endDate: zod_1.z.string(),
    category: exports.uploadCategoryEnum
        .optional(),
});
