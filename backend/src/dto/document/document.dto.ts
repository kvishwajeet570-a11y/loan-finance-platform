import { z } from "zod";

/* =========================================
   DOCUMENT TYPE
========================================= */

export const documentTypeEnum = z.enum([
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

export const documentStatusEnum = z.enum([
  "PENDING",
  "UNDER_REVIEW",
  "APPROVED",
  "REJECTED",
  "EXPIRED",
]);

/* =========================================
   UPLOAD DOCUMENT
========================================= */

export const uploadDocumentSchema =
  z.object({
    userId: z.string().cuid(),

    loanId: z.string().cuid().optional(),

    documentType: documentTypeEnum,

    documentName: z.string()
      .min(2)
      .max(200),

    documentUrl: z.string().url(),

    documentNumber:
      z.string().optional(),

    expiryDate:
      z.string().optional(),
  });

/* =========================================
   UPDATE DOCUMENT
========================================= */

export const updateDocumentSchema =
  z.object({
    documentName:
      z.string().optional(),

    documentUrl:
      z.string().url().optional(),

    expiryDate:
      z.string().optional(),
  });

/* =========================================
   VERIFY DOCUMENT
========================================= */

export const verifyDocumentSchema =
  z.object({
    documentId: z.string().cuid(),

    status: z.enum([
      "APPROVED",
      "REJECTED",
    ]),

    remarks: z.string()
      .max(500)
      .optional(),
  });

/* =========================================
   REJECT DOCUMENT
========================================= */

export const rejectDocumentSchema =
  z.object({
    documentId: z.string().cuid(),

    reason: z.string()
      .min(5)
      .max(500),
  });

/* =========================================
   DOCUMENT FILTER
========================================= */

export const documentFilterSchema =
  z.object({
    search: z.string().optional(),

    userId:
      z.string().cuid().optional(),

    loanId:
      z.string().cuid().optional(),

    documentType:
      documentTypeEnum.optional(),

    status:
      documentStatusEnum.optional(),

    page: z.coerce.number()
      .default(1),

    limit: z.coerce.number()
      .min(1)
      .max(100)
      .default(10),
  });

/* =========================================
   DOCUMENT EXPIRY CHECK
========================================= */

export const documentExpirySchema =
  z.object({
    documentId: z.string().cuid(),

    expiryDate: z.string(),
  });

/* =========================================
   BULK DOCUMENT VERIFY
========================================= */

export const bulkDocumentVerifySchema =
  z.object({
    documentIds: z.array(
      z.string().cuid()
    ),

    status: z.enum([
      "APPROVED",
      "REJECTED",
    ]),

    remarks:
      z.string().optional(),
  });

/* =========================================
   EXPORT TYPES
========================================= */

export type UploadDocumentDto =
  z.infer<typeof uploadDocumentSchema>;

export type UpdateDocumentDto =
  z.infer<typeof updateDocumentSchema>;

export type VerifyDocumentDto =
  z.infer<typeof verifyDocumentSchema>;

export type RejectDocumentDto =
  z.infer<typeof rejectDocumentSchema>;

export type DocumentFilterDto =
  z.infer<typeof documentFilterSchema>;

export type DocumentExpiryDto =
  z.infer<typeof documentExpirySchema>;

export type BulkDocumentVerifyDto =
  z.infer<
    typeof bulkDocumentVerifySchema
  >;