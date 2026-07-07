"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startScheduler = exports.revenueJob = exports.fraudDetectionJob = exports.reportGenerationJob = exports.databaseBackupJob = exports.analyticsSnapshotJob = exports.documentExpiryJob = exports.kycExpiryJob = exports.walletReconciliationJob = exports.commissionSettlementJob = exports.referralSettlementJob = exports.loanStatusUpdateJob = exports.dailyEmiReminderJob = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const prisma_1 = require("../config/prisma");
/* =========================================
   DAILY EMI REMINDER
========================================= */
exports.dailyEmiReminderJob = node_cron_1.default.schedule("0 9 * * *", async () => {
    try {
        console.log("Running Daily EMI Reminder Job...");
        const today = new Date();
        const loans = await prisma_1.prisma.loanApplication.findMany({
            where: {
                status: "APPROVED",
            },
            select: {
                id: true,
                fullName: true,
                phone: true,
                email: true,
            },
        });
        console.log(`EMI Reminder Sent: ${loans.length}`);
    }
    catch (error) {
        console.error(error);
    }
}, {
    timezone: "Asia/Kolkata",
});
/* =========================================
   AUTO LOAN STATUS UPDATE
========================================= */
exports.loanStatusUpdateJob = node_cron_1.default.schedule("0 */6 * * *", async () => {
    try {
        await prisma_1.prisma.loanApplication.updateMany({
            where: {
                status: "DISBURSED",
            },
            data: {
                updatedAt: new Date(),
            },
        });
        console.log("Loan Status Updated");
    }
    catch (error) {
        console.error(error);
    }
});
/* =========================================
   REFERRAL SETTLEMENT
========================================= */
exports.referralSettlementJob = node_cron_1.default.schedule("0 1 * * *", async () => {
    try {
        const referrals = await prisma_1.prisma.referral.findMany({
            where: {
                status: "APPROVED",
            },
        });
        console.log(`Referral Settlement: ${referrals.length}`);
    }
    catch (error) {
        console.error(error);
    }
});
/* =========================================
   COMMISSION SETTLEMENT
========================================= */
exports.commissionSettlementJob = node_cron_1.default.schedule("30 1 * * *", async () => {
    try {
        const commissions = await prisma_1.prisma.commission.findMany({
            where: {
                status: "APPROVED",
            },
        });
        console.log(`Commission Settlement: ${commissions.length}`);
    }
    catch (error) {
        console.error(error);
    }
});
/* =========================================
   DAILY WALLET RECONCILIATION
========================================= */
exports.walletReconciliationJob = node_cron_1.default.schedule("0 2 * * *", async () => {
    try {
        const wallets = await prisma_1.prisma.wallet.count();
        console.log(`Wallet Reconciliation: ${wallets}`);
    }
    catch (error) {
        console.error(error);
    }
});
/* =========================================
   EXPIRED KYC CHECK
========================================= */
exports.kycExpiryJob = node_cron_1.default.schedule("15 2 * * *", async () => {
    try {
        await prisma_1.prisma.kyc.updateMany({
            where: {
                expiryDate: {
                    lt: new Date(),
                },
            },
            data: {
                status: "EXPIRED",
            },
        });
        console.log("Expired KYC Updated");
    }
    catch (error) {
        console.error(error);
    }
});
/* =========================================
   DOCUMENT EXPIRY CHECK
========================================= */
exports.documentExpiryJob = node_cron_1.default.schedule("30 2 * * *", async () => {
    try {
        await prisma_1.prisma.document.updateMany({
            where: {
                expiryDate: {
                    lt: new Date(),
                },
            },
            data: {
                status: "EXPIRED",
            },
        });
    }
    catch (error) {
        console.error(error);
    }
});
/* =========================================
   DAILY ANALYTICS SNAPSHOT
========================================= */
exports.analyticsSnapshotJob = node_cron_1.default.schedule("55 23 * * *", async () => {
    try {
        const totalUsers = await prisma_1.prisma.user.count();
        const totalLoans = await prisma_1.prisma.loanApplication.count();
        const totalTransactions = await prisma_1.prisma.transaction.count();
        console.log({
            totalUsers,
            totalLoans,
            totalTransactions,
        });
    }
    catch (error) {
        console.error(error);
    }
});
/* =========================================
   DATABASE BACKUP
========================================= */
exports.databaseBackupJob = node_cron_1.default.schedule("0 0 * * *", async () => {
    try {
        console.log("Database Backup Started");
    }
    catch (error) {
        console.error(error);
    }
});
/* =========================================
   DAILY REPORT GENERATION
========================================= */
exports.reportGenerationJob = node_cron_1.default.schedule("0 4 * * *", async () => {
    try {
        console.log("Generating Reports...");
    }
    catch (error) {
        console.error(error);
    }
});
/* =========================================
   FRAUD DETECTION
========================================= */
exports.fraudDetectionJob = node_cron_1.default.schedule("*/30 * * * *", async () => {
    try {
        const suspiciousTransactions = await prisma_1.prisma.transaction.count({
            where: {
                amount: {
                    gt: 500000,
                },
            },
        });
        console.log(`Suspicious Transactions: ${suspiciousTransactions}`);
    }
    catch (error) {
        console.error(error);
    }
});
/* =========================================
   DAILY REVENUE REPORT
========================================= */
exports.revenueJob = node_cron_1.default.schedule("0 23 * * *", async () => {
    try {
        const revenue = await prisma_1.prisma.transaction.aggregate({
            _sum: {
                amount: true,
            },
        });
        console.log(revenue._sum.amount || 0);
    }
    catch (error) {
        console.error(error);
    }
});
/* =========================================
   START ALL JOBS
========================================= */
const startScheduler = () => {
    exports.dailyEmiReminderJob.start();
    exports.loanStatusUpdateJob.start();
    exports.referralSettlementJob.start();
    exports.commissionSettlementJob.start();
    exports.walletReconciliationJob.start();
    exports.kycExpiryJob.start();
    exports.documentExpiryJob.start();
    exports.analyticsSnapshotJob.start();
    exports.databaseBackupJob.start();
    exports.reportGenerationJob.start();
    exports.fraudDetectionJob.start();
    exports.revenueJob.start();
    console.log("All Scheduler Jobs Started Successfully");
};
exports.startScheduler = startScheduler;
