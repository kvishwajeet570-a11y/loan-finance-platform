import { z } from "zod";

/* =========================================
   GENDER
========================================= */

export const profileGenderEnum = z.enum([
  "MALE",
  "FEMALE",
  "OTHER",
]);

/* =========================================
   MARITAL STATUS
========================================= */

export const maritalStatusEnum = z.enum([
  "SINGLE",
  "MARRIED",
  "DIVORCED",
  "WIDOWED",
]);

/* =========================================
   EMPLOYMENT TYPE
========================================= */

const employmentTypeEnum = z.enum([
  "SALARIED",
  "SELF_EMPLOYED",
  "BUSINESS_OWNER",
  "FREELANCER",
  "STUDENT",
  "OTHER",
]);

/* =========================================
   UPDATE PROFILE
========================================= */

export const updateProfileSchema =
  z.object({
    fullName: z.string()
      .min(2)
      .max(100)
      .optional(),

    email: z.string()
      .email()
      .optional(),

    phoneNo: z.string()
      .regex(/^[6-9]\d{9}$/)
      .optional(),

    dob:
      z.string().optional(),

    gender:
      profileGenderEnum.optional(),

    maritalStatus:
      maritalStatusEnum.optional(),

    profileImage:
      z.string().url().optional(),

    address:
      z.string().optional(),

    city:
      z.string().optional(),

    state:
      z.string().optional(),

    pincode:
      z.string().optional(),

    occupation:
      z.string().optional(),

    employmentType:
      employmentTypeEnum.optional(),

    monthlyIncome:
      z.number()
      .positive()
      .optional(),

    companyName:
      z.string().optional(),
  });

/* =========================================
   UPDATE PROFILE IMAGE
========================================= */

export const updateProfileImageSchema =
  z.object({
    profileImage:
      z.string().url(),
  });

/* =========================================
   UPDATE ADDRESS
========================================= */

export const updateAddressSchema =
  z.object({
    address:
      z.string().min(5),

    city:
      z.string(),

    state:
      z.string(),

    pincode:
      z.string(),
  });

/* =========================================
   UPDATE CONTACT
========================================= */

export const updateContactSchema =
  z.object({
    email:
      z.string()
      .email()
      .optional(),

    phoneNo:
      z.string()
      .regex(/^[6-9]\d{9}$/)
      .optional(),
  });

/* =========================================
   CHANGE EMAIL REQUEST
========================================= */

export const changeEmailSchema =
  z.object({
    newEmail:
      z.string().email(),

    password:
      z.string().min(6),
  });

/* =========================================
   CHANGE PHONE REQUEST
========================================= */

export const changePhoneSchema =
  z.object({
    newPhoneNo:
      z.string()
      .regex(/^[6-9]\d{9}$/),

    password:
      z.string().min(6),
  });

/* =========================================
   PROFILE FILTER
========================================= */

export const profileFilterSchema =
  z.object({
    search:
      z.string().optional(),

    city:
      z.string().optional(),

    state:
      z.string().optional(),

    employmentType:
      employmentTypeEnum.optional(),

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
   PROFILE COMPLETENESS
========================================= */

export const profileCompletenessSchema =
  z.object({
    userId:
      z.string().cuid(),
  });

/* =========================================
   PROFILE ANALYTICS
========================================= */

export const profileAnalyticsSchema =
  z.object({
    startDate:
      z.string().optional(),

    endDate:
      z.string().optional(),
  });

/* =========================================
   TYPES
========================================= */

export type UpdateProfileDto =
  z.infer<typeof updateProfileSchema>;

export type UpdateProfileImageDto =
  z.infer<
    typeof updateProfileImageSchema
  >;

export type UpdateAddressDto =
  z.infer<
    typeof updateAddressSchema
  >;

export type UpdateContactDto =
  z.infer<
    typeof updateContactSchema
  >;

export type ChangeEmailDto =
  z.infer<
    typeof changeEmailSchema
  >;

export type ChangePhoneDto =
  z.infer<
    typeof changePhoneSchema
  >;

export type ProfileFilterDto =
  z.infer<
    typeof profileFilterSchema
  >;

export type ProfileCompletenessDto =
  z.infer<
    typeof profileCompletenessSchema
  >;

export type ProfileAnalyticsDto =
  z.infer<
    typeof profileAnalyticsSchema
  >;