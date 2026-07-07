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
   OPERATOR TYPE
========================================= */

export const operatorEnum = z.enum([
  "AIRTEL",
  "JIO",
  "VI",
  "BSNL",
  "TATA_PLAY",
  "DISH_TV",
  "SUN_DIRECT",
  "AIRTEL_DTH",
  "OTHER",
]);

/* =========================================
   RECHARGE STATUS
========================================= */

export const rechargeStatusEnum = z.enum([
  "PENDING",
  "PROCESSING",
  "SUCCESS",
  "FAILED",
  "REFUNDED",
  "CANCELLED",
]);

/* =========================================
   PAYMENT MODE
========================================= */

export const rechargePaymentModeEnum = z.enum([
  "WALLET",
  "UPI",
  "NET_BANKING",
  "CREDIT_CARD",
  "DEBIT_CARD",
  "BANK_TRANSFER",
]);

/* =========================================
   CREATE RECHARGE
========================================= */

export const createRechargeSchema =
  z.object({
    userId: z.string().cuid(),

    rechargeType:
      rechargeTypeEnum,

    operator:
      operatorEnum,

    mobileNumber:
      z.string()
      .regex(/^[6-9]\d{9}$/)
      .optional(),

    consumerNumber:
      z.string()
      .optional(),

    vehicleNumber:
      z.string()
      .optional(),

    amount:
      z.number()
      .positive(),

    paymentMode:
      rechargePaymentModeEnum,

    remarks:
      z.string()
      .max(500)
      .optional(),
  });

/* =========================================
   PROCESS RECHARGE
========================================= */

export const processRechargeSchema =
  z.object({
    rechargeId:
      z.string().cuid(),

    providerReference:
      z.string(),

    transactionId:
      z.string(),
  });

/* =========================================
   FAILED RECHARGE
========================================= */

export const failedRechargeSchema =
  z.object({
    rechargeId:
      z.string().cuid(),

    reason:
      z.string()
      .min(3)
      .max(500),
  });

/* =========================================
   REFUND RECHARGE
========================================= */

export const refundRechargeSchema =
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
  });

/* =========================================
   RECHARGE FILTER
========================================= */

export const rechargeFilterSchema =
  z.object({
    userId:
      z.string()
      .cuid()
      .optional(),

    rechargeType:
      rechargeTypeEnum.optional(),

    operator:
      operatorEnum.optional(),

    status:
      rechargeStatusEnum.optional(),

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
   RECHARGE COMMISSION
========================================= */

export const rechargeCommissionSchema =
  z.object({
    rechargeId:
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
   RECHARGE ANALYTICS
========================================= */

export const rechargeAnalyticsSchema =
  z.object({
    rechargeType:
      rechargeTypeEnum.optional(),

    operator:
      operatorEnum.optional(),

    startDate:
      z.string().optional(),

    endDate:
      z.string().optional(),
  });

/* =========================================
   TYPES
========================================= */

export type CreateRechargeDto =
  z.infer<typeof createRechargeSchema>;

export type ProcessRechargeDto =
  z.infer<typeof processRechargeSchema>;

export type FailedRechargeDto =
  z.infer<typeof failedRechargeSchema>;

export type RefundRechargeDto =
  z.infer<typeof refundRechargeSchema>;

export type RechargeFilterDto =
  z.infer<typeof rechargeFilterSchema>;

export type RechargeCommissionDto =
  z.infer<typeof rechargeCommissionSchema>;

export type RechargeAnalyticsDto =
  z.infer<typeof rechargeAnalyticsSchema>;