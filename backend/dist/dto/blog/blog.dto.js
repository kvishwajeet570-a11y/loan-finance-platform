"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogSeoSchema = exports.featureBlogSchema = exports.updateBlogStatusSchema = exports.blogFilterSchema = exports.updateBlogSchema = exports.createBlogSchema = exports.blogCategoryEnum = exports.blogStatusEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   BLOG STATUS
========================================= */
exports.blogStatusEnum = zod_1.z.enum([
    "DRAFT",
    "PUBLISHED",
    "ARCHIVED",
]);
/* =========================================
   BLOG CATEGORY
========================================= */
exports.blogCategoryEnum = zod_1.z.enum([
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
exports.createBlogSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(10)
        .max(200),
    slug: zod_1.z
        .string()
        .min(3)
        .max(250),
    excerpt: zod_1.z
        .string()
        .max(500)
        .optional(),
    content: zod_1.z
        .string()
        .min(100),
    featuredImage: zod_1.z
        .string()
        .optional(),
    category: exports.blogCategoryEnum,
    tags: zod_1.z
        .array(zod_1.z.string())
        .default([]),
    authorId: zod_1.z.string().cuid(),
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
    status: exports.blogStatusEnum.default("DRAFT"),
    isFeatured: zod_1.z
        .boolean()
        .default(false),
    publishAt: zod_1.z
        .string()
        .optional(),
});
/* =========================================
   UPDATE BLOG
========================================= */
exports.updateBlogSchema = exports.createBlogSchema.partial();
/* =========================================
   BLOG FILTER
========================================= */
exports.blogFilterSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    category: exports.blogCategoryEnum.optional(),
    status: exports.blogStatusEnum.optional(),
    isFeatured: zod_1.z.boolean().optional(),
    authorId: zod_1.z.string().cuid().optional(),
    page: zod_1.z.coerce.number().default(1),
    limit: zod_1.z.coerce.number()
        .min(1)
        .max(100)
        .default(10),
});
/* =========================================
   BLOG STATUS UPDATE
========================================= */
exports.updateBlogStatusSchema = zod_1.z.object({
    blogId: zod_1.z.string().cuid(),
    status: exports.blogStatusEnum,
});
/* =========================================
   FEATURE BLOG
========================================= */
exports.featureBlogSchema = zod_1.z.object({
    blogId: zod_1.z.string().cuid(),
    isFeatured: zod_1.z.boolean(),
});
/* =========================================
   BLOG SEO UPDATE
========================================= */
exports.blogSeoSchema = zod_1.z.object({
    blogId: zod_1.z.string().cuid(),
    metaTitle: zod_1.z.string(),
    metaDescription: zod_1.z.string(),
    metaKeywords: zod_1.z.string(),
});
