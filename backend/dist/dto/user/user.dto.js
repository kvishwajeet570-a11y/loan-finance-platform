"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkUserActionSchema = exports.userDashboardAnalyticsSchema = exports.userSearchFilterSchema = exports.userPreferenceSchema = exports.changeUserRoleSchema = exports.verifyUserSchema = exports.unblockUserSchema = exports.blockUserSchema = exports.updateUserProfileSchema = exports.updateUserSchema = exports.createUserSchema = exports.genderEnum = exports.userStatusEnum = exports.userRoleEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   USER ROLE
========================================= */
exports.userRoleEnum = zod_1.z.enum([
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
exports.userStatusEnum = zod_1.z.enum([
    "ACTIVE",
    "INACTIVE",
    "BLOCKED",
    "SUSPENDED",
    "PENDING_VERIFICATION",
]);
/* =========================================
   GENDER
========================================= */
exports.genderEnum = zod_1.z.enum([
    "MALE",
    "FEMALE",
    "OTHER",
]);
/* =========================================
   CREATE USER
========================================= */
exports.createUserSchema = zod_1.z.object({
    name: zod_1.z.string()
        .min(2)
        .max(100),
    email: zod_1.z.string()
        .email(),
    phoneNo: zod_1.z.string()
        .min(10)
        .max(15),
    password: zod_1.z.string()
        .min(8),
    role: exports.userRoleEnum
        .default("CUSTOMER"),
});
/* =========================================
   UPDATE USER
========================================= */
exports.updateUserSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(),
    name: zod_1.z.string()
        .min(2)
        .max(100)
        .optional(),
    email: zod_1.z.string()
        .email()
        .optional(),
    phoneNo: zod_1.z.string()
        .min(10)
        .max(15)
        .optional(),
    profileImage: zod_1.z.string()
        .url()
        .optional(),
});
/* =========================================
   USER PROFILE
========================================= */
exports.updateUserProfileSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(),
    gender: exports.genderEnum.optional(),
    dob: zod_1.z.string().optional(),
    address: zod_1.z.string()
        .max(500)
        .optional(),
    city: zod_1.z.string()
        .max(100)
        .optional(),
    state: zod_1.z.string()
        .max(100)
        .optional(),
    pincode: zod_1.z.string()
        .max(10)
        .optional(),
    profileImage: zod_1.z.string()
        .url()
        .optional(),
});
/* =========================================
   BLOCK USER
========================================= */
exports.blockUserSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(),
    reason: zod_1.z.string()
        .min(3)
        .max(500),
});
/* =========================================
   UNBLOCK USER
========================================= */
exports.unblockUserSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(),
});
/* =========================================
   VERIFY USER
========================================= */
exports.verifyUserSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(),
    remarks: zod_1.z.string()
        .optional(),
});
/* =========================================
   CHANGE ROLE
========================================= */
exports.changeUserRoleSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(),
    role: exports.userRoleEnum,
});
/* =========================================
   USER PREFERENCES
========================================= */
exports.userPreferenceSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(),
    emailNotifications: zod_1.z.boolean(),
    smsNotifications: zod_1.z.boolean(),
    whatsappNotifications: zod_1.z.boolean(),
    marketingConsent: zod_1.z.boolean(),
});
/* =========================================
   USER FILTER
========================================= */
exports.userSearchFilterSchema = zod_1.z.object({
    role: exports.userRoleEnum.optional(),
    status: exports.userStatusEnum.optional(),
    isVerified: zod_1.z.boolean().optional(),
    search: zod_1.z.string().optional(),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    page: zod_1.z.coerce.number()
        .default(1),
    limit: zod_1.z.coerce.number()
        .min(1)
        .max(100)
        .default(20),
});
/* =========================================
   USER ANALYTICS
========================================= */
exports.userDashboardAnalyticsSchema = zod_1.z.object({
    startDate: zod_1.z.string(),
    endDate: zod_1.z.string(),
    role: exports.userRoleEnum.optional(),
});
/* =========================================
   BULK ACTION
========================================= */
exports.bulkUserActionSchema = zod_1.z.object({
    userIds: zod_1.z.array(zod_1.z.string().cuid()).min(1),
    action: zod_1.z.enum([
        "BLOCK",
        "UNBLOCK",
        "VERIFY",
        "DELETE",
    ]),
});
