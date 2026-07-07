import { z } from "zod";

/* =========================================
   FAQ CATEGORY
========================================= */

export const faqCategoryEnum = z.enum([
  "GENERAL",
  "PERSONAL_LOAN",
  "BUSINESS_LOAN",
  "HOME_LOAN",
  "LAP",
  "CAR_LOAN",
  "CREDIT_CARD",
  "INSURANCE",
  "KYC",
  "PAYMENT",
  "DSA",
  "PARTNER",
  "ACCOUNT",
  "TECHNICAL",
]);

/* =========================================
   FAQ STATUS
========================================= */

export const faqStatusEnum = z.enum([
  "ACTIVE",
  "INACTIVE",
  "DRAFT",
]);

/* =========================================
   CREATE FAQ
========================================= */

export const createFaqSchema = z.object({
  question: z.string()
    .min(5)
    .max(300),

  answer: z.string()
    .min(10)
    .max(10000),

  category: faqCategoryEnum,

  displayOrder: z.number()
    .int()
    .min(0)
    .default(0),

  isFeatured: z.boolean()
    .default(false),

  status: faqStatusEnum
    .default("ACTIVE"),

  tags: z.array(
    z.string()
  ).optional(),
});

/* =========================================
   UPDATE FAQ
========================================= */

export const updateFaqSchema =
  createFaqSchema.partial();

/* =========================================
   FAQ STATUS UPDATE
========================================= */

export const updateFaqStatusSchema =
  z.object({
    faqId: z.string().cuid(),

    status: faqStatusEnum,
  });

/* =========================================
   FEATURE FAQ
========================================= */

export const featureFaqSchema =
  z.object({
    faqId: z.string().cuid(),

    isFeatured: z.boolean(),
  });

/* =========================================
   FAQ REORDER
========================================= */

export const reorderFaqSchema =
  z.object({
    faqId: z.string().cuid(),

    displayOrder:
      z.number().int().min(0),
  });

/* =========================================
   FAQ FILTER
========================================= */

export const faqFilterSchema =
  z.object({
    search: z.string().optional(),

    category:
      faqCategoryEnum.optional(),

    status:
      faqStatusEnum.optional(),

    isFeatured:
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
   FAQ ANALYTICS
========================================= */

export const faqAnalyticsSchema =
  z.object({
    startDate:
      z.string().optional(),

    endDate:
      z.string().optional(),
  });

/* =========================================
   EXPORT TYPES
========================================= */

export type CreateFaqDto =
  z.infer<typeof createFaqSchema>;

export type UpdateFaqDto =
  z.infer<typeof updateFaqSchema>;

export type UpdateFaqStatusDto =
  z.infer<
    typeof updateFaqStatusSchema
  >;

export type FeatureFaqDto =
  z.infer<
    typeof featureFaqSchema
  >;

export type ReorderFaqDto =
  z.infer<
    typeof reorderFaqSchema
  >;

export type FaqFilterDto =
  z.infer<typeof faqFilterSchema>;

export type FaqAnalyticsDto =
  z.infer<
    typeof faqAnalyticsSchema
  >;