"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalyticsService = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma"));
/* ========================================
   GET ANALYTICS
======================================== */
const getAnalyticsService = async () => {
    const totalUsers = await prisma_1.default.user.count();
    const totalLoans = await prisma_1.default.loanApplication.count();
    const totalTransactions = await prisma_1.default.transaction.count();
    const revenue = await prisma_1.default.transaction.aggregate({
        _sum: {
            amount: true,
        },
    });
    return {
        totalUsers,
        totalLoans,
        totalTransactions,
        totalRevenue: revenue._sum.amount || 0,
    };
};
exports.getAnalyticsService = getAnalyticsService;
