import { z } from "zod";

/* =========================================
   CUSTOMER STATUS
========================================= */

export const customerStatusEnum = z.enum([
  "ACTIVE",
  "INACTIVE",
  "BLOCKED",
]);

/* =========================================
   EMPLOYMENT TYPE
========================================= */

const employmentTypeEnum = z.enum([
  "SALARIED",
  "SELF_EMPLOYED",
  "BUSINESS_OWNER",
  "FREELANCER",
  "STUDENT",
  "OTHER",
]);

/* =========================================
   CREATE CUSTOMER
========================================= */

export const createCustomerSchema = z.object({
  name: z.string().min(3).max(100),

  email: z.email(),

  phoneNo: z
    .string()
    .regex(/^[6-9]\d{9}$/),

  password: z.string().min(8),

  dob: z.string().optional(),

  panNo: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
    .optional(),

  city: z.string().optional(),

  state: z.string().optional(),

  employmentType: employmentTypeEnum.optional(),

  monthlyIncome: z
    .number()
    .positive()
    .optional(),
});

/* =========================================
   UPDATE CUSTOMER
========================================= */

export const updateCustomerSchema =
  createCustomerSchema.partial();

/* =========================================
   CUSTOMER PROFILE
========================================= */

export const updateCustomerProfileSchema =
  z.object({
    name: z.string().optional(),

    profileImage: z.string().optional(),

    city: z.string().optional(),

    state: z.string().optional(),

    dob: z.string().optional(),

    employmentType:
      employmentTypeEnum.optional(),

    monthlyIncome:
      z.number().positive().optional(),
  });

/* =========================================
   CUSTOMER FILTER
========================================= */

export const customerFilterSchema =
  z.object({
    search: z.string().optional(),

    isVerified: z.boolean().optional(),

    isBlocked: z.boolean().optional(),

    status:
      customerStatusEnum.optional(),

    employmentType:
      employmentTypeEnum.optional(),

    page: z.coerce.number().default(1),

    limit: z.coerce.number()
      .min(1)
      .max(100)
      .default(10),
  });

/* =========================================
   BLOCK CUSTOMER
========================================= */

export const blockCustomerSchema =
  z.object({
    customerId: z.string().cuid(),

    reason: z
      .string()
      .min(5)
      .max(500),
  });

/* =========================================
   CUSTOMER ELIGIBILITY
========================================= */

export const eligibilityCheckSchema =
  z.object({
    monthlyIncome: z.number().positive(),

    loanAmount: z.number().positive(),

    tenureMonths: z.number().positive(),

    creditScore: z
      .number()
      .min(300)
      .max(900),
  });

/* =========================================
   TYPES
========================================= */

export type CreateCustomerDto =
  z.infer<typeof createCustomerSchema>;

export type UpdateCustomerDto =
  z.infer<typeof updateCustomerSchema>;

export type UpdateCustomerProfileDto =
  z.infer<
    typeof updateCustomerProfileSchema
  >;

export type CustomerFilterDto =
  z.infer<typeof customerFilterSchema>;

export type BlockCustomerDto =
  z.infer<typeof blockCustomerSchema>;

export type EligibilityCheckDto =
  z.infer<typeof eligibilityCheckSchema>;