import { z } from "zod";

/* =========================================
   INSURANCE TYPE
========================================= */

export const insuranceTypeEnum = z.enum([
  "HEALTH",
  "MOTOR",
  "LIFE",
  "TRAVEL",
  "HOME",
  "COMMERCIAL",
  "PERSONAL_ACCIDENT",
  "CYBER",
]);

/* =========================================
   POLICY STATUS
========================================= */

export const policyStatusEnum = z.enum([
  "PENDING",
  "ACTIVE",
  "EXPIRED",
  "CANCELLED",
  "REJECTED",
  "CLAIMED",
]);

/* =========================================
   POLICY PAYMENT STATUS
========================================= */

export const insurancePaymentStatusEnum = z.enum([
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
]);

/* =========================================
   CREATE INSURANCE POLICY
========================================= */

export const createInsuranceSchema = z.object({
  userId: z.string().cuid(),

  insuranceType: insuranceTypeEnum,

  policyHolderName: z.string()
    .min(3)
    .max(100),

  mobileNumber: z.string()
    .regex(/^[6-9]\d{9}$/),

  email: z.string().email(),

  sumInsured: z.number().positive(),

  premiumAmount: z.number().positive(),

  tenureMonths: z.number().positive(),

  nomineeName: z.string().optional(),

  nomineeRelation: z.string().optional(),

  insurerName: z.string().min(2),
});

/* =========================================
   UPDATE INSURANCE
========================================= */

export const updateInsuranceSchema =
  createInsuranceSchema.partial();

/* =========================================
   POLICY STATUS UPDATE
========================================= */

export const updatePolicyStatusSchema =
  z.object({
    policyId: z.string().cuid(),

    status: policyStatusEnum,

    remarks: z.string().optional(),
  });

/* =========================================
   CLAIM REQUEST
========================================= */

export const claimInsuranceSchema =
  z.object({
    policyId: z.string().cuid(),

    claimAmount: z.number().positive(),

    claimReason: z.string()
      .min(10)
      .max(1000),
  });

/* =========================================
   POLICY RENEWAL
========================================= */

export const renewPolicySchema =
  z.object({
    policyId: z.string().cuid(),

    tenureMonths: z.number().positive(),

    premiumAmount: z.number().positive(),
  });

/* =========================================
   INSURANCE FILTER
========================================= */

export const insuranceFilterSchema =
  z.object({
    search: z.string().optional(),

    insuranceType:
      insuranceTypeEnum.optional(),

    status:
      policyStatusEnum.optional(),

    paymentStatus:
      insurancePaymentStatusEnum.optional(),

    userId:
      z.string().cuid().optional(),

    page:
      z.coerce.number().default(1),

    limit:
      z.coerce.number()
        .min(1)
        .max(100)
        .default(10),
  });

/* =========================================
   POLICY ANALYTICS
========================================= */

export const insuranceAnalyticsSchema =
  z.object({
    startDate:
      z.string().optional(),

    endDate:
      z.string().optional(),

    insuranceType:
      insuranceTypeEnum.optional(),
  });

/* =========================================
   EXPORT TYPES
========================================= */

export type CreateInsuranceDto =
  z.infer<typeof createInsuranceSchema>;

export type UpdateInsuranceDto =
  z.infer<typeof updateInsuranceSchema>;

export type UpdatePolicyStatusDto =
  z.infer<
    typeof updatePolicyStatusSchema
  >;

export type ClaimInsuranceDto =
  z.infer<
    typeof claimInsuranceSchema
  >;

export type RenewPolicyDto =
  z.infer<
    typeof renewPolicySchema
  >;

export type InsuranceFilterDto =
  z.infer<
    typeof insuranceFilterSchema
  >;

export type InsuranceAnalyticsDto =
  z.infer<
    typeof insuranceAnalyticsSchema
  >;