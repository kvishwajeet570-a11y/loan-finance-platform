import { z } from "zod";

/* =========================================
   MEDIA TYPE
========================================= */

export const mediaTypeEnum = z.enum([
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

export const mediaCategoryEnum = z.enum([
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

export const mediaStatusEnum = z.enum([
  "ACTIVE",
  "INACTIVE",
  "ARCHIVED",
  "DELETED",
]);

/* =========================================
   UPLOAD MEDIA
========================================= */

export const uploadMediaSchema =
  z.object({
    title: z.string()
      .min(2)
      .max(200),

    description:
      z.string()
      .max(1000)
      .optional(),

    mediaType:
      mediaTypeEnum,

    category:
      mediaCategoryEnum,

    fileName:
      z.string()
      .min(1),

    originalName:
      z.string()
      .min(1),

    fileUrl:
      z.string().url(),

    thumbnailUrl:
      z.string()
      .url()
      .optional(),

    fileSize:
      z.number()
      .positive(),

    mimeType:
      z.string(),

    tags:
      z.array(
        z.string()
      ).optional(),

    altText:
      z.string()
      .optional(),

    uploadedBy:
      z.string()
      .cuid()
      .optional(),
  });

/* =========================================
   UPDATE MEDIA
========================================= */

export const updateMediaSchema =
  z.object({
    title:
      z.string().optional(),

    description:
      z.string().optional(),

    category:
      mediaCategoryEnum.optional(),

    thumbnailUrl:
      z.string()
      .url()
      .optional(),

    tags:
      z.array(z.string())
      .optional(),

    altText:
      z.string().optional(),
  });

/* =========================================
   MEDIA STATUS UPDATE
========================================= */

export const updateMediaStatusSchema =
  z.object({
    mediaId:
      z.string().cuid(),

    status:
      mediaStatusEnum,
  });

/* =========================================
   FEATURE MEDIA
========================================= */

export const featureMediaSchema =
  z.object({
    mediaId:
      z.string().cuid(),

    isFeatured:
      z.boolean(),
  });

/* =========================================
   MEDIA FILTER
========================================= */

export const mediaFilterSchema =
  z.object({
    search:
      z.string().optional(),

    mediaType:
      mediaTypeEnum.optional(),

    category:
      mediaCategoryEnum.optional(),

    status:
      mediaStatusEnum.optional(),

    uploadedBy:
      z.string()
      .cuid()
      .optional(),

    isFeatured:
      z.boolean().optional(),

    page:
      z.coerce.number()
      .default(1),

    limit:
      z.coerce.number()
      .min(1)
      .max(100)
      .default(20),
  });

/* =========================================
   BULK DELETE MEDIA
========================================= */

export const bulkDeleteMediaSchema =
  z.object({
    mediaIds:
      z.array(
        z.string().cuid()
      ).min(1),
  });

/* =========================================
   MEDIA ANALYTICS
========================================= */

export const mediaAnalyticsSchema =
  z.object({
    category:
      mediaCategoryEnum.optional(),

    mediaType:
      mediaTypeEnum.optional(),

    startDate:
      z.string().optional(),

    endDate:
      z.string().optional(),
  });

/* =========================================
   TYPES
========================================= */

export type UploadMediaDto =
  z.infer<typeof uploadMediaSchema>;

export type UpdateMediaDto =
  z.infer<typeof updateMediaSchema>;

export type UpdateMediaStatusDto =
  z.infer<
    typeof updateMediaStatusSchema
  >;

export type FeatureMediaDto =
  z.infer<
    typeof featureMediaSchema
  >;

export type MediaFilterDto =
  z.infer<typeof mediaFilterSchema>;

export type BulkDeleteMediaDto =
  z.infer<
    typeof bulkDeleteMediaSchema
  >;

export type MediaAnalyticsDto =
  z.infer<
    typeof mediaAnalyticsSchema
  >;