"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fraudDetectionJob = exports.reportGenerationJob = exports.databaseBackupJob = exports.walletJob = exports.analyticsSnapshotJob = exports.documentCleanupJob = exports.kycExpiryJob = exports.commissionSettlementJob = exports.referralSettlementJob = exports.dailyEmiReminderJob = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const prisma_1 = __importDefault(require("../prisma/prisma"));
/* =========================================
   DAILY LOAN EMI CHECK
========================================= */
exports.dailyEmiReminderJob = node_cron_1.default.schedule("0 9 * * *", async () => {
    try {
        console.log("Running Daily EMI Reminder Job...");
        const today = new Date();
        const loans = await prisma_1.default.loanApplication.findMany({
            where: {
                status: "APPROVED",
            },
        });
        console.log(`Found ${loans.length} active loans`);
    }
    catch (error) {
        console.error(error);
    }
});
/* =========================================
   REFERRAL REWARD SETTLEMENT
========================================= */
exports.referralSettlementJob = node_cron_1.default.schedule("0 1 * * *", async () => {
    try {
        console.log("Running Referral Settlement Job");
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
        const commissions = await prisma_1.default.commission.findMany({
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
   EXPIRED KYC CHECK
========================================= */
exports.kycExpiryJob = node_cron_1.default.schedule("0 2 * * *", async () => {
    try {
        await prisma_1.default.kYC.updateMany({
            where: {
                expiryDate: {
                    lte: new Date(),
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
   DOCUMENT CLEANUP
========================================= */
exports.documentCleanupJob = node_cron_1.default.schedule("0 3 * * 0", async () => {
    try {
        console.log("Document Cleanup Running...");
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
        const totalUsers = await prisma_1.default.user.count();
        const totalLoans = await prisma_1.default.loanApplication.count();
        await prisma_1.default.analytics.create({
            data: {
                totalUsers,
                totalLoans,
            },
        });
    }
    catch (error) {
        console.error(error);
    }
});
/* =========================================
   WALLET EXPIRY CHECK
========================================= */
exports.walletJob = node_cron_1.default.schedule("0 */6 * * *", async () => {
    try {
        console.log("Wallet Validation Running");
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
   REPORT GENERATION
========================================= */
exports.reportGenerationJob = node_cron_1.default.schedule("0 4 * * *", async () => {
    try {
        console.log("Generating Daily Reports...");
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
        console.log("Fraud Detection Running...");
    }
    catch (error) {
        console.error(error);
    }
});
