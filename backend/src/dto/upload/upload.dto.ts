import { z } from "zod";

/* =========================================
   FILE TYPE
========================================= */

export const uploadFileTypeEnum = z.enum([
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

export const uploadCategoryEnum = z.enum([
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

export const uploadStatusEnum = z.enum([
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

export const storageProviderEnum = z.enum([
  "LOCAL",
  "AWS_S3",
  "CLOUDINARY",
  "AZURE_BLOB",
  "GOOGLE_CLOUD",
]);

/* =========================================
   UPLOAD FILE
========================================= */

export const uploadFileSchema = z.object({
  uploadedBy: z.string().cuid(),

  fileName: z.string()
    .min(2)
    .max(255),

  originalName: z.string()
    .min(2)
    .max(255),

  fileType: uploadFileTypeEnum,

  category: uploadCategoryEnum,

  mimeType: z.string(),

  fileSize: z.number().positive(),

  fileUrl: z.string().url(),

  storageProvider:
    storageProviderEnum,

  remarks:
    z.string()
    .max(1000)
    .optional(),
});

/* =========================================
   UPDATE FILE
========================================= */

export const updateFileSchema = z.object({
  fileId:
    z.string().cuid(),

  fileName:
    z.string()
    .min(2)
    .max(255)
    .optional(),

  remarks:
    z.string()
    .max(1000)
    .optional(),
});

/* =========================================
   VERIFY DOCUMENT
========================================= */

export const verifyDocumentSchema =
  z.object({
    fileId:
      z.string().cuid(),

    verifiedBy:
      z.string().cuid(),

    remarks:
      z.string()
      .max(1000)
      .optional(),
  });

/* =========================================
   REJECT DOCUMENT
========================================= */

export const rejectDocumentSchema =
  z.object({
    fileId:
      z.string().cuid(),

    reason:
      z.string()
      .min(5)
      .max(1000),
  });

/* =========================================
   SHARE FILE
========================================= */

export const shareFileSchema =
  z.object({
    fileId:
      z.string().cuid(),

    sharedWith:
      z.string().cuid(),

    expiryDate:
      z.string()
      .optional(),
  });

/* =========================================
   FILE EXPIRY
========================================= */

export const fileExpirySchema =
  z.object({
    fileId:
      z.string().cuid(),

    expiryDate:
      z.string(),
  });

/* =========================================
   BULK DELETE
========================================= */

export const bulkDeleteFileSchema =
  z.object({
    fileIds:
      z.array(
        z.string().cuid()
      ).min(1),
  });

/* =========================================
   FILE FILTER
========================================= */

export const uploadFilterSchema =
  z.object({
    uploadedBy:
      z.string()
      .cuid()
      .optional(),

    category:
      uploadCategoryEnum
      .optional(),

    fileType:
      uploadFileTypeEnum
      .optional(),

    status:
      uploadStatusEnum
      .optional(),

    startDate:
      z.string()
      .optional(),

    endDate:
      z.string()
      .optional(),

    page:
      z.coerce.number()
      .default(1),

    limit:
      z.coerce.number()
      .min(1)
      .max(100)
      .default(20),
  });

/* =========================================
   FILE ANALYTICS
========================================= */

export const uploadAnalyticsSchema =
  z.object({
    startDate:
      z.string(),

    endDate:
      z.string(),

    category:
      uploadCategoryEnum
      .optional(),
  });

/* =========================================
   TYPES
========================================= */

export type UploadFileDto =
  z.infer<typeof uploadFileSchema>;

export type UpdateFileDto =
  z.infer<typeof updateFileSchema>;

export type VerifyDocumentDto =
  z.infer<
    typeof verifyDocumentSchema
  >;

export type RejectDocumentDto =
  z.infer<
    typeof rejectDocumentSchema
  >;

export type ShareFileDto =
  z.infer<
    typeof shareFileSchema
  >;

export type FileExpiryDto =
  z.infer<
    typeof fileExpirySchema
  >;

export type BulkDeleteFileDto =
  z.infer<
    typeof bulkDeleteFileSchema
  >;

export type UploadFilterDto =
  z.infer<
    typeof uploadFilterSchema
  >;

export type UploadAnalyticsDto =
  z.infer<
    typeof uploadAnalyticsSchema
  >;