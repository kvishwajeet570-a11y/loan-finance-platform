import { z } from "zod";

/* =========================================
   FASTAG STATUS
========================================= */

export const fastagStatusEnum = z.enum([
  "PENDING",
  "ACTIVE",
  "SUSPENDED",
  "BLOCKED",
  "CLOSED",
]);

/* =========================================
   VEHICLE TYPE
========================================= */

export const vehicleTypeEnum = z.enum([
  "CAR",
  "SUV",
  "MUV",
  "BIKE",
  "TRUCK",
  "BUS",
  "TAXI",
  "COMMERCIAL",
]);

/* =========================================
   CREATE FASTAG
========================================= */

export const createFastagSchema =
  z.object({
    userId: z.string().cuid(),

    vehicleNumber: z.string()
      .min(5)
      .max(20),

    vehicleType:
      vehicleTypeEnum,

    ownerName: z.string()
      .min(3)
      .max(100),

    mobileNumber: z.string()
      .regex(/^[6-9]\d{9}$/),

    email: z.email(),

    panNo: z.string()
      .regex(
        /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
      )
      .optional(),

    bankName:
      z.string().optional(),
  });

/* =========================================
   UPDATE FASTAG
========================================= */

export const updateFastagSchema =
  createFastagSchema.partial();

/* =========================================
   FASTAG RECHARGE
========================================= */

export const fastagRechargeSchema =
  z.object({
    fastagId: z.string().cuid(),

    amount: z.number()
      .positive()
      .min(100),
  });

/* =========================================
   FASTAG STATUS UPDATE
========================================= */

export const updateFastagStatusSchema =
  z.object({
    fastagId: z.string().cuid(),

    status:
      fastagStatusEnum,

    remarks:
      z.string().optional(),
  });

/* =========================================
   FASTAG KYC
========================================= */

export const fastagKycSchema =
  z.object({
    fastagId: z.string().cuid(),

    documentId:
      z.string().cuid(),

    isVerified:
      z.boolean(),
  });

/* =========================================
   FASTAG FILTER
========================================= */

export const fastagFilterSchema =
  z.object({
    search: z.string().optional(),

    vehicleType:
      vehicleTypeEnum.optional(),

    status:
      fastagStatusEnum.optional(),

    userId:
      z.string().cuid().optional(),

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
   FASTAG TRANSACTION FILTER
========================================= */

export const fastagTransactionSchema =
  z.object({
    fastagId:
      z.string().cuid(),

    startDate:
      z.string().optional(),

    endDate:
      z.string().optional(),
  });

/* =========================================
   FASTAG BALANCE CHECK
========================================= */

export const fastagBalanceSchema =
  z.object({
    fastagId:
      z.string().cuid(),
  });

/* =========================================
   EXPORT TYPES
========================================= */

export type CreateFastagDto =
  z.infer<typeof createFastagSchema>;

export type UpdateFastagDto =
  z.infer<typeof updateFastagSchema>;

export type FastagRechargeDto =
  z.infer<typeof fastagRechargeSchema>;

export type UpdateFastagStatusDto =
  z.infer<
    typeof updateFastagStatusSchema
  >;

export type FastagKycDto =
  z.infer<typeof fastagKycSchema>;

export type FastagFilterDto =
  z.infer<typeof fastagFilterSchema>;

export type FastagTransactionDto =
  z.infer<
    typeof fastagTransactionSchema
  >;

export type FastagBalanceDto =
  z.infer<typeof fastagBalanceSchema>;