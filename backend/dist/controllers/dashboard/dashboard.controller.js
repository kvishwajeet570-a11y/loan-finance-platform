"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma"));
/* ========================================
   GET DASHBOARD STATS
======================================== */
const getDashboardStats = async (req, res) => {
    try {
        /* ========================================
           FETCH ANALYTICS
        ======================================== */
        const [totalLeads, approvedLoans, pendingLoans, rejectedLoans, totalUsers, totalRecharges, totalTransactions, walletBalance, revenue, recentLoans, recentTransactions, recentUsers,] = await Promise.all([
            /* TOTAL LEADS */
            prisma_1.default.loanApplication.count(),
            /* APPROVED LOANS */
            prisma_1.default.loanApplication.count({
                where: {
                    status: "approved",
                },
            }),
            /* PENDING LOANS */
            prisma_1.default.loanApplication.count({
                where: {
                    status: "pending",
                },
            }),
            /* REJECTED LOANS */
            prisma_1.default.loanApplication.count({
                where: {
                    status: "rejected",
                },
            }),
            /* TOTAL USERS */
            prisma_1.default.user.count(),
            /* TOTAL RECHARGES */
            prisma_1.default.recharge.count(),
            /* TOTAL TRANSACTIONS */
            prisma_1.default.transaction.count(),
            /* WALLET BALANCE */
            prisma_1.default.wallet.aggregate({
                _sum: {
                    balance: true,
                },
            }),
            /* TOTAL REVENUE */
            prisma_1.default.transaction.aggregate({
                _sum: {
                    amount: true,
                },
            }),
            /* RECENT LOANS */
            prisma_1.default.loanApplication.findMany({
                take: 5,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            /* RECENT TRANSACTIONS */
            prisma_1.default.transaction.findMany({
                take: 5,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            /* RECENT USERS */
            prisma_1.default.user.findMany({
                take: 5,
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                },
            }),
        ]);
        /* ========================================
           MONTHLY REVENUE
        ======================================== */
        const monthlyTransactions = await prisma_1.default.transaction.findMany({
            where: {
                createdAt: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                },
            },
        });
        const monthlyRevenue = monthlyTransactions.reduce((total, transaction) => total +
            transaction.amount, 0);
        /* ========================================
           PERFORMANCE %
        ======================================== */
        const performance = totalLeads > 0
            ? Math.round((approvedLoans /
                totalLeads) * 100)
            : 0;
        /* ========================================
           RESPONSE
        ======================================== */
        return res.status(200).json({
            success: true,
            dashboard: {
                totalLeads,
                approvedLoans,
                pendingLoans,
                rejectedLoans,
                totalUsers,
                totalRecharges,
                totalTransactions,
                totalWalletBalance: walletBalance._sum.balance || 0,
                totalRevenue: revenue._sum.amount || 0,
                monthlyRevenue,
                performance,
            },
            recentData: {
                recentLoans,
                recentTransactions,
                recentUsers,
            },
        });
    }
    catch (error) {
        console.log("DASHBOARD ERROR =>", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard stats",
        });
    }
};
exports.getDashboardStats = getDashboardStats;
