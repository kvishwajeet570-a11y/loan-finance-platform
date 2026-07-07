import { z } from "zod";

/* =========================================
   DSA STATUS
========================================= */

export const dsaStatusEnum = z.enum([
  "PENDING",
  "ACTIVE",
  "INACTIVE",
  "BLOCKED",
  "REJECTED",
]);

/* =========================================
   DSA TYPE
========================================= */

export const dsaTypeEnum = z.enum([
  "INDIVIDUAL",
  "CORPORATE",
]);

/* =========================================
   DSA LEVEL
========================================= */

export const dsaLevelEnum = z.enum([
  "BRONZE",
  "SILVER",
  "GOLD",
  "PLATINUM",
  "DIAMOND",
]);

/* =========================================
   CREATE DSA
========================================= */

export const createDsaSchema = z.object({
  name: z.string().min(3).max(100),

  email: z.email(),

  phoneNo: z
    .string()
    .regex(/^[6-9]\d{9}$/),

  password: z.string().min(8),

  dsaType: dsaTypeEnum,

  companyName: z.string().optional(),

  panNo: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/),

  city: z.string().optional(),

  state: z.string().optional(),

  pincode: z.string().optional(),
});

/* =========================================
   UPDATE DSA
========================================= */

export const updateDsaSchema =
  createDsaSchema.partial();

/* =========================================
   DSA APPROVAL
========================================= */

export const approveDsaSchema =
  z.object({
    dsaId: z.string().cuid(),

    status: z.enum([
      "ACTIVE",
      "REJECTED",
    ]),

    remarks: z.string()
      .max(500)
      .optional(),
  });

/* =========================================
   DSA COMMISSION
========================================= */

export const dsaCommissionSchema =
  z.object({
    dsaId: z.string().cuid(),

    loanType: z.enum([
      "PERSONAL_LOAN",
      "BUSINESS_LOAN",
      "HOME_LOAN",
      "LAP",
      "CAR_LOAN",
      "CREDIT_CARD",
    ]),

    commissionRate:
      z.number().min(0),

    effectiveFrom:
      z.string(),
  });

/* =========================================
   ASSIGN LEAD
========================================= */

export const assignLeadToDsaSchema =
  z.object({
    dsaId: z.string().cuid(),

    leadId: z.string().cuid(),
  });

/* =========================================
   DSA TARGET
========================================= */

export const dsaTargetSchema =
  z.object({
    dsaId: z.string().cuid(),

    targetLeads:
      z.number().positive(),

    targetDisbursal:
      z.number().positive(),

    month: z.number()
      .min(1)
      .max(12),

    year: z.number()
      .min(2024),
  });

/* =========================================
   DSA FILTER
========================================= */

export const dsaFilterSchema =
  z.object({
    search: z.string().optional(),

    status:
      dsaStatusEnum.optional(),

    dsaType:
      dsaTypeEnum.optional(),

    level:
      dsaLevelEnum.optional(),

    page: z.coerce.number()
      .default(1),

    limit: z.coerce.number()
      .min(1)
      .max(100)
      .default(10),
  });

/* =========================================
   DSA PERFORMANCE
========================================= */

export const dsaPerformanceSchema =
  z.object({
    dsaId: z.string().cuid(),

    startDate:
      z.string().optional(),

    endDate:
      z.string().optional(),
  });

/* =========================================
   EXPORT TYPES
========================================= */

export type CreateDsaDto =
  z.infer<typeof createDsaSchema>;

export type UpdateDsaDto =
  z.infer<typeof updateDsaSchema>;

export type ApproveDsaDto =
  z.infer<typeof approveDsaSchema>;

export type DsaCommissionDto =
  z.infer<
    typeof dsaCommissionSchema
  >;

export type AssignLeadToDsaDto =
  z.infer<
    typeof assignLeadToDsaSchema
  >;

export type DsaTargetDto =
  z.infer<typeof dsaTargetSchema>;

export type DsaFilterDto =
  z.infer<typeof dsaFilterSchema>;

export type DsaPerformanceDto =
  z.infer<
    typeof dsaPerformanceSchema
  >;