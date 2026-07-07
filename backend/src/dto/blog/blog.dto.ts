import { z } from "zod";

/* =========================================
   BLOG STATUS
========================================= */

export const blogStatusEnum = z.enum([
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
]);

/* =========================================
   BLOG CATEGORY
========================================= */

export const blogCategoryEnum = z.enum([
  "PERSONAL_LOAN",
  "BUSINESS_LOAN",
  "HOME_LOAN",
  "LAP",
  "CREDIT_CARD",
  "INSURANCE",
  "INVESTMENT",
  "FINANCE",
  "BANKING",
  "DSA",
  "NEWS",
]);

/* =========================================
   CREATE BLOG
========================================= */

export const createBlogSchema = z.object({
  title: z
    .string()
    .min(10)
    .max(200),

  slug: z
    .string()
    .min(3)
    .max(250),

  excerpt: z
    .string()
    .max(500)
    .optional(),

  content: z
    .string()
    .min(100),

  featuredImage: z
    .string()
    .optional(),

  category: blogCategoryEnum,

  tags: z
    .array(z.string())
    .default([]),

  authorId: z.string().cuid(),

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

  status: blogStatusEnum.default("DRAFT"),

  isFeatured: z
    .boolean()
    .default(false),

  publishAt: z
    .string()
    .optional(),
});

/* =========================================
   UPDATE BLOG
========================================= */

export const updateBlogSchema =
  createBlogSchema.partial();

/* =========================================
   BLOG FILTER
========================================= */

export const blogFilterSchema = z.object({
  search: z.string().optional(),

  category: blogCategoryEnum.optional(),

  status: blogStatusEnum.optional(),

  isFeatured: z.boolean().optional(),

  authorId: z.string().cuid().optional(),

  page: z.coerce.number().default(1),

  limit: z.coerce.number()
    .min(1)
    .max(100)
    .default(10),
});

/* =========================================
   BLOG STATUS UPDATE
========================================= */

export const updateBlogStatusSchema =
  z.object({
    blogId: z.string().cuid(),

    status: blogStatusEnum,
  });

/* =========================================
   FEATURE BLOG
========================================= */

export const featureBlogSchema =
  z.object({
    blogId: z.string().cuid(),

    isFeatured: z.boolean(),
  });

/* =========================================
   BLOG SEO UPDATE
========================================= */

export const blogSeoSchema =
  z.object({
    blogId: z.string().cuid(),

    metaTitle: z.string(),

    metaDescription: z.string(),

    metaKeywords: z.string(),
  });

/* =========================================
   TYPES
========================================= */

export type CreateBlogDto =
  z.infer<typeof createBlogSchema>;

export type UpdateBlogDto =
  z.infer<typeof updateBlogSchema>;

export type BlogFilterDto =
  z.infer<typeof blogFilterSchema>;

export type UpdateBlogStatusDto =
  z.infer<typeof updateBlogStatusSchema>;

export type FeatureBlogDto =
  z.infer<typeof featureBlogSchema>;

export type BlogSeoDto =
  z.infer<typeof blogSeoSchema>;