export enum Role {
  SUPER_ADMIN = "superadmin",
  ADMIN = "admin",
  MANAGER = "manager",
  DSA = "dsa",
  PARTNER = "partner",
  CUSTOMER = "customer",
}

export const ADMIN_ROLES = [
  Role.SUPER_ADMIN,
  Role.ADMIN,
];

export const STAFF_ROLES = [
  Role.SUPER_ADMIN,
  Role.ADMIN,
  Role.MANAGER,
];

export const LOAN_ROLES = [
  Role.SUPER_ADMIN,
  Role.ADMIN,
  Role.DSA,
  Role.PARTNER,
];

export const ALL_ROLES = Object.values(Role);