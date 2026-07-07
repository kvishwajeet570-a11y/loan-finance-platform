import { z } from "zod";

/* =========================================
   FILE TYPE
========================================= */

export const fileTypeEnum = z.enum([
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

export const fileCategoryEnum = z.enum([
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

export const fileStatusEnum = z.enum([
  "UPLOADING",
  "ACTIVE",
  "ARCHIVED",
  "DELETED",
]);

/* =========================================
   UPLOAD FILE
========================================= */

export const uploadFileSchema = z.object({
  userId: z.string().cuid(),

  fileName: z.string()
    .min(1)
    .max(255),

  originalName: z.string()
    .min(1)
    .max(255),

  fileType: fileTypeEnum,

  category: fileCategoryEnum,

  fileUrl: z.string().url(),

  fileSize: z.number()
    .positive(),

  mimeType: z.string(),

  loanId: z.string()
    .cuid()
    .optional(),

  tags: z.array(
    z.string()
  ).optional(),
});

/* =========================================
   UPDATE FILE
========================================= */

export const updateFileSchema =
  z.object({
    fileName:
      z.string().optional(),

    category:
      fileCategoryEnum.optional(),

    tags:
      z.array(z.string())
      .optional(),
  });

/* =========================================
   FILE STATUS UPDATE
========================================= */

export const updateFileStatusSchema =
  z.object({
    fileId: z.string().cuid(),

    status:
      fileStatusEnum,
  });

/* =========================================
   SHARE FILE
========================================= */

export const shareFileSchema =
  z.object({
    fileId: z.string().cuid(),

    email: z.email(),

    expiryHours:
      z.number()
      .positive()
      .optional(),
  });

/* =========================================
   FILE FILTER
========================================= */

export const fileFilterSchema =
  z.object({
    search: z.string().optional(),

    userId:
      z.string().cuid().optional(),

    category:
      fileCategoryEnum.optional(),

    fileType:
      fileTypeEnum.optional(),

    status:
      fileStatusEnum.optional(),

    page:
      z.coerce.number()
      .default(1),

    limit:
      z.coerce.number()
      .min(1)
      .max(100)
      .default(10),
  });

/* =========================================
   BULK DELETE FILES
========================================= */

export const bulkDeleteFileSchema =
  z.object({
    fileIds: z.array(
      z.string().cuid()
    ).min(1),
  });

/* =========================================
   FILE DOWNLOAD
========================================= */

export const downloadFileSchema =
  z.object({
    fileId: z.string().cuid(),
  });

/* =========================================
   TYPES
========================================= */

export type UploadFileDto =
  z.infer<typeof uploadFileSchema>;

export type UpdateFileDto =
  z.infer<typeof updateFileSchema>;

export type UpdateFileStatusDto =
  z.infer<
    typeof updateFileStatusSchema
  >;

export type ShareFileDto =
  z.infer<typeof shareFileSchema>;

export type FileFilterDto =
  z.infer<typeof fileFilterSchema>;

export type BulkDeleteFileDto =
  z.infer<
    typeof bulkDeleteFileSchema
  >;

export type DownloadFileDto =
  z.infer<typeof downloadFileSchema>;