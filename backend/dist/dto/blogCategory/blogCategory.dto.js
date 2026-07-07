"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categorySeoSchema = exports.featureCategorySchema = exports.updateCategoryStatusSchema = exports.blogCategoryFilterSchema = exports.updateBlogCategorySchema = exports.createBlogCategorySchema = void 0;
const zod_1 = require("zod");
/* =========================================
   CREATE BLOG CATEGORY
========================================= */
exports.createBlogCategorySchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(3, "Category name is required")
        .max(100),
    slug: zod_1.z
        .string()
        .min(3)
        .max(120),
    description: zod_1.z
        .string()
        .max(500)
        .optional(),
    icon: zod_1.z
        .string()
        .optional(),
    image: zod_1.z
        .string()
        .optional(),
    metaTitle: zod_1.z
        .string()
        .max(200)
        .optional(),
    metaDescription: zod_1.z
        .string()
        .max(300)
        .optional(),
    metaKeywords: zod_1.z
        .string()
        .optional(),
    displayOrder: zod_1.z
        .number()
        .int()
        .positive()
        .default(1),
    isFeatured: zod_1.z
        .boolean()
        .default(false),
    isActive: zod_1.z
        .boolean()
        .default(true),
});
/* =========================================
   UPDATE BLOG CATEGORY
========================================= */
exports.updateBlogCategorySchema = exports.createBlogCategorySchema.partial();
/* =========================================
   CATEGORY FILTER
========================================= */
exports.blogCategoryFilterSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    isFeatured: zod_1.z.boolean().optional(),
    isActive: zod_1.z.boolean().optional(),
    page: zod_1.z.coerce.number().default(1),
    limit: zod_1.z.coerce.number()
        .min(1)
        .max(100)
        .default(10),
});
/* =========================================
   CATEGORY STATUS
========================================= */
exports.updateCategoryStatusSchema = zod_1.z.object({
    categoryId: zod_1.z.string().cuid(),
    isActive: zod_1.z.boolean(),
});
/* =========================================
   FEATURE CATEGORY
========================================= */
exports.featureCategorySchema = zod_1.z.object({
    categoryId: zod_1.z.string().cuid(),
    isFeatured: zod_1.z.boolean(),
});
/* =========================================
   CATEGORY SEO
========================================= */
exports.categorySeoSchema = zod_1.z.object({
    categoryId: zod_1.z.string().cuid(),
    metaTitle: zod_1.z.string(),
    metaDescription: zod_1.z.string(),
    metaKeywords: zod_1.z.string(),
});
