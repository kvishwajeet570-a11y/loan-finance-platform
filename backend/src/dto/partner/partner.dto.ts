import { z } from "zod";

/* =========================================
   ENUMS
========================================= */

export const partnerTypeEnum = z.enum([
  "BANK",
  "NBFC",
  "INSURANCE",
  "FINTECH",
  "DSA",
  "CHANNEL_PARTNER",
  "BROKER",
]);

export const partnerStatusEnum = z.enum([
  "PENDING",
  "ACTIVE",
  "SUSPENDED",
  "INACTIVE",
  "REJECTED",
  "BLACKLISTED",
]);

export const agreementStatusEnum = z.enum([
  "DRAFT",
  "ACTIVE",
  "EXPIRED",
  "TERMINATED",
]);

export const partnerProductEnum = z.enum([
  "PERSONAL_LOAN",
  "BUSINESS_LOAN",
  "HOME_LOAN",
  "LAP",
  "CAR_LOAN",
  "EDUCATION_LOAN",
  "GOLD_LOAN",
  "CREDIT_CARD",
  "INSURANCE",
  "FASTAG",
  "DEMAT",
]);

/* =========================================
   CREATE PARTNER
========================================= */

export const createPartnerSchema = z.object({
  companyName: z.string().min(2).max(200),

  partnerCode: z
    .string()
    .min(2)
    .max(50)
    .transform((val) => val.toUpperCase()),

  partnerType: partnerTypeEnum,

  contactPerson: z.string().min(2).max(100),

  email: z.string().email(),

  phoneNo: z.string().regex(/^[6-9]\d{9}$/),

  alternatePhone: z.string().optional(),

  website: z.string().url().optional(),

  gstNumber: z.string().optional(),

  panNumber: z.string().optional(),

  address: z.string().min(5),

  city: z.string(),

  state: z.string(),

  pincode: z.string(),

  products: z.array(partnerProductEnum).min(1),

  agreementStartDate: z.string(),

  agreementEndDate: z.string(),

  commissionPercentage: z.number().min(0).max(100),

  status: partnerStatusEnum.default("PENDING"),
});

/* =========================================
   UPDATE PARTNER
========================================= */

export const updatePartnerSchema = z.object({
  companyName: z.string().optional(),
  contactPerson: z.string().optional(),
  email: z.string().email().optional(),
  phoneNo: z.string().optional(),
  website: z.string().url().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  commissionPercentage: z.number().optional(),
});

/* =========================================
   APPROVE PARTNER
========================================= */

export const approvePartnerSchema = z.object({
  partnerId: z.string().cuid(),
  remarks: z.string().optional(),
});

/* =========================================
   REJECT PARTNER
========================================= */

export const rejectPartnerSchema = z.object({
  partnerId: z.string().cuid(),
  reason: z.string().min(3).max(500),
});

/* =========================================
   COMMISSION UPDATE
========================================= */

export const updatePartnerCommissionSchema = z.object({
  partnerId: z.string().cuid(),
  commissionPercentage: z.number().min(0).max(100),
});

/* =========================================
   FILTER
========================================= */

export const partnerFilterSchema = z.object({
  search: z.string().optional(),
  partnerType: partnerTypeEnum.optional(),
  status: partnerStatusEnum.optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
});

/* =========================================
   PERFORMANCE
========================================= */

export const partnerPerformanceSchema = z.object({
  partnerId: z.string().cuid(),
  startDate: z.string(),
  endDate: z.string(),
});


/* =========================================
   PARTNER ANALYTICS
========================================= */

export const partnerReportAnalyticsSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  partnerType: partnerTypeEnum.optional(),
});

/* =========================================
   TYPES
========================================= */

export type CreatePartnerDto =
  z.infer<typeof createPartnerSchema>;

export type UpdatePartnerDto =
  z.infer<typeof updatePartnerSchema>;

export type ApprovePartnerDto =
  z.infer<typeof approvePartnerSchema>;

export type RejectPartnerDto =
  z.infer<typeof rejectPartnerSchema>;

export type UpdatePartnerCommissionDto =
  z.infer<typeof updatePartnerCommissionSchema>;

export type PartnerFilterDto =
  z.infer<typeof partnerFilterSchema>;

export type PartnerPerformanceDto =
  z.infer<typeof partnerPerformanceSchema>;

export type PartnerAnalyticsDto =
  z.infer<typeof partnerReportAnalyticsSchema>;