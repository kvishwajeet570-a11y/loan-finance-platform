"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commissionProcessorJob = exports.dailyAnalyticsJob = exports.sessionCleanupJob = exports.otpCleanupJob = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma"));
/**
 * OTP CLEANUP
 */
const otpCleanupJob = async () => {
    const startedAt = new Date();
    try {
        const result = await prisma_1.default.user.updateMany({
            where: {
                otpExpiry: {
                    lt: new Date(),
                },
            },
            data: {
                otp: null,
                otpExpiry: null,
            },
        });
        await prisma_1.default.cronJobLog.create({
            data: {
                jobName: "OTP_CLEANUP",
                status: "SUCCESS",
                message: `${result.count} OTP removed`,
                startedAt,
                completedAt: new Date(),
            },
        });
    }
    catch (error) {
        await prisma_1.default.cronJobLog.create({
            data: {
                jobName: "OTP_CLEANUP",
                status: "FAILED",
                message: String(error),
                startedAt,
            },
        });
    }
};
exports.otpCleanupJob = otpCleanupJob;
/**
 * SESSION CLEANUP
 */
const sessionCleanupJob = async () => {
    const startedAt = new Date();
    try {
        const result = await prisma_1.default.session.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date(),
                },
            },
        });
        await prisma_1.default.cronJobLog.create({
            data: {
                jobName: "SESSION_CLEANUP",
                status: "SUCCESS",
                message: `${result.count} sessions deleted`,
                startedAt,
                completedAt: new Date(),
            },
        });
    }
    catch (error) {
        await prisma_1.default.cronJobLog.create({
            data: {
                jobName: "SESSION_CLEANUP",
                status: "FAILED",
                message: String(error),
                startedAt,
            },
        });
    }
};
exports.sessionCleanupJob = sessionCleanupJob;
/**
 * DAILY ANALYTICS
 */
const dailyAnalyticsJob = async () => {
    const startedAt = new Date();
    try {
        const [users, loans, revenue,] = await Promise.all([
            prisma_1.default.user.count(),
            prisma_1.default.loanApplication.count(),
            prisma_1.default.payment.aggregate({
                _sum: {
                    amount: true,
                },
            }),
        ]);
        await prisma_1.default.cronJobLog.create({
            data: {
                jobName: "DAILY_ANALYTICS",
                status: "SUCCESS",
                message: `Users:${users} Loans:${loans} Revenue:${revenue._sum.amount || 0}`,
                startedAt,
                completedAt: new Date(),
            },
        });
    }
    catch (error) {
        await prisma_1.default.cronJobLog.create({
            data: {
                jobName: "DAILY_ANALYTICS",
                status: "FAILED",
                message: String(error),
                startedAt,
            },
        });
    }
};
exports.dailyAnalyticsJob = dailyAnalyticsJob;
/**
 * COMMISSION PROCESSOR
 */
const commissionProcessorJob = async () => {
    const startedAt = new Date();
    try {
        const pendingLoans = await prisma_1.default.loanApplication.findMany({
            where: {
                status: "DISBURSED",
            },
        });
        for (const loan of pendingLoans) {
            // commission logic
        }
        await prisma_1.default.cronJobLog.create({
            data: {
                jobName: "COMMISSION_PROCESSOR",
                status: "SUCCESS",
                startedAt,
                completedAt: new Date(),
            },
        });
    }
    catch (error) {
        await prisma_1.default.cronJobLog.create({
            data: {
                jobName: "COMMISSION_PROCESSOR",
                status: "FAILED",
                message: String(error),
                startedAt,
            },
        });
    }
};
exports.commissionProcessorJob = commissionProcessorJob;
