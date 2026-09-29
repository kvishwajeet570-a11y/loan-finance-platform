"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDownloadUrlSchema = exports.generateUploadUrlSchema = exports.uploadAnalyticsSchema = exports.uploadFilterSchema = exports.previewUploadSchema = exports.downloadUploadSchema = exports.bulkDeleteUploadsSchema = exports.bulkRejectUploadsSchema = exports.bulkApproveUploadsSchema = exports.deleteUploadSchema = exports.restoreUploadSchema = exports.rejectUploadSchema = exports.approveUploadSchema = exports.verifyUploadSchema = exports.updateUploadSchema = exports.uploadFileSchema = exports.storageProviderEnum = exports.uploadStatusEnum = exports.uploadCategoryEnum = exports.uploadFileTypeEnum = void 0;
const zod_1 = require("zod");
/* ===========================================================
   FILE TYPE
=========================================================== */
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
/* ===========================================================
   FILE CATEGORY
=========================================================== */
exports.uploadCategoryEnum = zod_1.z.enum([
    "KYC",
    "LOAN",
    "BANK",
    "PROFILE",
    "CUSTOMER",
    "PARTNER",
    "DSA",
    "INSURANCE",
    "FASTAG",
    "RECHARGE",
    "INVESTMENT",
    "MEDIA",
    "SYSTEM",
    "OTHER",
]);
/* ===========================================================
   FILE STATUS
=========================================================== */
exports.uploadStatusEnum = zod_1.z.enum([
    "PENDING",
    "APPROVED",
    "REJECTED",
    "DELETED",
    "ACTIVE",
    "EXPIRED",
]);
/* ===========================================================
   STORAGE PROVIDER
=========================================================== */
exports.storageProviderEnum = zod_1.z.enum([
    "LOCAL",
    "AWS_S3",
    "CLOUDINARY",
    "AZURE_BLOB",
    "GOOGLE_CLOUD",
]);
/* ===========================================================
   UPLOAD FILE
=========================================================== */
exports.uploadFileSchema = zod_1.z.object({
    uploadedBy: zod_1.z.string().optional(),
    userId: zod_1.z.string().cuid().optional(),
    customerId: zod_1.z.string().optional(),
    dsaId: zod_1.z.string().optional(),
    partnerId: zod_1.z.string().optional(),
    fileName: zod_1.z
        .string()
        .min(2)
        .max(255),
    originalName: zod_1.z
        .string()
        .max(255)
        .optional(),
    fileUrl: zod_1.z
        .string()
        .min(1),
    filePath: zod_1.z
        .string()
        .optional(),
    fileKey: zod_1.z
        .string()
        .optional(),
    fileType: exports.uploadFileTypeEnum.optional(),
    mimeType: zod_1.z.string().optional(),
    extension: zod_1.z.string().optional(),
    fileSize: zod_1.z.number().int().positive().optional(),
    category: exports.uploadCategoryEnum.optional(),
    documentType: zod_1.z.string().optional(),
    documentNumber: zod_1.z.string().optional(),
    expiryDate: zod_1.z.coerce.date().optional(),
    storageProvider: exports.storageProviderEnum.optional(),
    bucketName: zod_1.z.string().optional(),
    storagePath: zod_1.z.string().optional(),
    checksum: zod_1.z.string().optional(),
    uploadedIp: zod_1.z.string().optional(),
    deviceInfo: zod_1.z.string().optional(),
    platform: zod_1.z.string().optional(),
});
/* ===========================================================
   UPDATE FILE
=========================================================== */
exports.updateUploadSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
    fileName: zod_1.z
        .string()
        .min(2)
        .max(255)
        .optional(),
    originalName: zod_1.z
        .string()
        .max(255)
        .optional(),
    category: exports.uploadCategoryEnum.optional(),
    documentType: zod_1.z.string().optional(),
    documentNumber: zod_1.z.string().optional(),
    expiryDate: zod_1.z.coerce.date().optional(),
    storageProvider: exports.storageProviderEnum.optional(),
    bucketName: zod_1.z.string().optional(),
    storagePath: zod_1.z.string().optional(),
});
/* ===========================================================
   VERIFY UPLOAD
=========================================================== */
exports.verifyUploadSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
    verifiedBy: zod_1.z.string().optional(),
    isVerified: zod_1.z.boolean().default(true),
});
/* ===========================================================
   APPROVE UPLOAD
=========================================================== */
exports.approveUploadSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
    approvedBy: zod_1.z.string().optional(),
    status: zod_1.z.literal("APPROVED").default("APPROVED"),
    isApproved: zod_1.z.boolean().default(true),
});
/* ===========================================================
   REJECT UPLOAD
=========================================================== */
exports.rejectUploadSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
    rejectedBy: zod_1.z.string().optional(),
    rejectReason: zod_1.z
        .string()
        .min(2)
        .max(1000),
    status: zod_1.z.literal("REJECTED").default("REJECTED"),
});
/* ===========================================================
   RESTORE UPLOAD
=========================================================== */
exports.restoreUploadSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
    isDeleted: zod_1.z.boolean().default(false),
    status: zod_1.z.literal("ACTIVE").default("ACTIVE"),
});
/* ===========================================================
   DELETE UPLOAD
=========================================================== */
exports.deleteUploadSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
});
/* ===========================================================
   BULK APPROVE
=========================================================== */
exports.bulkApproveUploadsSchema = zod_1.z.object({
    ids: zod_1.z
        .array(zod_1.z.string().cuid())
        .min(1),
    approvedBy: zod_1.z.string().optional(),
});
/* ===========================================================
   BULK REJECT
=========================================================== */
exports.bulkRejectUploadsSchema = zod_1.z.object({
    ids: zod_1.z
        .array(zod_1.z.string().cuid())
        .min(1),
    rejectedBy: zod_1.z.string().optional(),
    rejectReason: zod_1.z
        .string()
        .min(2)
        .max(1000),
});
/* ===========================================================
   BULK DELETE
=========================================================== */
exports.bulkDeleteUploadsSchema = zod_1.z.object({
    ids: zod_1.z
        .array(zod_1.z.string().cuid())
        .min(1),
});
/* ===========================================================
   DOWNLOAD FILE
=========================================================== */
exports.downloadUploadSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
});
/* ===========================================================
   PREVIEW FILE
=========================================================== */
exports.previewUploadSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
});
/* ===========================================================
   UPLOAD FILTER
=========================================================== */
exports.uploadFilterSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid().optional(),
    customerId: zod_1.z.string().optional(),
    dsaId: zod_1.z.string().optional(),
    partnerId: zod_1.z.string().optional(),
    uploadedBy: zod_1.z.string().optional(),
    category: exports.uploadCategoryEnum.optional(),
    fileType: exports.uploadFileTypeEnum.optional(),
    status: exports.uploadStatusEnum.optional(),
    documentType: zod_1.z.string().optional(),
    search: zod_1.z.string().optional(),
    startDate: zod_1.z.coerce.date().optional(),
    endDate: zod_1.z.coerce.date().optional(),
    page: zod_1.z.coerce
        .number()
        .min(1)
        .default(1),
    limit: zod_1.z.coerce
        .number()
        .min(1)
        .max(100)
        .default(20),
});
/* ===========================================================
   UPLOAD ANALYTICS
=========================================================== */
exports.uploadAnalyticsSchema = zod_1.z.object({
    startDate: zod_1.z.coerce.date().optional(),
    endDate: zod_1.z.coerce.date().optional(),
    category: exports.uploadCategoryEnum.optional(),
    documentType: zod_1.z.string().optional(),
});
/* ===========================================================
   GENERATE UPLOAD URL
=========================================================== */
exports.generateUploadUrlSchema = zod_1.z.object({
    fileName: zod_1.z.string().min(1),
    mimeType: zod_1.z.string().optional(),
    category: exports.uploadCategoryEnum.optional(),
});
/* ===========================================================
   GENERATE DOWNLOAD URL
=========================================================== */
exports.generateDownloadUrlSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
});
