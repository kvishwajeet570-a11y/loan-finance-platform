"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startScheduler = exports.revenueJob = exports.fraudDetectionJob = exports.reportGenerationJob = exports.databaseBackupJob = exports.analyticsSnapshotJob = exports.documentExpiryJob = exports.kycExpiryJob = exports.walletReconciliationJob = exports.commissionSettlementJob = exports.referralSettlementJob = exports.loanStatusUpdateJob = exports.dailyEmiReminderJob = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const prisma_1 = __importDefault(require("../prisma/prisma"));
/* =========================================
   DAILY EMI REMINDER
========================================= */
exports.dailyEmiReminderJob = node_cron_1.default.schedule("0 9 * * *", async () => {
    try {
        console.log("Running Daily EMI Reminder Job...");
        const loans = await prisma_1.default.loanApplication.findMany({
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
        console.error("Daily EMI Reminder Job Error:", error);
    }
}, {
    timezone: "Asia/Kolkata",
});
/* =========================================
   AUTO LOAN STATUS UPDATE

   DISABLED LOGIC:
   Current LoanStatus enum contains only:
   PENDING
   APPROVED
   REJECTED

   Therefore DISBURSED cannot be queried.
========================================= */
exports.loanStatusUpdateJob = node_cron_1.default.schedule("0 */6 * * *", async () => {
    try {
        console.log("Loan Status Update skipped: DISBURSED status is not available in current LoanStatus enum.");
    }
    catch (error) {
        console.error("Loan Status Update Job Error:", error);
    }
}, {
    timezone: "Asia/Kolkata",
});
/* =========================================
   REFERRAL SETTLEMENT
========================================= */
exports.referralSettlementJob = node_cron_1.default.schedule("0 1 * * *", async () => {
    try {
        const referrals = await prisma_1.default.referral.findMany({
            where: {
                status: "APPROVED",
            },
        });
        console.log(`Referral Settlement: ${referrals.length}`);
    }
    catch (error) {
        console.error("Referral Settlement Job Error:", error);
    }
}, {
    timezone: "Asia/Kolkata",
});
/* =========================================
   COMMISSION SETTLEMENT
========================================= */
exports.commissionSettlementJob = node_cron_1.default.schedule("30 1 * * *", async () => {
    try {
        const commissions = await prisma_1.default.commission.findMany({
            where: {
                status: "APPROVED",
            },
        });
        console.log(`Commission Settlement: ${commissions.length}`);
    }
    catch (error) {
        console.error("Commission Settlement Job Error:", error);
    }
}, {
    timezone: "Asia/Kolkata",
});
/* =========================================
   DAILY WALLET RECONCILIATION
========================================= */
exports.walletReconciliationJob = node_cron_1.default.schedule("0 2 * * *", async () => {
    try {
        const wallets = await prisma_1.default.wallet.count();
        console.log(`Wallet Reconciliation: ${wallets}`);
    }
    catch (error) {
        console.error("Wallet Reconciliation Job Error:", error);
    }
}, {
    timezone: "Asia/Kolkata",
});
/* =========================================
   EXPIRED KYC CHECK
========================================= */
exports.kycExpiryJob = node_cron_1.default.schedule("15 2 * * *", async () => {
    try {
        const result = await prisma_1.default.kYC.updateMany({
            where: {
                expiryDate: {
                    lt: new Date(),
                },
            },
            data: {
                status: "EXPIRED",
            },
        });
        console.log(`Expired KYC Updated: ${result.count}`);
    }
    catch (error) {
        console.error("KYC Expiry Job Error:", error);
    }
}, {
    timezone: "Asia/Kolkata",
});
/* =========================================
   DOCUMENT EXPIRY CHECK

   DISABLED:
   Current Document model does not contain
   expiryDate/status fields.
========================================= */
exports.documentExpiryJob = node_cron_1.default.schedule("30 2 * * *", async () => {
    try {
        console.log("Document Expiry Check skipped: Document model does not contain expiryDate/status fields.");
    }
    catch (error) {
        console.error("Document Expiry Job Error:", error);
    }
}, {
    timezone: "Asia/Kolkata",
});
/* =========================================
   DAILY ANALYTICS SNAPSHOT
========================================= */
exports.analyticsSnapshotJob = node_cron_1.default.schedule("55 23 * * *", async () => {
    try {
        const [totalUsers, totalLoans, totalTransactions,] = await Promise.all([
            prisma_1.default.user.count(),
            prisma_1.default.loanApplication.count(),
            prisma_1.default.transaction.count(),
        ]);
        console.log("Daily Analytics Snapshot:", {
            totalUsers,
            totalLoans,
            totalTransactions,
        });
    }
    catch (error) {
        console.error("Analytics Snapshot Job Error:", error);
    }
}, {
    timezone: "Asia/Kolkata",
});
/* =========================================
   DATABASE BACKUP
========================================= */
exports.databaseBackupJob = node_cron_1.default.schedule("0 0 * * *", async () => {
    try {
        console.log("Database Backup Started");
        /*
         * Actual PostgreSQL backup logic
         * can be added here later.
         */
    }
    catch (error) {
        console.error("Database Backup Job Error:", error);
    }
}, {
    timezone: "Asia/Kolkata",
});
/* =========================================
   DAILY REPORT GENERATION
========================================= */
exports.reportGenerationJob = node_cron_1.default.schedule("0 4 * * *", async () => {
    try {
        console.log("Generating Reports...");
        /*
         * Report generation logic
         * can be added here later.
         */
    }
    catch (error) {
        console.error("Report Generation Job Error:", error);
    }
}, {
    timezone: "Asia/Kolkata",
});
/* =========================================
   FRAUD DETECTION
========================================= */
exports.fraudDetectionJob = node_cron_1.default.schedule("*/30 * * * *", async () => {
    try {
        const suspiciousTransactions = await prisma_1.default.transaction.count({
            where: {
                amount: {
                    gt: 500000,
                },
            },
        });
        console.log(`Suspicious Transactions: ${suspiciousTransactions}`);
    }
    catch (error) {
        console.error("Fraud Detection Job Error:", error);
    }
}, {
    timezone: "Asia/Kolkata",
});
/* =========================================
   DAILY REVENUE REPORT
========================================= */
exports.revenueJob = node_cron_1.default.schedule("0 23 * * *", async () => {
    try {
        const revenue = await prisma_1.default.transaction.aggregate({
            _sum: {
                amount: true,
            },
        });
        console.log(`Daily Revenue: ${revenue._sum.amount || 0}`);
    }
    catch (error) {
        console.error("Revenue Job Error:", error);
    }
}, {
    timezone: "Asia/Kolkata",
});
/* =========================================
   START ALL SCHEDULER JOBS
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
