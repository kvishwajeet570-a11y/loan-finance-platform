import { z } from "zod";

/* =========================================
   RECHARGE TYPE
========================================= */

export const rechargeTypeEnum = z.enum([
  "MOBILE_PREPAID",
  "MOBILE_POSTPAID",
  "DTH",
  "FASTAG",
  "ELECTRICITY",
  "GAS",
  "WATER",
  "BROADBAND",
  "LANDLINE",
  "CABLE_TV",
]);

/* =========================================
   TRANSACTION STATUS
========================================= */

export const rechargeHistoryStatusEnum = z.enum([
  "SUCCESS",
  "FAILED",
  "PENDING",
  "REFUNDED",
  "CANCELLED",
]);

/* =========================================
   TRANSACTION SOURCE
========================================= */

export const rechargeSourceEnum = z.enum([
  "WEB",
  "ANDROID",
  "IOS",
  "ADMIN_PANEL",
  "PARTNER_PANEL",
  "DSA_PANEL",
  "API",
]);

/* =========================================
   CREATE HISTORY
========================================= */

export const createRechargeHistorySchema =
  z.object({
    rechargeId: z.string().cuid(),

    userId:
      z.string().cuid(),

    transactionId:
      z.string(),

    providerReference:
      z.string()
      .optional(),

    rechargeType:
      rechargeTypeEnum,

    amount:
      z.number()
      .positive(),

    commissionAmount:
      z.number()
      .min(0)
      .default(0),

    status:
      rechargeHistoryStatusEnum,

    source:
      rechargeSourceEnum,

    remarks:
      z.string()
      .max(500)
      .optional(),
  });

/* =========================================
   UPDATE HISTORY STATUS
========================================= */

export const updateRechargeHistoryStatusSchema =
  z.object({
    historyId:
      z.string().cuid(),

    status:
      rechargeHistoryStatusEnum,

    remarks:
      z.string()
      .optional(),
  });

/* =========================================
   REFUND HISTORY
========================================= */

export const rechargeRefundHistorySchema =
  z.object({
    rechargeId:
      z.string().cuid(),

    refundAmount:
      z.number()
      .positive(),

    refundReason:
      z.string()
      .min(3)
      .max(500),

    refundReference:
      z.string()
      .optional(),
  });

/* =========================================
   HISTORY FILTER
========================================= */

export const rechargeHistoryFilterSchema =
  z.object({
    userId:
      z.string()
      .cuid()
      .optional(),

    rechargeId:
      z.string()
      .cuid()
      .optional(),

    transactionId:
      z.string()
      .optional(),

    rechargeType:
      rechargeTypeEnum.optional(),

    status:
      rechargeHistoryStatusEnum.optional(),

    source:
      rechargeSourceEnum.optional(),

    startDate:
      z.string().optional(),

    endDate:
      z.string().optional(),

    minAmount:
      z.number().optional(),

    maxAmount:
      z.number().optional(),

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
   COMMISSION HISTORY
========================================= */

export const rechargeCommissionHistorySchema =
  z.object({
    rechargeId:
      z.string().cuid(),

    userId:
      z.string().cuid(),

    commissionAmount:
      z.number()
      .positive(),

    commissionPercentage:
      z.number()
      .min(0)
      .max(100),
  });

/* =========================================
   RECONCILIATION REPORT
========================================= */

export const rechargeReconciliationSchema =
  z.object({
    startDate:
      z.string(),

    endDate:
      z.string(),

    operator:
      z.string()
      .optional(),
  });

/* =========================================
   ANALYTICS
========================================= */

export const rechargeHistoryAnalyticsSchema =
  z.object({
    startDate:
      z.string().optional(),

    endDate:
      z.string().optional(),

    rechargeType:
      rechargeTypeEnum.optional(),
  });

/* =========================================
   TYPES
========================================= */

export type CreateRechargeHistoryDto =
  z.infer<
    typeof createRechargeHistorySchema
  >;

export type UpdateRechargeHistoryStatusDto =
  z.infer<
    typeof updateRechargeHistoryStatusSchema
  >;

export type RechargeRefundHistoryDto =
  z.infer<
    typeof rechargeRefundHistorySchema
  >;

export type RechargeHistoryFilterDto =
  z.infer<
    typeof rechargeHistoryFilterSchema
  >;

export type RechargeCommissionHistoryDto =
  z.infer<
    typeof rechargeCommissionHistorySchema
  >;

export type RechargeReconciliationDto =
  z.infer<
    typeof rechargeReconciliationSchema
  >;

export type RechargeHistoryAnalyticsDto =
  z.infer<
    typeof rechargeHistoryAnalyticsSchema
  >;