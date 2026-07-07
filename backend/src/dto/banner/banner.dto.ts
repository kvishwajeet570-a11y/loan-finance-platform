import { z } from "zod";

/* =========================================
   BANNER TYPE
========================================= */

export const bannerTypeEnum = z.enum([
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

export const createBannerSchema = z.object({
  title: z
    .string()
    .min(3)
    .max(150),

  subtitle: z
    .string()
    .max(300)
    .optional(),

  description: z
    .string()
    .max(1000)
    .optional(),

  imageUrl: z
    .string()
    .min(1, "Banner image is required"),

  mobileImageUrl: z
    .string()
    .optional(),

  buttonText: z
    .string()
    .max(50)
    .optional(),

  buttonLink: z
    .string()
    .optional(),

  type: bannerTypeEnum,

  displayOrder: z
    .number()
    .int()
    .min(1),

  startDate: z
    .string()
    .optional(),

  endDate: z
    .string()
    .optional(),

  isActive: z
    .boolean()
    .default(true),
});

/* =========================================
   UPDATE BANNER
========================================= */

export const updateBannerSchema =
  createBannerSchema.partial();

/* =========================================
   BANNER STATUS
========================================= */

export const bannerStatusSchema = z.object({
  bannerId: z.string().cuid(),

  isActive: z.boolean(),
});

/* =========================================
   BANNER FILTER
========================================= */

export const bannerFilterSchema = z.object({
  search: z.string().optional(),

  type: bannerTypeEnum.optional(),

  isActive: z.boolean().optional(),

  page: z.coerce.number().default(1),

  limit: z.coerce.number()
    .min(1)
    .max(100)
    .default(10),
});

/* =========================================
   REORDER BANNER
========================================= */

export const reorderBannerSchema = z.object({
  bannerId: z.string().cuid(),

  displayOrder: z
    .number()
    .int()
    .positive(),
});

/* =========================================
   TYPES
========================================= */

export type CreateBannerDto =
  z.infer<typeof createBannerSchema>;

export type UpdateBannerDto =
  z.infer<typeof updateBannerSchema>;

export type BannerStatusDto =
  z.infer<typeof bannerStatusSchema>;

export type BannerFilterDto =
  z.infer<typeof bannerFilterSchema>;

export type ReorderBannerDto =
  z.infer<typeof reorderBannerSchema>;