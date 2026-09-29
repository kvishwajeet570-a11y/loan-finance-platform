import { z } from "zod";

/* =========================================
   PAYMENT TYPE
========================================= */

export const paymentTypeEnum = z.enum([
  "LOAN_PROCESSING_FEE",
  "EMI_PAYMENT",
  "INSURANCE_PREMIUM",
  "FASTAG_RECHARGE",
  "INVESTMENT",
  "COMMISSION_PAYOUT",
  "REFERRAL_PAYOUT",
  "SERVICE_CHARGE",
  "MEMBERSHIP",
  "OTHER",
]);

/* =========================================
   PAYMENT METHOD
========================================= */

export const paymentMethodEnum = z.enum([
  "UPI",
  "BANK_TRANSFER",
  "NET_BANKING",
  "DEBIT_CARD",
  "CREDIT_CARD",
  "WALLET",
  "CASH",
  "CHEQUE",
]);

/* =========================================
   PAYMENT STATUS
========================================= */

export const paymentStatusEnum = z.enum([
  "PENDING",
  "PROCESSING",
  "SUCCESS",
  "FAILED",
  "CANCELLED",
  "REFUNDED",
  "PARTIAL_REFUND",
]);

/* =========================================
   PAYMENT GATEWAY
========================================= */

export const paymentGatewayEnum = z.enum([
  "RAZORPAY",
  "PHONEPE",
  "PAYTM",
  "CASHFREE",
  "STRIPE",
  "MANUAL",
]);

/* =========================================
   CREATE PAYMENT
========================================= */

export const createPaymentSchema = z.object({
  userId: z.string().cuid(),

  paymentType: paymentTypeEnum,

  amount: z.number().positive(),

  paymentMethod: paymentMethodEnum,

  paymentGateway: paymentGatewayEnum,

  loanId: z.string().cuid().optional(),

  partnerId: z.string().cuid().optional(),

  referenceId: z.string().optional(),

  remarks: z.string().max(500).optional(),
});

/* =========================================
   PAYMENT SUCCESS
========================================= */

export const paymentSuccessSchema = z.object({
  paymentId: z.string().cuid(),

  transactionId: z.string(),

  gatewayPaymentId: z.string().optional(),

  gatewayResponse: z
    .record(
      z.string(),
      z.unknown()
    )
    .optional(),
});

/* =========================================
   PAYMENT FAILURE
========================================= */

export const paymentFailureSchema = z.object({
  paymentId: z.string().cuid(),

  failureReason: z
    .string()
    .min(3)
    .max(500),
});

/* =========================================
   REFUND PAYMENT
========================================= */

export const refundPaymentSchema = z.object({
  paymentId: z.string().cuid(),

  refundAmount: z
    .number()
    .positive(),

  refundReason: z
    .string()
    .min(3)
    .max(500),
});

/* =========================================
   VERIFY PAYMENT
========================================= */

export const verifyPaymentSchema = z.object({
  paymentId: z.string().cuid(),

  transactionId: z.string(),
});

/* =========================================
   PAYMENT FILTER
========================================= */

export const paymentFilterSchema = z.object({
  userId: z.string().cuid().optional(),

  paymentType: paymentTypeEnum.optional(),

  status: paymentStatusEnum.optional(),

  paymentMethod: paymentMethodEnum.optional(),

  paymentGateway: paymentGatewayEnum.optional(),

  startDate: z.string().optional(),

  endDate: z.string().optional(),

  minAmount: z.number().optional(),

  maxAmount: z.number().optional(),

  page: z.coerce.number().default(1),

  limit: z.coerce.number().min(1).max(100).default(20),
});

/* =========================================
   PAYMENT ANALYTICS
========================================= */

export const paymentAnalyticsSchema = z.object({
  startDate: z.string().optional(),

  endDate: z.string().optional(),

  paymentType: paymentTypeEnum.optional(),

  paymentGateway: paymentGatewayEnum.optional(),
});

/* =========================================
   EXPORT TYPES
========================================= */

export type CreatePaymentDto =
  z.infer<typeof createPaymentSchema>;

export type PaymentSuccessDto =
  z.infer<typeof paymentSuccessSchema>;

export type PaymentFailureDto =
  z.infer<typeof paymentFailureSchema>;

export type RefundPaymentDto =
  z.infer<typeof refundPaymentSchema>;

export type VerifyPaymentDto =
  z.infer<typeof verifyPaymentSchema>;

export type PaymentFilterDto =
  z.infer<typeof paymentFilterSchema>;

export type PaymentAnalyticsDto =
  z.infer<typeof paymentAnalyticsSchema>;