import { z } from "zod";

/* =========================================
   DEVICE TYPE
========================================= */

export const deviceTypeEnum = z.enum([
  "ANDROID",
  "IOS",
  "WEB",
  "WINDOWS",
  "MAC",
  "LINUX",
]);

/* =========================================
   DEVICE STATUS
========================================= */

export const deviceStatusEnum = z.enum([
  "ACTIVE",
  "INACTIVE",
  "BLOCKED",
  "SUSPICIOUS",
]);

/* =========================================
   REGISTER DEVICE
========================================= */

export const registerDeviceSchema =
  z.object({
    userId: z.string().cuid(),

    deviceId: z.string().min(5),

    deviceName: z.string().min(2),

    deviceType: deviceTypeEnum,

    deviceModel: z.string().optional(),

    operatingSystem:
      z.string().optional(),

    browser: z.string().optional(),

    ipAddress: z.string().optional(),

    location: z.string().optional(),

    pushToken: z.string().optional(),
  });

/* =========================================
   UPDATE DEVICE
========================================= */

export const updateDeviceSchema =
  z.object({
    deviceName: z.string().optional(),

    deviceModel: z.string().optional(),

    operatingSystem:
      z.string().optional(),

    browser: z.string().optional(),

    pushToken: z.string().optional(),
  });

/* =========================================
   BLOCK DEVICE
========================================= */

export const blockDeviceSchema =
  z.object({
    deviceId: z.string().min(5),

    reason: z
      .string()
      .min(5)
      .max(500),
  });

/* =========================================
   DEVICE STATUS UPDATE
========================================= */

export const updateDeviceStatusSchema =
  z.object({
    deviceId: z.string().min(5),

    status: deviceStatusEnum,
  });

/* =========================================
   DEVICE LOGIN TRACKING
========================================= */

export const deviceLoginSchema =
  z.object({
    deviceId: z.string(),

    userId: z.string().cuid(),

    ipAddress: z.string(),

    location: z.string().optional(),
  });

/* =========================================
   TRUST DEVICE
========================================= */

export const trustDeviceSchema =
  z.object({
    deviceId: z.string(),

    userId: z.string().cuid(),
  });

/* =========================================
   DEVICE FILTER
========================================= */

export const deviceFilterSchema =
  z.object({
    search: z.string().optional(),

    deviceType:
      deviceTypeEnum.optional(),

    status:
      deviceStatusEnum.optional(),

    userId:
      z.string().cuid().optional(),

    page: z.coerce.number()
      .default(1),

    limit: z.coerce.number()
      .min(1)
      .max(100)
      .default(10),
  });

/* =========================================
   DEVICE SECURITY CHECK
========================================= */

export const deviceSecuritySchema =
  z.object({
    deviceId: z.string(),

    ipAddress: z.string(),

    location: z.string(),

    riskScore: z.number()
      .min(0)
      .max(100),
  });

/* =========================================
   EXPORT TYPES
========================================= */

export type RegisterDeviceDto =
  z.infer<typeof registerDeviceSchema>;

export type UpdateDeviceDto =
  z.infer<typeof updateDeviceSchema>;

export type BlockDeviceDto =
  z.infer<typeof blockDeviceSchema>;

export type UpdateDeviceStatusDto =
  z.infer<
    typeof updateDeviceStatusSchema
  >;

export type DeviceLoginDto =
  z.infer<typeof deviceLoginSchema>;

export type TrustDeviceDto =
  z.infer<typeof trustDeviceSchema>;

export type DeviceFilterDto =
  z.infer<typeof deviceFilterSchema>;

export type DeviceSecurityDto =
  z.infer<typeof deviceSecuritySchema>;