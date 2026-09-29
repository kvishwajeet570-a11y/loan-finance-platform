"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportJob = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const prisma_1 = __importDefault(require("../../config/database/prisma"));
const reportJob = () => {
    node_cron_1.default.schedule("0 0 * * *", async () => {
        console.log("Generating Daily Report...");
        const totalUsers = await prisma_1.default.user.count();
        const totalLoans = await prisma_1.default.loanApplication.count();
        const approvedLoans = await prisma_1.default.loanApplication.count({
            where: {
                status: "APPROVED",
            },
        });
        const totalTransactions = await prisma_1.default.transaction.count();
        const revenue = await prisma_1.default.commission.aggregate({
            _sum: {
                amount: true,
            },
        });
        await prisma_1.default.revenueAnalytics.create({
            data: {
                totalRevenue: revenue._sum.amount || 0,
                totalUsers,
                totalLoans,
                totalTransactions,
            },
        });
        console.log("Report Generated");
    });
};
exports.reportJob = reportJob;
