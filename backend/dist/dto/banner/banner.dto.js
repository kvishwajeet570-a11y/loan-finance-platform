"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorderBannerSchema = exports.bannerFilterSchema = exports.bannerStatusSchema = exports.updateBannerSchema = exports.createBannerSchema = exports.bannerTypeEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   BANNER TYPE
========================================= */
exports.bannerTypeEnum = zod_1.z.enum([
    "HOME",
    "LOAN",
    "INSURANCE",
    "DSA",
    "PARTNER",
    "PROMOTION",
    "APP_DOWNLOAD",
]);
/* =========================================
   CREATE BANNER
========================================= */
exports.createBannerSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(3)
        .max(150),
    subtitle: zod_1.z
        .string()
        .max(300)
        .optional(),
    description: zod_1.z
        .string()
        .max(1000)
        .optional(),
    imageUrl: zod_1.z
        .string()
        .min(1, "Banner image is required"),
    mobileImageUrl: zod_1.z
        .string()
        .optional(),
    buttonText: zod_1.z
        .string()
        .max(50)
        .optional(),
    buttonLink: zod_1.z
        .string()
        .optional(),
    type: exports.bannerTypeEnum,
    displayOrder: zod_1.z
        .number()
        .int()
        .min(1),
    startDate: zod_1.z
        .string()
        .optional(),
    endDate: zod_1.z
        .string()
        .optional(),
    isActive: zod_1.z
        .boolean()
        .default(true),
});
/* =========================================
   UPDATE BANNER
========================================= */
exports.updateBannerSchema = exports.createBannerSchema.partial();
/* =========================================
   BANNER STATUS
========================================= */
exports.bannerStatusSchema = zod_1.z.object({
    bannerId: zod_1.z.string().cuid(),
    isActive: zod_1.z.boolean(),
});
/* =========================================
   BANNER FILTER
========================================= */
exports.bannerFilterSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    type: exports.bannerTypeEnum.optional(),
    isActive: zod_1.z.boolean().optional(),
    page: zod_1.z.coerce.number().default(1),
    limit: zod_1.z.coerce.number()
        .min(1)
        .max(100)
        .default(10),
});
/* =========================================
   REORDER BANNER
========================================= */
exports.reorderBannerSchema = zod_1.z.object({
    bannerId: zod_1.z.string().cuid(),
    displayOrder: zod_1.z
        .number()
        .int()
        .positive(),
});
