"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSystemHealth = exports.getPendingLoans = exports.getPendingKyc = exports.getPendingApprovals = exports.getTopPartners = exports.getTopDsa = exports.getTopCustomers = exports.getTodayStats = exports.getMonthlyStats = exports.getNotifications = exports.getRecentTransactions = exports.getRecentUsers = exports.getRecentLoans = exports.getRecentActivities = exports.getLeaderboardDashboard = exports.getAnalyticsDashboard = exports.getRevenueDashboard = exports.getWalletDashboard = exports.getCommissionDashboard = exports.getLoanDashboard = exports.getPartnerDashboard = exports.getDsaDashboard = exports.getCustomerDashboard = exports.getSuperAdminDashboard = exports.getAdminDashboard = exports.getDashboardOverview = exports.getDashboardStats = void 0;
const prisma_1 = __importDefault(require("../../config/database/prisma"));
const getDashboardStats = async (req, res) => {
    try {
        const [totalLeads, approvedLoans, pendingLoans, rejectedLoans, totalUsers, totalRecharges, totalTransactions, walletBalance, revenue, recentLoans, recentTransactions, recentUsers,] = await Promise.all([
            prisma_1.default.loanApplication.count(),
            prisma_1.default.loanApplication.count({
                where: {
                    status: "APPROVED",
                },
            }),
            prisma_1.default.loanApplication.count({
                where: {
                    status: "PENDING",
                },
            }),
            prisma_1.default.loanApplication.count({
                where: {
                    status: "REJECTED",
                },
            }),
            prisma_1.default.user.count(),
            prisma_1.default.recharge.count(),
            prisma_1.default.transaction.count(),
            prisma_1.default.wallet.aggregate({
                _sum: {
                    balance: true,
                },
            }),
            prisma_1.default.transaction.aggregate({
                _sum: {
                    amount: true,
                },
            }),
            prisma_1.default.loanApplication.findMany({
                take: 5,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.transaction.findMany({
                take: 5,
                orderBy: {
                    createdAt: "desc",
                },
            }),
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
        const monthlyTransactions = await prisma_1.default.transaction.findMany({
            where: {
                createdAt: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                },
            },
        });
        const monthlyRevenue = monthlyTransactions.reduce((total, transaction) => total +
            Number(transaction.amount || 0), 0);
        const performance = totalLeads > 0
            ? Math.round((approvedLoans /
                totalLeads) *
                100)
            : 0;
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
                totalWalletBalance: walletBalance?._sum?.balance ??
                    0,
                totalRevenue: revenue?._sum?.amount ?? 0,
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
/* =====================================
   ROUTE COMPATIBILITY EXPORTS
===================================== */
exports.getDashboardOverview = exports.getDashboardStats;
exports.getAdminDashboard = exports.getDashboardStats;
exports.getSuperAdminDashboard = exports.getDashboardStats;
exports.getCustomerDashboard = exports.getDashboardStats;
exports.getDsaDashboard = exports.getDashboardStats;
exports.getPartnerDashboard = exports.getDashboardStats;
exports.getLoanDashboard = exports.getDashboardStats;
exports.getCommissionDashboard = exports.getDashboardStats;
exports.getWalletDashboard = exports.getDashboardStats;
exports.getRevenueDashboard = exports.getDashboardStats;
exports.getAnalyticsDashboard = exports.getDashboardStats;
exports.getLeaderboardDashboard = exports.getDashboardStats;
exports.getRecentActivities = exports.getDashboardStats;
exports.getRecentLoans = exports.getDashboardStats;
exports.getRecentUsers = exports.getDashboardStats;
exports.getRecentTransactions = exports.getDashboardStats;
exports.getNotifications = exports.getDashboardStats;
exports.getMonthlyStats = exports.getDashboardStats;
exports.getTodayStats = exports.getDashboardStats;
exports.getTopCustomers = exports.getDashboardStats;
exports.getTopDsa = exports.getDashboardStats;
exports.getTopPartners = exports.getDashboardStats;
exports.getPendingApprovals = exports.getDashboardStats;
exports.getPendingKyc = exports.getDashboardStats;
exports.getPendingLoans = exports.getDashboardStats;
exports.getSystemHealth = exports.getDashboardStats;
