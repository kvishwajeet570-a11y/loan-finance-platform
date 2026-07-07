import { z } from "zod";

/* =========================================
   KYC STATUS
========================================= */

export const kycStatusEnum = z.enum([
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

export const kycTypeEnum = z.enum([
  "CUSTOMER",
  "DSA",
  "PARTNER",
  "EMPLOYEE",
]);

/* =========================================
   IDENTITY DOCUMENT
========================================= */

export const identityDocumentEnum =
  z.enum([
    "PAN_CARD",
    "AADHAAR_CARD",
    "PASSPORT",
    "DRIVING_LICENSE",
    "VOTER_ID",
  ]);

/* =========================================
   ADDRESS DOCUMENT
========================================= */

export const addressDocumentEnum =
  z.enum([
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

export const createKycSchema =
  z.object({
    userId: z.string().cuid(),

    kycType: kycTypeEnum,

    fullName: z.string()
      .min(3)
      .max(100),

    dob: z.string(),

    panNo: z.string()
      .regex(
        /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
      ),

    identityDocument:
      identityDocumentEnum,

    identityDocumentUrl:
      z.string().url(),

    addressDocument:
      addressDocumentEnum,

    addressDocumentUrl:
      z.string().url(),

    selfieUrl:
      z.string().url().optional(),
  });

/* =========================================
   UPDATE KYC
========================================= */

export const updateKycSchema =
  createKycSchema.partial();

/* =========================================
   VERIFY KYC
========================================= */

export const verifyKycSchema =
  z.object({
    kycId: z.string().cuid(),

    status: z.enum([
      "APPROVED",
      "REJECTED",
      "RESUBMISSION_REQUIRED",
    ]),

    remarks: z.string()
      .max(1000)
      .optional(),
  });

/* =========================================
   RESUBMIT KYC
========================================= */

export const resubmitKycSchema =
  z.object({
    kycId: z.string().cuid(),

    identityDocumentUrl:
      z.string().url().optional(),

    addressDocumentUrl:
      z.string().url().optional(),

    selfieUrl:
      z.string().url().optional(),
  });

/* =========================================
   KYC FILTER
========================================= */

export const kycFilterSchema =
  z.object({
    search: z.string().optional(),

    userId:
      z.string().cuid().optional(),

    kycType:
      kycTypeEnum.optional(),

    status:
      kycStatusEnum.optional(),

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
   KYC ANALYTICS
========================================= */

export const kycAnalyticsSchema =
  z.object({
    startDate:
      z.string().optional(),

    endDate:
      z.string().optional(),
  });

/* =========================================
   BULK KYC APPROVAL
========================================= */

export const bulkKycActionSchema =
  z.object({
    kycIds: z.array(
      z.string().cuid()
    ).min(1),

    status: z.enum([
      "APPROVED",
      "REJECTED",
    ]),

    remarks:
      z.string().optional(),
  });

/* =========================================
   TYPES
========================================= */

export type CreateKycDto =
  z.infer<typeof createKycSchema>;

export type UpdateKycDto =
  z.infer<typeof updateKycSchema>;

export type VerifyKycDto =
  z.infer<typeof verifyKycSchema>;

export type ResubmitKycDto =
  z.infer<typeof resubmitKycSchema>;

export type KycFilterDto =
  z.infer<typeof kycFilterSchema>;

export type KycAnalyticsDto =
  z.infer<typeof kycAnalyticsSchema>;

export type BulkKycActionDto =
  z.infer<typeof bulkKycActionSchema>;