"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log("🌱 Seeding Database...");
    /* =========================================
       ROLES
    ========================================= */
    const roles = [
        "SUPER_ADMIN",
        "ADMIN",
        "CUSTOMER",
        "DSA",
        "PARTNER",
        "SUPPORT",
        "LOAN_MANAGER",
        "FINANCE_MANAGER",
    ];
    for (const role of roles) {
        await prisma.role.upsert({
            where: { name: role },
            update: {},
            create: {
                name: role,
                description: `${role} Role`,
            },
        });
    }
    console.log("✅ Roles Seeded");
    /* =========================================
       SUPER ADMIN
    ========================================= */
    const hashedPassword = await bcryptjs_1.default.hash("Admin@123", 12);
    const superAdminRole = await prisma.role.findUnique({
        where: {
            name: "SUPER_ADMIN",
        },
    });
    const superAdmin = await prisma.user.upsert({
        where: {
            email: "superadmin@loanfinance.com",
        },
        update: {},
        create: {
            name: "Super Admin",
            email: "superadmin@loanfinance.com",
            phoneNo: "9999999999",
            password: hashedPassword,
            role: "SUPER_ADMIN",
            isVerified: true,
        },
    });
    console.log("✅ Super Admin Created");
    /* =========================================
       ADMIN
    ========================================= */
    await prisma.user.upsert({
        where: {
            email: "admin@loanfinance.com",
        },
        update: {},
        create: {
            name: "Admin User",
            email: "admin@loanfinance.com",
            phoneNo: "8888888888",
            password: hashedPassword,
            role: "ADMIN",
            isVerified: true,
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
        },
        {
            key: "SITE_URL",
            value: "https://indialoanfinance.com",
        },
        {
            key: "SUPPORT_EMAIL",
            value: "support@indialoanfinance.com",
        },
        {
            key: "SUPPORT_PHONE",
            value: "8292908077",
        },
        {
            key: "MAINTENANCE_MODE",
            value: "false",
        },
    ];
    for (const setting of settings) {
        await prisma.setting.upsert({
            where: {
                key: setting.key,
            },
            update: {},
            create: setting,
        });
    }
    console.log("✅ Settings Seeded");
    /* =========================================
       WALLET
    ========================================= */
    await prisma.wallet.createMany({
        data: [
            {
                userId: superAdmin.id,
                balance: 0,
                status: "ACTIVE",
            },
        ],
        skipDuplicates: true,
    });
    console.log("✅ Wallet Created");
    /* =========================================
       PERMISSIONS
    ========================================= */
    const permissions = [
        "MANAGE_USERS",
        "MANAGE_LOANS",
        "MANAGE_KYC",
        "MANAGE_TRANSACTIONS",
        "MANAGE_REPORTS",
        "MANAGE_SETTINGS",
        "VIEW_ANALYTICS",
        "FULL_ACCESS",
    ];
    for (const permission of permissions) {
        await prisma.permission.upsert({
            where: {
                name: permission,
            },
            update: {},
            create: {
                name: permission,
            },
        });
    }
    console.log("✅ Permissions Seeded");
    console.log("🎉 Database Seed Completed");
}
main()
    .then(async () => {
    await prisma.$disconnect();
})
    .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
});
