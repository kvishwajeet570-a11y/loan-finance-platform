import { z } from "zod";

/* =========================================
   PAGE STATUS
========================================= */

export const cmsStatusEnum = z.enum([
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
]);

/* =========================================
   CREATE CMS PAGE
========================================= */

export const createCmsPageSchema = z.object({
  title: z
    .string()
    .min(3)
    .max(200),

  slug: z
    .string()
    .min(3)
    .max(200),

  content: z
    .string()
    .min(10),

  pageType: z.enum([
    "HOME",
    "ABOUT_US",
    "CONTACT_US",
    "PRIVACY_POLICY",
    "TERMS_CONDITIONS",
    "DISCLAIMER",
    "FAQ",
    "CUSTOM",
  ]),

  metaTitle: z
    .string()
    .max(200)
    .optional(),

  metaDescription: z
    .string()
    .max(300)
    .optional(),

  metaKeywords: z
    .string()
    .optional(),

  featuredImage: z
    .string()
    .optional(),

  status: cmsStatusEnum.default("DRAFT"),

  isActive: z
    .boolean()
    .default(true),
});

/* =========================================
   UPDATE CMS PAGE
========================================= */

export const updateCmsPageSchema =
  createCmsPageSchema.partial();

/* =========================================
   PAGE FILTER
========================================= */

export const cmsPageFilterSchema =
  z.object({
    search: z.string().optional(),

    pageType: z.enum([
      "HOME",
      "ABOUT_US",
      "CONTACT_US",
      "PRIVACY_POLICY",
      "TERMS_CONDITIONS",
      "DISCLAIMER",
      "FAQ",
      "CUSTOM",
    ]).optional(),

    status: cmsStatusEnum.optional(),

    isActive: z.boolean().optional(),

    page: z.coerce.number().default(1),

    limit: z.coerce.number()
      .min(1)
      .max(100)
      .default(10),
  });

/* =========================================
   UPDATE STATUS
========================================= */

export const updateCmsStatusSchema =
  z.object({
    pageId: z.string().cuid(),

    status: cmsStatusEnum,
  });

/* =========================================
   SEO UPDATE
========================================= */

export const cmsSeoSchema =
  z.object({
    pageId: z.string().cuid(),

    metaTitle: z.string(),

    metaDescription: z.string(),

    metaKeywords: z.string(),
  });

/* =========================================
   TYPES
========================================= */

export type CreateCmsPageDto =
  z.infer<typeof createCmsPageSchema>;

export type UpdateCmsPageDto =
  z.infer<typeof updateCmsPageSchema>;

export type CmsPageFilterDto =
  z.infer<typeof cmsPageFilterSchema>;

export type UpdateCmsStatusDto =
  z.infer<typeof updateCmsStatusSchema>;

export type CmsSeoDto =
  z.infer<typeof cmsSeoSchema>;