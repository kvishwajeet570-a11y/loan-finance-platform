import { z } from "zod";

/* =========================================
   CREATE ADMIN
========================================= */

export const createAdminSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100),

  email: z
    .email("Invalid email address")
    .toLowerCase(),

  phoneNo: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid mobile number"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(50),

  role: z.enum([
    "SUPER_ADMIN",
    "ADMIN",
    "MANAGER",
    "TEAM_LEADER",
  ]),

  profileImage: z.string().optional(),

  isActive: z.boolean().default(true),
});

/* =========================================
   UPDATE ADMIN
========================================= */

export const updateAdminSchema =
  createAdminSchema.partial();

/* =========================================
   ASSIGN ROLE
========================================= */

export const assignRoleSchema = z.object({
  adminId: z.string().cuid(),
  roleId: z.string().cuid(),
});

/* =========================================
   BLOCK / UNBLOCK USER
========================================= */

export const blockUserSchema = z.object({
  userId: z.string().cuid(),

  reason: z
    .string()
    .min(5, "Reason is required")
    .max(300),
});

/* =========================================
   ADMIN DASHBOARD FILTER
========================================= */

export const adminDashboardFilterSchema =
  z.object({
    startDate: z.string().optional(),

    endDate: z.string().optional(),

    loanStatus: z.enum([
      "PENDING",
      "UNDER_REVIEW",
      "APPROVED",
      "REJECTED",
      "DISBURSED",
    ]).optional(),

    loanType: z.enum([
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

export const userFilterSchema = z.object({
  search: z.string().optional(),

  role: z.string().optional(),

  isBlocked: z.boolean().optional(),

  isVerified: z.boolean().optional(),

  page: z.coerce.number().default(1),

  limit: z.coerce.number().default(10),
});

/* =========================================
   LOAN FILTER
========================================= */

export const loanFilterSchema = z.object({
  search: z.string().optional(),

  status: z.enum([
    "PENDING",
    "UNDER_REVIEW",
    "APPROVED",
    "REJECTED",
    "DISBURSED",
  ]).optional(),

  loanType: z.string().optional(),

  page: z.coerce.number().default(1),

  limit: z.coerce.number().default(10),
});

/* =========================================
   TYPES
========================================= */

export type CreateAdminDto =
  z.infer<typeof createAdminSchema>;

export type UpdateAdminDto =
  z.infer<typeof updateAdminSchema>;

export type AssignRoleDto =
  z.infer<typeof assignRoleSchema>;

export type BlockUserDto =
  z.infer<typeof blockUserSchema>;

export type AdminDashboardFilterDto =
  z.infer<typeof adminDashboardFilterSchema>;

export type UserFilterDto =
  z.infer<typeof userFilterSchema>;

export type LoanFilterDto =
  z.infer<typeof loanFilterSchema>;