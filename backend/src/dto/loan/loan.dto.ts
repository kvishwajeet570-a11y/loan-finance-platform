import { z } from "zod";

/* =========================================
   LOAN TYPE
========================================= */

export const loanTypeEnum = z.enum([
  "PERSONAL_LOAN",
  "BUSINESS_LOAN",
  "HOME_LOAN",
  "LAP",
  "CAR_LOAN",
  "EDUCATION_LOAN",
  "CREDIT_CARD",
  "BALANCE_TRANSFER",
]);

/* =========================================
   LOAN STATUS
========================================= */

export const loanStatusEnum = z.enum([
  "DRAFT",
  "SUBMITTED",
  "DOCUMENT_PENDING",
  "KYC_PENDING",
  "UNDER_REVIEW",
  "APPROVED",
  "REJECTED",
  "DISBURSED",
  "CLOSED",
  "CANCELLED",
]);

/* =========================================
   EMPLOYMENT TYPE
========================================= */

const employmentTypeEnum = z.enum([
  "SALARIED",
  "SELF_EMPLOYED",
  "BUSINESS_OWNER",
  "PROFESSIONAL",
]);

/* =========================================
   CREATE LOAN APPLICATION
========================================= */

export const createLoanSchema =
  z.object({
    fullName: z.string()
      .min(3)
      .max(100),

    email: z.email(),

    phone: z.string()
      .regex(/^[6-9]\d{9}$/),

    dob: z.string(),

    panNo: z.string()
      .regex(
        /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
      ),

    loanType:
      loanTypeEnum,

    amount: z.number()
      .positive()
      .min(10000)
      .max(100000000),

    tenureMonths:
      z.number()
      .int()
      .positive(),

    monthlyIncome:
      z.number()
      .positive(),

    employmentType:
      employmentTypeEnum,

    city:
      z.string().optional(),

    state:
      z.string().optional(),

    pincode:
      z.string().optional(),

    existingEMI:
      z.number()
      .min(0)
      .optional(),

    remarks:
      z.string()
      .max(1000)
      .optional(),
  });

/* =========================================
   UPDATE LOAN
========================================= */

export const updateLoanSchema =
  createLoanSchema.partial();

/* =========================================
   UPDATE LOAN STATUS
========================================= */

export const updateLoanStatusSchema =
  z.object({
    loanId: z.string().cuid(),

    status:
      loanStatusEnum,

    remarks:
      z.string()
      .max(1000)
      .optional(),
  });

/* =========================================
   ASSIGN LOAN
========================================= */

export const assignLoanSchema =
  z.object({
    loanId: z.string().cuid(),

    assignedTo:
      z.string().cuid(),

    assignedRole: z.enum([
      "DSA",
      "PARTNER",
      "EMPLOYEE",
      "MANAGER",
    ]),
  });

/* =========================================
   LOAN ELIGIBILITY
========================================= */

export const loanEligibilitySchema =
  z.object({
    monthlyIncome:
      z.number().positive(),

    existingEMI:
      z.number()
      .min(0)
      .default(0),

    requestedAmount:
      z.number().positive(),

    creditScore:
      z.number()
      .min(300)
      .max(900),
  });

/* =========================================
   EMI CALCULATOR
========================================= */

export const emiCalculatorSchema =
  z.object({
    principal:
      z.number().positive(),

    interestRate:
      z.number().positive(),

    tenureMonths:
      z.number().positive(),
  });

/* =========================================
   DISBURSE LOAN
========================================= */

export const disburseLoanSchema =
  z.object({
    loanId: z.string().cuid(),

    disbursedAmount:
      z.number().positive(),

    interestRate:
      z.number().positive(),

    disbursementDate:
      z.string(),

    transactionRef:
      z.string(),
  });

/* =========================================
   LOAN FILTER
========================================= */

export const loanFilterSchema =
  z.object({
    search:
      z.string().optional(),

    loanType:
      loanTypeEnum.optional(),

    status:
      loanStatusEnum.optional(),

    assignedTo:
      z.string().cuid().optional(),

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
      .default(10),
  });

/* =========================================
   LOAN ANALYTICS
========================================= */

export const loanAnalyticsSchema =
  z.object({
    startDate:
      z.string().optional(),

    endDate:
      z.string().optional(),

    loanType:
      loanTypeEnum.optional(),

    status:
      loanStatusEnum.optional(),
  });

/* =========================================
   TYPES
========================================= */

export type CreateLoanDto =
  z.infer<typeof createLoanSchema>;

export type UpdateLoanDto =
  z.infer<typeof updateLoanSchema>;

export type UpdateLoanStatusDto =
  z.infer<
    typeof updateLoanStatusSchema
  >;

export type AssignLoanDto =
  z.infer<typeof assignLoanSchema>;

export type LoanEligibilityDto =
  z.infer<
    typeof loanEligibilitySchema
  >;

export type EmiCalculatorDto =
  z.infer<
    typeof emiCalculatorSchema
  >;

export type DisburseLoanDto =
  z.infer<
    typeof disburseLoanSchema
  >;

export type LoanFilterDto =
  z.infer<typeof loanFilterSchema>;

export type LoanAnalyticsDto =
  z.infer<
    typeof loanAnalyticsSchema
  >;