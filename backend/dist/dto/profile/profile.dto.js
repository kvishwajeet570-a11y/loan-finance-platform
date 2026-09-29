"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileAnalyticsSchema = exports.profileCompletenessSchema = exports.profileFilterSchema = exports.changePhoneSchema = exports.changeEmailSchema = exports.updateContactSchema = exports.updateAddressSchema = exports.updateProfileImageSchema = exports.updateProfileSchema = exports.maritalStatusEnum = exports.profileGenderEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   GENDER
========================================= */
exports.profileGenderEnum = zod_1.z.enum([
    "MALE",
    "FEMALE",
    "OTHER",
]);
/* =========================================
   MARITAL STATUS
========================================= */
exports.maritalStatusEnum = zod_1.z.enum([
    "SINGLE",
    "MARRIED",
    "DIVORCED",
    "WIDOWED",
]);
/* =========================================
   EMPLOYMENT TYPE
========================================= */
const employmentTypeEnum = zod_1.z.enum([
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
exports.updateProfileSchema = zod_1.z.object({
    fullName: zod_1.z.string()
        .min(2)
        .max(100)
        .optional(),
    email: zod_1.z.string()
        .email()
        .optional(),
    phoneNo: zod_1.z.string()
        .regex(/^[6-9]\d{9}$/)
        .optional(),
    dob: zod_1.z.string().optional(),
    gender: exports.profileGenderEnum.optional(),
    maritalStatus: exports.maritalStatusEnum.optional(),
    profileImage: zod_1.z.string().url().optional(),
    address: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
    pincode: zod_1.z.string().optional(),
    occupation: zod_1.z.string().optional(),
    employmentType: employmentTypeEnum.optional(),
    monthlyIncome: zod_1.z.number()
        .positive()
        .optional(),
    companyName: zod_1.z.string().optional(),
});
/* =========================================
   UPDATE PROFILE IMAGE
========================================= */
exports.updateProfileImageSchema = zod_1.z.object({
    profileImage: zod_1.z.string().url(),
});
/* =========================================
   UPDATE ADDRESS
========================================= */
exports.updateAddressSchema = zod_1.z.object({
    address: zod_1.z.string().min(5),
    city: zod_1.z.string(),
    state: zod_1.z.string(),
    pincode: zod_1.z.string(),
});
/* =========================================
   UPDATE CONTACT
========================================= */
exports.updateContactSchema = zod_1.z.object({
    email: zod_1.z.string()
        .email()
        .optional(),
    phoneNo: zod_1.z.string()
        .regex(/^[6-9]\d{9}$/)
        .optional(),
});
/* =========================================
   CHANGE EMAIL REQUEST
========================================= */
exports.changeEmailSchema = zod_1.z.object({
    newEmail: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
/* =========================================
   CHANGE PHONE REQUEST
========================================= */
exports.changePhoneSchema = zod_1.z.object({
    newPhoneNo: zod_1.z.string()
        .regex(/^[6-9]\d{9}$/),
    password: zod_1.z.string().min(6),
});
/* =========================================
   PROFILE FILTER
========================================= */
exports.profileFilterSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
    employmentType: employmentTypeEnum.optional(),
    page: zod_1.z.coerce.number()
        .default(1),
    limit: zod_1.z.coerce.number()
        .min(1)
        .max(100)
        .default(20),
});
/* =========================================
   PROFILE COMPLETENESS
========================================= */
exports.profileCompletenessSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(),
});
/* =========================================
   PROFILE ANALYTICS
========================================= */
exports.profileAnalyticsSchema = zod_1.z.object({
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
});
