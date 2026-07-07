"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loanFilterSchema = exports.userFilterSchema = exports.adminDashboardFilterSchema = exports.blockUserSchema = exports.assignRoleSchema = exports.updateAdminSchema = exports.createAdminSchema = void 0;
const zod_1 = require("zod");
/* =========================================
   CREATE ADMIN
========================================= */
exports.createAdminSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(3, "Name must be at least 3 characters")
        .max(100),
    email: zod_1.z
        .email("Invalid email address")
        .toLowerCase(),
    phoneNo: zod_1.z
        .string()
        .regex(/^[6-9]\d{9}$/, "Invalid mobile number"),
    password: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(50),
    role: zod_1.z.enum([
        "SUPER_ADMIN",
        "ADMIN",
        "MANAGER",
        "TEAM_LEADER",
    ]),
    profileImage: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean().default(true),
});
/* =========================================
   UPDATE ADMIN
========================================= */
exports.updateAdminSchema = exports.createAdminSchema.partial();
/* =========================================
   ASSIGN ROLE
========================================= */
exports.assignRoleSchema = zod_1.z.object({
    adminId: zod_1.z.string().cuid(),
    roleId: zod_1.z.string().cuid(),
});
/* =========================================
   BLOCK / UNBLOCK USER
========================================= */
exports.blockUserSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid(),
    reason: zod_1.z
        .string()
        .min(5, "Reason is required")
        .max(300),
});
/* =========================================
   ADMIN DASHBOARD FILTER
========================================= */
exports.adminDashboardFilterSchema = zod_1.z.object({
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    loanStatus: zod_1.z.enum([
        "PENDING",
        "UNDER_REVIEW",
        "APPROVED",
        "REJECTED",
        "DISBURSED",
    ]).optional(),
    loanType: zod_1.z.enum([
        "PERSONAL_LOAN",
        "BUSINESS_LOAN",
        "HOME_LOAN",
        "LAP",
        "CAR_LOAN",
        "CREDIT_CARD",
    ]).optional(),
});
/* =========================================
   USER SEARCH FILTER
========================================= */
exports.userFilterSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    role: zod_1.z.string().optional(),
    isBlocked: zod_1.z.boolean().optional(),
    isVerified: zod_1.z.boolean().optional(),
    page: zod_1.z.coerce.number().default(1),
    limit: zod_1.z.coerce.number().default(10),
});
/* =========================================
   LOAN FILTER
========================================= */
exports.loanFilterSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    status: zod_1.z.enum([
        "PENDING",
        "UNDER_REVIEW",
        "APPROVED",
        "REJECTED",
        "DISBURSED",
    ]).optional(),
    loanType: zod_1.z.string().optional(),
    page: zod_1.z.coerce.number().default(1),
    limit: zod_1.z.coerce.number().default(10),
});
