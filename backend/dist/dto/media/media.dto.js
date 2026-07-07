"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaAnalyticsSchema = exports.bulkDeleteMediaSchema = exports.mediaFilterSchema = exports.featureMediaSchema = exports.updateMediaStatusSchema = exports.updateMediaSchema = exports.uploadMediaSchema = exports.mediaStatusEnum = exports.mediaCategoryEnum = exports.mediaTypeEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   MEDIA TYPE
========================================= */
exports.mediaTypeEnum = zod_1.z.enum([
    "IMAGE",
    "VIDEO",
    "PDF",
    "DOCUMENT",
    "AUDIO",
    "GIF",
]);
/* =========================================
   MEDIA CATEGORY
========================================= */
exports.mediaCategoryEnum = zod_1.z.enum([
    "BANNER",
    "BLOG",
    "LOAN",
    "INSURANCE",
    "FASTAG",
    "INVESTMENT",
    "PARTNER",
    "DSA",
    "PROFILE",
    "KYC",
    "MARKETING",
    "GALLERY",
    "REPORT",
    "OTHER",
]);
/* =========================================
   MEDIA STATUS
========================================= */
exports.mediaStatusEnum = zod_1.z.enum([
    "ACTIVE",
    "INACTIVE",
    "ARCHIVED",
    "DELETED",
]);
/* =========================================
   UPLOAD MEDIA
========================================= */
exports.uploadMediaSchema = zod_1.z.object({
    title: zod_1.z.string()
        .min(2)
        .max(200),
    description: zod_1.z.string()
        .max(1000)
        .optional(),
    mediaType: exports.mediaTypeEnum,
    category: exports.mediaCategoryEnum,
    fileName: zod_1.z.string()
        .min(1),
    originalName: zod_1.z.string()
        .min(1),
    fileUrl: zod_1.z.string().url(),
    thumbnailUrl: zod_1.z.string()
        .url()
        .optional(),
    fileSize: zod_1.z.number()
        .positive(),
    mimeType: zod_1.z.string(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    altText: zod_1.z.string()
        .optional(),
    uploadedBy: zod_1.z.string()
        .cuid()
        .optional(),
});
/* =========================================
   UPDATE MEDIA
========================================= */
exports.updateMediaSchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    category: exports.mediaCategoryEnum.optional(),
    thumbnailUrl: zod_1.z.string()
        .url()
        .optional(),
    tags: zod_1.z.array(zod_1.z.string())
        .optional(),
    altText: zod_1.z.string().optional(),
});
/* =========================================
   MEDIA STATUS UPDATE
========================================= */
exports.updateMediaStatusSchema = zod_1.z.object({
    mediaId: zod_1.z.string().cuid(),
    status: exports.mediaStatusEnum,
});
/* =========================================
   FEATURE MEDIA
========================================= */
exports.featureMediaSchema = zod_1.z.object({
    mediaId: zod_1.z.string().cuid(),
    isFeatured: zod_1.z.boolean(),
});
/* =========================================
   MEDIA FILTER
========================================= */
exports.mediaFilterSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    mediaType: exports.mediaTypeEnum.optional(),
    category: exports.mediaCategoryEnum.optional(),
    status: exports.mediaStatusEnum.optional(),
    uploadedBy: zod_1.z.string()
        .cuid()
        .optional(),
    isFeatured: zod_1.z.boolean().optional(),
    page: zod_1.z.coerce.number()
        .default(1),
    limit: zod_1.z.coerce.number()
        .min(1)
        .max(100)
        .default(20),
});
/* =========================================
   BULK DELETE MEDIA
========================================= */
exports.bulkDeleteMediaSchema = zod_1.z.object({
    mediaIds: zod_1.z.array(zod_1.z.string().cuid()).min(1),
});
/* =========================================
   MEDIA ANALYTICS
========================================= */
exports.mediaAnalyticsSchema = zod_1.z.object({
    category: exports.mediaCategoryEnum.optional(),
    mediaType: exports.mediaTypeEnum.optional(),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
});
