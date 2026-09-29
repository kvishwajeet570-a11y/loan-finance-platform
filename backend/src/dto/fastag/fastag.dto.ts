import { z } from "zod";

/* =========================================
   FASTAG STATUS
========================================= */

export const fastagStatusEnum = z.enum([
  "PENDING",
  "SUCCESS",
  "FAILED",
  "ACTIVE",
  "INACTIVE",
]);

/* =========================================
   CREATE FASTAG
========================================= */

export const createFastagSchema = z.object({
  vehicleNo: z.string().min(5).max(20),

  provider: z.string().min(2).max(100),

  amount: z.coerce.number().positive(),

  userId: z.string().min(1),

  slug: z.string().optional(),

  status: fastagStatusEnum.optional(),

  isActive: z.boolean().optional(),
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

    amount: z.coerce.number()
      .positive()
      .min(100),
  });

/* =========================================
   FASTAG STATUS UPDATE
========================================= */

export const updateFastagStatusSchema =
  z.object({
    fastagId: z.string().cuid(),

    status: fastagStatusEnum,

    remarks: z.string().optional(),
  });

/* =========================================
   FASTAG FILTER
========================================= */

export const fastagFilterSchema =
  z.object({
    search: z.string().optional(),

    status:
      fastagStatusEnum.optional(),

    userId:
      z.string().optional(),

    isActive:
      z.boolean().optional(),

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

export type FastagFilterDto =
  z.infer<typeof fastagFilterSchema>;

export type FastagTransactionDto =
  z.infer<
    typeof fastagTransactionSchema
  >;

export type FastagBalanceDto =
  z.infer<typeof fastagBalanceSchema>;