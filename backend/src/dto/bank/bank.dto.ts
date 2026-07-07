import { z } from "zod";

/* =========================================
   BANK TYPES
========================================= */

export const bankTypeEnum = z.enum([
  "BANK",
  "NBFC",
  "FINTECH",
  "INSURANCE",
]);

/* =========================================
   CREATE BANK
========================================= */

export const createBankSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(150),

  shortName: z
    .string()
    .min(2)
    .max(20),

  type: bankTypeEnum,

  website: z
    .url()
    .optional(),

  email: z
    .email()
    .optional(),

  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/)
    .optional(),

  logo: z.string().optional(),

  address: z.string().optional(),

  city: z.string().optional(),

  state: z.string().optional(),

  pincode: z
    .string()
    .regex(/^\d{6}$/)
    .optional(),

  isActive: z.boolean().default(true),
});

/* =========================================
   UPDATE BANK
========================================= */

export const updateBankSchema =
  createBankSchema.partial();

/* =========================================
   BANK LOAN PRODUCT
========================================= */

export const bankLoanProductSchema = z.object({
  bankId: z.string().cuid(),

  loanType: z.enum([
    "PERSONAL_LOAN",
    "BUSINESS_LOAN",
    "HOME_LOAN",
    "LAP",
    "CAR_LOAN",
    "EDUCATION_LOAN",
    "CREDIT_CARD",
  ]),

  minAmount: z.number().positive(),

  maxAmount: z.number().positive(),

  minTenure: z.number().positive(),

  maxTenure: z.number().positive(),

  interestRate: z.number().min(0),

  processingFee: z.number().min(0),

  isActive: z.boolean().default(true),
});

/* =========================================
   BANK FILTER
========================================= */

export const bankFilterSchema = z.object({
  search: z.string().optional(),

  type: bankTypeEnum.optional(),

  isActive: z.boolean().optional(),

  page: z.coerce.number().default(1),

  limit: z.coerce.number()
    .min(1)
    .max(100)
    .default(10),
});

/* =========================================
   ASSIGN BANK MANAGER
========================================= */

export const assignBankManagerSchema =
  z.object({
    bankId: z.string().cuid(),
    userId: z.string().cuid(),
  });

/* =========================================
   BANK COMMISSION
========================================= */

export const bankCommissionSchema =
  z.object({
    bankId: z.string().cuid(),

    loanType: z.string(),

    commissionPercent: z
      .number()
      .min(0)
      .max(100),

    isActive: z.boolean().default(true),
  });

/* =========================================
   TYPES
========================================= */

export type CreateBankDto =
  z.infer<typeof createBankSchema>;

export type UpdateBankDto =
  z.infer<typeof updateBankSchema>;

export type BankLoanProductDto =
  z.infer<typeof bankLoanProductSchema>;

export type BankFilterDto =
  z.infer<typeof bankFilterSchema>;

export type AssignBankManagerDto =
  z.infer<typeof assignBankManagerSchema>;

export type BankCommissionDto =
  z.infer<typeof bankCommissionSchema>;