import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Database...");

  /* =========================================
     ROLES
  ========================================= */

  const roles = [
    {
      name: "Super Admin",
      code: "SUPER_ADMIN",
      slug: "super-admin",
      category: "ADMIN" as const,
      isSystem: true,
    },
    {
      name: "Admin",
      code: "ADMIN",
      slug: "admin",
      category: "ADMIN" as const,
      isSystem: true,
    },
    {
      name: "Customer",
      code: "CUSTOMER",
      slug: "customer",
      category: "CUSTOMER" as const,
      isSystem: true,
    },
    {
      name: "DSA",
      code: "DSA",
      slug: "dsa",
      category: "DSA" as const,
      isSystem: true,
    },
    {
      name: "Partner",
      code: "PARTNER",
      slug: "partner",
      category: "PARTNER" as const,
      isSystem: true,
    },
    {
      name: "Support",
      code: "SUPPORT",
      slug: "support",
      category: "STAFF" as const,
      isSystem: true,
    },
    {
      name: "Loan Manager",
      code: "LOAN_MANAGER",
      slug: "loan-manager",
      category: "STAFF" as const,
      isSystem: true,
    },
    {
      name: "Finance Manager",
      code: "FINANCE_MANAGER",
      slug: "finance-manager",
      category: "STAFF" as const,
      isSystem: true,
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: {
        code: role.code,
      },
      update: {
        name: role.name,
        slug: role.slug,
        category: role.category,
        isSystem: role.isSystem,
      },
      create: {
        name: role.name,
        code: role.code,
        slug: role.slug,
        description: `${role.name} Role`,
        category: role.category,
        isSystem: role.isSystem,
        isActive: true,
      },
    });
  }

  console.log("✅ Roles Seeded");

  /* =========================================
     PASSWORD
  ========================================= */

  const hashedPassword = await bcrypt.hash(
    "Admin@123",
    12
  );

  /* =========================================
     SUPER ADMIN ROLE
  ========================================= */

  const superAdminRole = await prisma.role.findUnique({
    where: {
      code: "SUPER_ADMIN",
    },
  });

  if (!superAdminRole) {
    throw new Error("SUPER_ADMIN role not found");
  }

  /* =========================================
     SUPER ADMIN
  ========================================= */

  const superAdmin = await prisma.user.upsert({
    where: {
      email: "superadmin@loanfinance.com",
    },
    update: {
      role: "SUPER_ADMIN",
      roleId: superAdminRole.id,
      isVerified: true,
      isActive: true,
    },
    create: {
      name: "Super Admin",
      email: "superadmin@loanfinance.com",
      phoneNo: "9999999999",
      password: hashedPassword,

      role: "SUPER_ADMIN",
      roleId: superAdminRole.id,

      isVerified: true,
      isActive: true,
      isBlocked: false,
    },
  });

  console.log("✅ Super Admin Created");

  /* =========================================
     ADMIN ROLE
  ========================================= */

  const adminRole = await prisma.role.findUnique({
    where: {
      code: "ADMIN",
    },
  });

  if (!adminRole) {
    throw new Error("ADMIN role not found");
  }

  /* =========================================
     ADMIN
  ========================================= */

  await prisma.user.upsert({
    where: {
      email: "admin@loanfinance.com",
    },
    update: {
      role: "ADMIN",
      roleId: adminRole.id,
      isVerified: true,
      isActive: true,
    },
    create: {
      name: "Admin User",
      email: "admin@loanfinance.com",
      phoneNo: "8888888888",
      password: hashedPassword,

      role: "ADMIN",
      roleId: adminRole.id,

      isVerified: true,
      isActive: true,
      isBlocked: false,
    },
  });

  console.log("✅ Admin Created");

  /* =========================================
     DEFAULT SETTINGS
  ========================================= */

  const settings = [
    {
      key: "SITE_NAME",
      value: "India Loan Finance",
      category: "GENERAL",
      description: "Website name",
      isPublic: true,
    },
    {
      key: "SITE_URL",
      value: "https://indialoanfinance.com",
      category: "GENERAL",
      description: "Website URL",
      isPublic: true,
    },
    {
      key: "SUPPORT_EMAIL",
      value: "support@indialoanfinance.com",
      category: "SUPPORT",
      description: "Support email address",
      isPublic: true,
    },
    {
      key: "SUPPORT_PHONE",
      value: "8292908077",
      category: "SUPPORT",
      description: "Support phone number",
      isPublic: true,
    },
    {
      key: "MAINTENANCE_MODE",
      value: false,
      category: "SYSTEM",
      description: "Website maintenance mode",
      isPublic: false,
    },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: {
        key: setting.key,
      },
      update: {
        value: setting.value,
        category: setting.category,
        description: setting.description,
        isPublic: setting.isPublic,
      },
      create: {
        key: setting.key,
        value: setting.value,
        category: setting.category,
        description: setting.description,
        isPublic: setting.isPublic,
        isActive: true,
        isEditable: true,
      },
    });
  }

  console.log("✅ Settings Seeded");

  /* =========================================
     WALLET
  ========================================= */

  await prisma.wallet.upsert({
    where: {
      userId: superAdmin.id,
    },
    update: {},
    create: {
      userId: superAdmin.id,
      balance: 0,
      cashback: 0,
      rewardBalance: 0,
      totalEarnings: 0,
      isFrozen: false,
      isBlocked: false,
    },
  });

  console.log("✅ Wallet Created");

  /* =========================================
     PERMISSIONS
  ========================================= */

  const permissions = [
    {
      name: "Manage Users",
      code: "MANAGE_USERS",
      module: "USER",
      action: "MANAGE",
      slug: "manage-users",
    },
    {
      name: "Manage Loans",
      code: "MANAGE_LOANS",
      module: "LOAN",
      action: "MANAGE",
      slug: "manage-loans",
    },
    {
      name: "Manage KYC",
      code: "MANAGE_KYC",
      module: "KYC",
      action: "MANAGE",
      slug: "manage-kyc",
    },
    {
      name: "Manage Transactions",
      code: "MANAGE_TRANSACTIONS",
      module: "TRANSACTION",
      action: "MANAGE",
      slug: "manage-transactions",
    },
    {
      name: "Manage Reports",
      code: "MANAGE_REPORTS",
      module: "REPORT",
      action: "MANAGE",
      slug: "manage-reports",
    },
    {
      name: "Manage Settings",
      code: "MANAGE_SETTINGS",
      module: "SETTING",
      action: "MANAGE",
      slug: "manage-settings",
    },
    {
      name: "View Analytics",
      code: "VIEW_ANALYTICS",
      module: "ANALYTICS",
      action: "VIEW",
      slug: "view-analytics",
    },
    {
      name: "Full Access",
      code: "FULL_ACCESS",
      module: "SYSTEM",
      action: "ALL",
      slug: "full-access",
    },
  ];

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: {
        code: permission.code,
      },
      update: {
        name: permission.name,
        module: permission.module,
        action: permission.action,
        slug: permission.slug,
      },
      create: {
        name: permission.name,
        code: permission.code,
        module: permission.module,
        action: permission.action,
        slug: permission.slug,
        status: "ACTIVE",
      },
    });
  }

  console.log("✅ Permissions Seeded");

  /* =========================================
     SUPER ADMIN PERMISSIONS
  ========================================= */

  const allPermissions = await prisma.permission.findMany();

  for (const permission of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: superAdminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: superAdminRole.id,
        permissionId: permission.id,
      },
    });
  }

  console.log(" Super Admin Permissions Assigned");

  /* =========================================
     COMPLETE
  ========================================= */

  console.log(" Database Seed Completed");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(" Seed Error:", error);

    await prisma.$disconnect();

    process.exit(1);
  });