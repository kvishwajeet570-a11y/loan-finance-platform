import { z } from "zod";

/* =========================================
   CREATE BLOG CATEGORY
========================================= */

export const createBlogCategorySchema = z.object({
  name: z
    .string()
    .min(3, "Category name is required")
    .max(100),

  slug: z
    .string()
    .min(3)
    .max(120),

  description: z
    .string()
    .max(500)
    .optional(),

  icon: z
    .string()
    .optional(),

  image: z
    .string()
    .optional(),

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

  displayOrder: z
    .number()
    .int()
    .positive()
    .default(1),

  isFeatured: z
    .boolean()
    .default(false),

  isActive: z
    .boolean()
    .default(true),
});

/* =========================================
   UPDATE BLOG CATEGORY
========================================= */

export const updateBlogCategorySchema =
  createBlogCategorySchema.partial();

/* =========================================
   CATEGORY FILTER
========================================= */

export const blogCategoryFilterSchema =
  z.object({
    search: z.string().optional(),

    isFeatured: z.boolean().optional(),

    isActive: z.boolean().optional(),

    page: z.coerce.number().default(1),

    limit: z.coerce.number()
      .min(1)
      .max(100)
      .default(10),
  });

/* =========================================
   CATEGORY STATUS
========================================= */

export const updateCategoryStatusSchema =
  z.object({
    categoryId: z.string().cuid(),

    isActive: z.boolean(),
  });

/* =========================================
   FEATURE CATEGORY
========================================= */

export const featureCategorySchema =
  z.object({
    categoryId: z.string().cuid(),

    isFeatured: z.boolean(),
  });

/* =========================================
   CATEGORY SEO
========================================= */

export const categorySeoSchema =
  z.object({
    categoryId: z.string().cuid(),

    metaTitle: z.string(),

    metaDescription: z.string(),

    metaKeywords: z.string(),
  });

/* =========================================
   TYPES
========================================= */

export type CreateBlogCategoryDto =
  z.infer<typeof createBlogCategorySchema>;

export type UpdateBlogCategoryDto =
  z.infer<typeof updateBlogCategorySchema>;

export type BlogCategoryFilterDto =
  z.infer<typeof blogCategoryFilterSchema>;

export type UpdateCategoryStatusDto =
  z.infer<typeof updateCategoryStatusSchema>;

export type FeatureCategoryDto =
  z.infer<typeof featureCategorySchema>;

export type CategorySeoDto =
  z.infer<typeof categorySeoSchema>;