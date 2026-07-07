"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkDocumentVerifySchema = exports.documentExpirySchema = exports.documentFilterSchema = exports.rejectDocumentSchema = exports.verifyDocumentSchema = exports.updateDocumentSchema = exports.uploadDocumentSchema = exports.documentStatusEnum = exports.documentTypeEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   DOCUMENT TYPE
========================================= */
exports.documentTypeEnum = zod_1.z.enum([
    "PAN_CARD",
    "AADHAAR_CARD",
    "VOTER_ID",
    "DRIVING_LICENSE",
    "PASSPORT",
    "BANK_STATEMENT",
    "SALARY_SLIP",
    "ITR",
    "GST_CERTIFICATE",
    "BUSINESS_PROOF",
    "PROPERTY_DOCUMENT",
    "PHOTO",
    "SIGNATURE",
    "OTHER",
]);
/* =========================================
   DOCUMENT STATUS
========================================= */
exports.documentStatusEnum = zod_1.z.enum([
    "PENDING",
    "UNDER_REVIEW",
    "APPROVED",
    "REJECTED",
    "EXPIRED",
]);
/* =========================================
   UPLOAD DOCUMENT
========================================= */
exports.uploadDocumentSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(),
    loanId: zod_1.z.string().cuid().optional(),
    documentType: exports.documentTypeEnum,
    documentName: zod_1.z.string()
        .min(2)
        .max(200),
    documentUrl: zod_1.z.string().url(),
    documentNumber: zod_1.z.string().optional(),
    expiryDate: zod_1.z.string().optional(),
});
/* =========================================
   UPDATE DOCUMENT
========================================= */
exports.updateDocumentSchema = zod_1.z.object({
    documentName: zod_1.z.string().optional(),
    documentUrl: zod_1.z.string().url().optional(),
    expiryDate: zod_1.z.string().optional(),
});
/* =========================================
   VERIFY DOCUMENT
========================================= */
exports.verifyDocumentSchema = zod_1.z.object({
    documentId: zod_1.z.string().cuid(),
    status: zod_1.z.enum([
        "APPROVED",
        "REJECTED",
    ]),
    remarks: zod_1.z.string()
        .max(500)
        .optional(),
});
/* =========================================
   REJECT DOCUMENT
========================================= */
exports.rejectDocumentSchema = zod_1.z.object({
    documentId: zod_1.z.string().cuid(),
    reason: zod_1.z.string()
        .min(5)
        .max(500),
});
/* =========================================
   DOCUMENT FILTER
========================================= */
exports.documentFilterSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    userId: zod_1.z.string().cuid().optional(),
    loanId: zod_1.z.string().cuid().optional(),
    documentType: exports.documentTypeEnum.optional(),
    status: exports.documentStatusEnum.optional(),
    page: zod_1.z.coerce.number()
        .default(1),
    limit: zod_1.z.coerce.number()
        .min(1)
        .max(100)
        .default(10),
});
/* =========================================
   DOCUMENT EXPIRY CHECK
========================================= */
exports.documentExpirySchema = zod_1.z.object({
    documentId: zod_1.z.string().cuid(),
    expiryDate: zod_1.z.string(),
});
/* =========================================
   BULK DOCUMENT VERIFY
========================================= */
exports.bulkDocumentVerifySchema = zod_1.z.object({
    documentIds: zod_1.z.array(zod_1.z.string().cuid()),
    status: zod_1.z.enum([
        "APPROVED",
        "REJECTED",
    ]),
    remarks: zod_1.z.string().optional(),
});
