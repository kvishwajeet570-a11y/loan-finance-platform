"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadFileSchema = exports.bulkDeleteFileSchema = exports.fileFilterSchema = exports.shareFileSchema = exports.updateFileStatusSchema = exports.updateFileSchema = exports.uploadFileSchema = exports.fileStatusEnum = exports.fileCategoryEnum = exports.fileTypeEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   FILE TYPE
========================================= */
exports.fileTypeEnum = zod_1.z.enum([
    "IMAGE",
    "PDF",
    "DOCUMENT",
    "EXCEL",
    "CSV",
    "ZIP",
    "VIDEO",
    "AUDIO",
    "OTHER",
]);
/* =========================================
   FILE CATEGORY
========================================= */
exports.fileCategoryEnum = zod_1.z.enum([
    "PROFILE",
    "KYC",
    "LOAN_DOCUMENT",
    "BANK_STATEMENT",
    "SALARY_SLIP",
    "PROPERTY_DOCUMENT",
    "PAN_CARD",
    "AADHAAR_CARD",
    "INSURANCE",
    "FASTAG",
    "REPORT",
    "EXPORT",
    "MARKETING",
    "OTHER",
]);
/* =========================================
   FILE STATUS
========================================= */
exports.fileStatusEnum = zod_1.z.enum([
    "UPLOADING",
    "ACTIVE",
    "ARCHIVED",
    "DELETED",
]);
/* =========================================
   UPLOAD FILE
========================================= */
exports.uploadFileSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(),
    fileName: zod_1.z.string()
        .min(1)
        .max(255),
    originalName: zod_1.z.string()
        .min(1)
        .max(255),
    fileType: exports.fileTypeEnum,
    category: exports.fileCategoryEnum,
    fileUrl: zod_1.z.string().url(),
    fileSize: zod_1.z.number()
        .positive(),
    mimeType: zod_1.z.string(),
    loanId: zod_1.z.string()
        .cuid()
        .optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
});
/* =========================================
   UPDATE FILE
========================================= */
exports.updateFileSchema = zod_1.z.object({
    fileName: zod_1.z.string().optional(),
    category: exports.fileCategoryEnum.optional(),
    tags: zod_1.z.array(zod_1.z.string())
        .optional(),
});
/* =========================================
   FILE STATUS UPDATE
========================================= */
exports.updateFileStatusSchema = zod_1.z.object({
    fileId: zod_1.z.string().cuid(),
    status: exports.fileStatusEnum,
});
/* =========================================
   SHARE FILE
========================================= */
exports.shareFileSchema = zod_1.z.object({
    fileId: zod_1.z.string().cuid(),
    email: zod_1.z.email(),
    expiryHours: zod_1.z.number()
        .positive()
        .optional(),
});
/* =========================================
   FILE FILTER
========================================= */
exports.fileFilterSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    userId: zod_1.z.string().cuid().optional(),
    category: exports.fileCategoryEnum.optional(),
    fileType: exports.fileTypeEnum.optional(),
    status: exports.fileStatusEnum.optional(),
    page: zod_1.z.coerce.number()
        .default(1),
    limit: zod_1.z.coerce.number()
        .min(1)
        .max(100)
        .default(10),
});
/* =========================================
   BULK DELETE FILES
========================================= */
exports.bulkDeleteFileSchema = zod_1.z.object({
    fileIds: zod_1.z.array(zod_1.z.string().cuid()).min(1),
});
/* =========================================
   FILE DOWNLOAD
========================================= */
exports.downloadFileSchema = zod_1.z.object({
    fileId: zod_1.z.string().cuid(),
});
