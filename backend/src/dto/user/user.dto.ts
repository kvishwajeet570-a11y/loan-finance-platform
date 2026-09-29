import { z } from "zod";

/* =========================================
   USER ROLE
========================================= */

export const userRoleEnum = z.enum([
  "SUPER_ADMIN",
  "ADMIN",
  "MANAGER",
  "DSA",
  "PARTNER",
  "CUSTOMER",
]);

/* =========================================
   USER STATUS
========================================= */

export const userStatusEnum = z.enum([
  "ACTIVE",
  "INACTIVE",
  "BLOCKED",
  "SUSPENDED",
  "PENDING_VERIFICATION",
]);

/* =========================================
   GENDER
========================================= */

export const genderEnum = z.enum([
  "MALE",
  "FEMALE",
  "OTHER",
]);

/* =========================================
   CREATE USER
========================================= */

export const createUserSchema = z.object({
  name: z.string()
    .min(2)
    .max(100),

  email: z.string()
    .email(),

  phoneNo: z.string()
    .min(10)
    .max(15),

  password: z.string()
    .min(8),

  role: userRoleEnum
    .default("CUSTOMER"),
});

/* =========================================
   UPDATE USER
========================================= */

export const updateUserSchema = z.object({
  userId:
    z.string().cuid(),

  name:
    z.string()
    .min(2)
    .max(100)
    .optional(),

  email:
    z.string()
    .email()
    .optional(),

  phoneNo:
    z.string()
    .min(10)
    .max(15)
    .optional(),

  profileImage:
    z.string()
    .url()
    .optional(),
});

/* =========================================
   USER PROFILE
========================================= */

export const updateUserProfileSchema =
  z.object({
    userId:
      z.string().cuid(),

    gender:
      genderEnum.optional(),

    dob:
      z.string().optional(),

    address:
      z.string()
      .max(500)
      .optional(),

    city:
      z.string()
      .max(100)
      .optional(),

    state:
      z.string()
      .max(100)
      .optional(),

    pincode:
      z.string()
      .max(10)
      .optional(),

    profileImage:
      z.string()
      .url()
      .optional(),
  });

/* =========================================
   BLOCK USER
========================================= */

export const blockUserSchema =
  z.object({
    userId:
      z.string().cuid(),

    reason:
      z.string()
      .min(3)
      .max(500),
  });

/* =========================================
   UNBLOCK USER
========================================= */

export const unblockUserSchema =
  z.object({
    userId:
      z.string().cuid(),
  });

/* =========================================
   VERIFY USER
========================================= */

export const verifyUserSchema =
  z.object({
    userId:
      z.string().cuid(),

    remarks:
      z.string()
      .optional(),
  });

/* =========================================
   CHANGE ROLE
========================================= */

export const changeUserRoleSchema =
  z.object({
    userId:
      z.string().cuid(),

    role:
      userRoleEnum,
  });

/* =========================================
   USER PREFERENCES
========================================= */

export const userPreferenceSchema =
  z.object({
    userId:
      z.string().cuid(),

    emailNotifications:
      z.boolean(),

    smsNotifications:
      z.boolean(),

    whatsappNotifications:
      z.boolean(),

    marketingConsent:
      z.boolean(),
  });

/* =========================================
   USER FILTER
========================================= */

export const userSearchFilterSchema =

  z.object({
    role:
      userRoleEnum.optional(),

    status:
      userStatusEnum.optional(),

    isVerified:
      z.boolean().optional(),

    search:
      z.string().optional(),

    startDate:
      z.string().optional(),

    endDate:
      z.string().optional(),

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
   USER ANALYTICS
========================================= */

export const userDashboardAnalyticsSchema =
  z.object({
    startDate:
      z.string(),

    endDate:
      z.string(),

    role:
      userRoleEnum.optional(),
  });

/* =========================================
   BULK ACTION
========================================= */

export const bulkUserActionSchema =
  z.object({
    userIds:
      z.array(
        z.string().cuid()
      ).min(1),

    action:
      z.enum([
        "BLOCK",
        "UNBLOCK",
        "VERIFY",
        "DELETE",
      ]),
  });

/* =========================================
   TYPES
========================================= */

export type CreateUserDto =
  z.infer<typeof createUserSchema>;

export type UpdateUserDto =
  z.infer<typeof updateUserSchema>;

export type UpdateUserProfileDto =
  z.infer<
    typeof updateUserProfileSchema
  >;

export type BlockUserDto =
  z.infer<
    typeof blockUserSchema
  >;

export type UnblockUserDto =
  z.infer<
    typeof unblockUserSchema
  >;

export type VerifyUserDto =
  z.infer<
    typeof verifyUserSchema
  >;

export type ChangeUserRoleDto =
  z.infer<
    typeof changeUserRoleSchema
  >;

export type UserPreferenceDto =
  z.infer<
    typeof userPreferenceSchema
  >;

export type UserFilterDto =
  z.infer<
    typeof userSearchFilterSchema
  >;

export type UserAnalyticsDto =
  z.infer<
    typeof userDashboardAnalyticsSchema
  >;

export type BulkUserActionDto =
  z.infer<
    typeof bulkUserActionSchema
  >;