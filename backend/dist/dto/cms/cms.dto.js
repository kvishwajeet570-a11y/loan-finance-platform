"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cmsSeoSchema = exports.updateCmsStatusSchema = exports.cmsPageFilterSchema = exports.updateCmsPageSchema = exports.createCmsPageSchema = exports.cmsStatusEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   PAGE STATUS
========================================= */
exports.cmsStatusEnum = zod_1.z.enum([
    "DRAFT",
    "PUBLISHED",
    "ARCHIVED",
]);
/* =========================================
   CREATE CMS PAGE
========================================= */
exports.createCmsPageSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(3)
        .max(200),
    slug: zod_1.z
        .string()
        .min(3)
        .max(200),
    content: zod_1.z
        .string()
        .min(10),
    pageType: zod_1.z.enum([
        "HOME",
        "ABOUT_US",
        "CONTACT_US",
        "PRIVACY_POLICY",
        "TERMS_CONDITIONS",
        "DISCLAIMER",
        "FAQ",
        "CUSTOM",
    ]),
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
    featuredImage: zod_1.z
        .string()
        .optional(),
    status: exports.cmsStatusEnum.default("DRAFT"),
    isActive: zod_1.z
        .boolean()
        .default(true),
});
/* =========================================
   UPDATE CMS PAGE
========================================= */
exports.updateCmsPageSchema = exports.createCmsPageSchema.partial();
/* =========================================
   PAGE FILTER
========================================= */
exports.cmsPageFilterSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    pageType: zod_1.z.enum([
        "HOME",
        "ABOUT_US",
        "CONTACT_US",
        "PRIVACY_POLICY",
        "TERMS_CONDITIONS",
        "DISCLAIMER",
        "FAQ",
        "CUSTOM",
    ]).optional(),
    status: exports.cmsStatusEnum.optional(),
    isActive: zod_1.z.boolean().optional(),
    page: zod_1.z.coerce.number().default(1),
    limit: zod_1.z.coerce.number()
        .min(1)
        .max(100)
        .default(10),
});
/* =========================================
   UPDATE STATUS
========================================= */
exports.updateCmsStatusSchema = zod_1.z.object({
    pageId: zod_1.z.string().cuid(),
    status: exports.cmsStatusEnum,
});
/* =========================================
   SEO UPDATE
========================================= */
exports.cmsSeoSchema = zod_1.z.object({
    pageId: zod_1.z.string().cuid(),
    metaTitle: zod_1.z.string(),
    metaDescription: zod_1.z.string(),
    metaKeywords: zod_1.z.string(),
});
