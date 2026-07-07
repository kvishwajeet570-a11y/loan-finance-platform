import { z } from "zod";

/* =========================================
   LEAD SOURCE
========================================= */

export const leadSourceEnum = z.enum([
  "WEBSITE",
  "MOBILE_APP",
  "DSA",
  "PARTNER",
  "FACEBOOK",
  "INSTAGRAM",
  "GOOGLE_ADS",
  "YOUTUBE",
  "WHATSAPP",
  "REFERRAL",
  "TELECALLER",
  "WALK_IN",
  "OTHER",
]);

/* =========================================
   LEAD STATUS
========================================= */

export const leadStatusEnum = z.enum([
  "NEW",
  "CONTACTED",
  "FOLLOW_UP",
  "DOCUMENT_PENDING",
  "KYC_PENDING",
  "UNDER_REVIEW",
  "APPROVED",
  "REJECTED",
  "DISBURSED",
  "LOST",
]);

/* =========================================
   LEAD PRIORITY
========================================= */

export const leadPriorityEnum = z.enum([
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
]);

/* =========================================
   PRODUCT TYPE
========================================= */

export const leadProductEnum = z.enum([
  "PERSONAL_LOAN",
  "BUSINESS_LOAN",
  "HOME_LOAN",
  "LAP",
  "CAR_LOAN",
  "CREDIT_CARD",
  "INSURANCE",
  "FASTAG",
  "INVESTMENT",
  "DEMAT_ACCOUNT",
]);

/* =========================================
   CREATE LEAD
========================================= */

export const createLeadSchema = z.object({
  fullName: z.string()
    .min(3)
    .max(100),

  mobileNumber: z.string()
    .regex(/^[6-9]\d{9}$/),

  email: z.email().optional(),

  city: z.string().optional(),

  state: z.string().optional(),

  pincode: z.string().optional(),

  productType:
    leadProductEnum,

  loanAmount: z.number()
    .positive()
    .optional(),

  monthlyIncome:
    z.number().positive().optional(),

  panNo: z.string()
    .regex(
      /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
    )
    .optional(),

  source:
    leadSourceEnum,

  remarks:
    z.string().max(1000).optional(),

  priority:
    leadPriorityEnum.default(
      "MEDIUM"
    ),
});

/* =========================================
   UPDATE LEAD
========================================= */

export const updateLeadSchema =
  createLeadSchema.partial();

/* =========================================
   ASSIGN LEAD
========================================= */

export const assignLeadSchema =
  z.object({
    leadId: z.string().cuid(),

    assignedTo:
      z.string().cuid(),

    assignedRole: z.enum([
      "DSA",
      "EMPLOYEE",
      "PARTNER",
      "MANAGER",
    ]),
  });

/* =========================================
   UPDATE LEAD STATUS
========================================= */

export const updateLeadStatusSchema =
  z.object({
    leadId: z.string().cuid(),

    status:
      leadStatusEnum,

    remarks:
      z.string()
      .max(1000)
      .optional(),

    nextFollowUpDate:
      z.string()
      .optional(),
  });

/* =========================================
   FOLLOW UP
========================================= */

export const leadFollowUpSchema =
  z.object({
    leadId: z.string().cuid(),

    followUpDate:
      z.string(),

    remarks:
      z.string()
      .min(3)
      .max(1000),

    outcome:
      z.string()
      .optional(),
  });

/* =========================================
   LEAD FILTER
========================================= */

export const leadFilterSchema =
  z.object({
    search:
      z.string().optional(),

    productType:
      leadProductEnum.optional(),

    status:
      leadStatusEnum.optional(),

    source:
      leadSourceEnum.optional(),

    priority:
      leadPriorityEnum.optional(),

    assignedTo:
      z.string().cuid().optional(),

    startDate:
      z.string().optional(),

    endDate:
      z.string().optional(),

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
   BULK LEAD ASSIGNMENT
========================================= */

export const bulkAssignLeadSchema =
  z.object({
    leadIds: z.array(
      z.string().cuid()
    ).min(1),

    assignedTo:
      z.string().cuid(),

    assignedRole:
      z.string(),
  });

/* =========================================
   LEAD CONVERSION
========================================= */

export const leadConversionSchema =
  z.object({
    leadId: z.string().cuid(),

    convertedTo: z.enum([
      "CUSTOMER",
      "LOAN_APPLICATION",
      "INSURANCE_POLICY",
      "INVESTMENT_ACCOUNT",
    ]),
  });

/* =========================================
   LEAD ANALYTICS
========================================= */

export const leadAnalyticsSchema =
  z.object({
    startDate:
      z.string().optional(),

    endDate:
      z.string().optional(),

    source:
      leadSourceEnum.optional(),

    productType:
      leadProductEnum.optional(),
  });

/* =========================================
   EXPORT TYPES
========================================= */

export type CreateLeadDto =
  z.infer<typeof createLeadSchema>;

export type UpdateLeadDto =
  z.infer<typeof updateLeadSchema>;

export type AssignLeadDto =
  z.infer<typeof assignLeadSchema>;

export type UpdateLeadStatusDto =
  z.infer<
    typeof updateLeadStatusSchema
  >;

export type LeadFollowUpDto =
  z.infer<
    typeof leadFollowUpSchema
  >;

export type LeadFilterDto =
  z.infer<typeof leadFilterSchema>;

export type BulkAssignLeadDto =
  z.infer<
    typeof bulkAssignLeadSchema
  >;

export type LeadConversionDto =
  z.infer<
    typeof leadConversionSchema
  >;

export type LeadAnalyticsDto =
  z.infer<
    typeof leadAnalyticsSchema
  >;