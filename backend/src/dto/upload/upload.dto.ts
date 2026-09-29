import { z } from "zod";

/* ===========================================================
   FILE TYPE
=========================================================== */

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

/* ===========================================================
   FILE CATEGORY
=========================================================== */

export const uploadCategoryEnum = z.enum([
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

export const uploadStatusEnum = z.enum([
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

export const storageProviderEnum = z.enum([
  "LOCAL",
  "AWS_S3",
  "CLOUDINARY",
  "AZURE_BLOB",
  "GOOGLE_CLOUD",
]);

/* ===========================================================
   UPLOAD FILE
=========================================================== */

export const uploadFileSchema = z.object({
  uploadedBy: z.string().optional(),

  userId: z.string().cuid().optional(),

  customerId: z.string().optional(),

  dsaId: z.string().optional(),

  partnerId: z.string().optional(),

  fileName: z
    .string()
    .min(2)
    .max(255),

  originalName: z
    .string()
    .max(255)
    .optional(),

  fileUrl: z
    .string()
    .min(1),

  filePath: z
    .string()
    .optional(),

  fileKey: z
    .string()
    .optional(),

  fileType:
    uploadFileTypeEnum.optional(),

  mimeType:
    z.string().optional(),

  extension:
    z.string().optional(),

  fileSize:
    z.number().int().positive().optional(),

  category:
    uploadCategoryEnum.optional(),

  documentType:
    z.string().optional(),

  documentNumber:
    z.string().optional(),

  expiryDate:
    z.coerce.date().optional(),

  storageProvider:
    storageProviderEnum.optional(),

  bucketName:
    z.string().optional(),

  storagePath:
    z.string().optional(),

  checksum:
    z.string().optional(),

  uploadedIp:
    z.string().optional(),

  deviceInfo:
    z.string().optional(),

  platform:
    z.string().optional(),
});

/* ===========================================================
   UPDATE FILE
=========================================================== */

export const updateUploadSchema = z.object({
  id: z.string().cuid(),

  fileName: z
    .string()
    .min(2)
    .max(255)
    .optional(),

  originalName: z
    .string()
    .max(255)
    .optional(),

  category:
    uploadCategoryEnum.optional(),

  documentType:
    z.string().optional(),

  documentNumber:
    z.string().optional(),

  expiryDate:
    z.coerce.date().optional(),

  storageProvider:
    storageProviderEnum.optional(),

  bucketName:
    z.string().optional(),

  storagePath:
    z.string().optional(),
});
/* ===========================================================
   VERIFY UPLOAD
=========================================================== */

export const verifyUploadSchema = z.object({
  id: z.string().cuid(),

  verifiedBy: z.string().optional(),

  isVerified: z.boolean().default(true),
});

/* ===========================================================
   APPROVE UPLOAD
=========================================================== */

export const approveUploadSchema = z.object({
  id: z.string().cuid(),

  approvedBy: z.string().optional(),

  status: z.literal("APPROVED").default("APPROVED"),

  isApproved: z.boolean().default(true),
});

/* ===========================================================
   REJECT UPLOAD
=========================================================== */

export const rejectUploadSchema = z.object({
  id: z.string().cuid(),

  rejectedBy: z.string().optional(),

  rejectReason: z
    .string()
    .min(2)
    .max(1000),

  status: z.literal("REJECTED").default("REJECTED"),
});

/* ===========================================================
   RESTORE UPLOAD
=========================================================== */

export const restoreUploadSchema = z.object({
  id: z.string().cuid(),

  isDeleted: z.boolean().default(false),

  status: z.literal("ACTIVE").default("ACTIVE"),
});

/* ===========================================================
   DELETE UPLOAD
=========================================================== */

export const deleteUploadSchema = z.object({
  id: z.string().cuid(),
});

/* ===========================================================
   BULK APPROVE
=========================================================== */

export const bulkApproveUploadsSchema = z.object({
  ids: z
    .array(z.string().cuid())
    .min(1),

  approvedBy:
    z.string().optional(),
});

/* ===========================================================
   BULK REJECT
=========================================================== */

export const bulkRejectUploadsSchema = z.object({
  ids: z
    .array(z.string().cuid())
    .min(1),

  rejectedBy:
    z.string().optional(),

  rejectReason: z
    .string()
    .min(2)
    .max(1000),
});

/* ===========================================================
   BULK DELETE
=========================================================== */

export const bulkDeleteUploadsSchema = z.object({
  ids: z
    .array(z.string().cuid())
    .min(1),
});

/* ===========================================================
   DOWNLOAD FILE
=========================================================== */

export const downloadUploadSchema = z.object({
  id: z.string().cuid(),
});

/* ===========================================================
   PREVIEW FILE
=========================================================== */

export const previewUploadSchema = z.object({
  id: z.string().cuid(),
});
/* ===========================================================
   UPLOAD FILTER
=========================================================== */

export const uploadFilterSchema = z.object({
  userId: z.string().cuid().optional(),

  customerId: z.string().optional(),

  dsaId: z.string().optional(),

  partnerId: z.string().optional(),

  uploadedBy: z.string().optional(),

  category: uploadCategoryEnum.optional(),

  fileType: uploadFileTypeEnum.optional(),

  status: uploadStatusEnum.optional(),

  documentType: z.string().optional(),

  search: z.string().optional(),

  startDate: z.coerce.date().optional(),

  endDate: z.coerce.date().optional(),

  page: z.coerce
    .number()
    .min(1)
    .default(1),

  limit: z.coerce
    .number()
    .min(1)
    .max(100)
    .default(20),
});

/* ===========================================================
   UPLOAD ANALYTICS
=========================================================== */

export const uploadAnalyticsSchema = z.object({
  startDate: z.coerce.date().optional(),

  endDate: z.coerce.date().optional(),

  category: uploadCategoryEnum.optional(),

  documentType: z.string().optional(),
});

/* ===========================================================
   GENERATE UPLOAD URL
=========================================================== */

export const generateUploadUrlSchema = z.object({
  fileName: z.string().min(1),

  mimeType: z.string().optional(),

  category: uploadCategoryEnum.optional(),
});

/* ===========================================================
   GENERATE DOWNLOAD URL
=========================================================== */

export const generateDownloadUrlSchema = z.object({
  id: z.string().cuid(),
});

/* ===========================================================
   TYPES
=========================================================== */

export type UploadFileDto =
  z.infer<typeof uploadFileSchema>;

export type UpdateUploadDto =
  z.infer<typeof updateUploadSchema>;

export type VerifyUploadDto =
  z.infer<typeof verifyUploadSchema>;

export type ApproveUploadDto =
  z.infer<typeof approveUploadSchema>;

export type RejectUploadDto =
  z.infer<typeof rejectUploadSchema>;

export type RestoreUploadDto =
  z.infer<typeof restoreUploadSchema>;

export type DeleteUploadDto =
  z.infer<typeof deleteUploadSchema>;

export type BulkApproveUploadsDto =
  z.infer<typeof bulkApproveUploadsSchema>;

export type BulkRejectUploadsDto =
  z.infer<typeof bulkRejectUploadsSchema>;

export type BulkDeleteUploadsDto =
  z.infer<typeof bulkDeleteUploadsSchema>;

export type DownloadUploadDto =
  z.infer<typeof downloadUploadSchema>;

export type PreviewUploadDto =
  z.infer<typeof previewUploadSchema>;

export type UploadFilterDto =
  z.infer<typeof uploadFilterSchema>;

export type UploadAnalyticsDto =
  z.infer<typeof uploadAnalyticsSchema>;

export type GenerateUploadUrlDto =
  z.infer<typeof generateUploadUrlSchema>;

export type GenerateDownloadUrlDto =
  z.infer<typeof generateDownloadUrlSchema>;