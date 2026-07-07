export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  PARTNER: "PARTNER",
  DSA: "DSA",
  EMPLOYEE: "EMPLOYEE",
  CUSTOMER: "CUSTOMER",
} as const;

export type UserRole =
  (typeof ROLES)[keyof typeof ROLES];

export const ADMIN_ROLES = [
  ROLES.SUPER_ADMIN,
  ROLES.ADMIN,
];

export const SALES_ROLES = [
  ROLES.PARTNER,
  ROLES.DSA,
];