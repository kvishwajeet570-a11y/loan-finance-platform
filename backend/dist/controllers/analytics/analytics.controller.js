"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMonthlyLoanAnalytics = exports.getLoanTypeAnalytics = exports.getDashboardAnalytics = exports.getRecentActivities = exports.getTopCustomers = exports.getMonthlyUserAnalytics = exports.getUserRoleAnalytics = exports.getLoanStatusAnalytics = exports.getLoanAmountAnalytics = exports.getOverviewAnalytics = exports.getAnalytics = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../prisma/prisma"));
const getAnalytics = async (req, res) => {
    try {
        const [totalUsers, totalLoans, approvedLoans, pendingLoans, rejectedLoans, recentUsers, recentLoans, topUsers, monthlyUsers, monthlyLoans,] = await Promise.all([
            prisma_1.default.user.count(),
            prisma_1.default.loanApplication.count(),
            prisma_1.default.loanApplication.count({
                where: { status: client_1.LoanStatus.APPROVED },
            }),
            prisma_1.default.loanApplication.count({
                where: { status: client_1.LoanStatus.PENDING },
            }),
            prisma_1.default.loanApplication.count({
                where: { status: client_1.LoanStatus.REJECTED },
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
                    phoneNo: true,
                    createdAt: true,
                },
            }),
            prisma_1.default.loanApplication.findMany({
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
                    phoneNo: true,
                    createdAt: true,
                },
            }),
            prisma_1.default.user.count({
                where: {
                    createdAt: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    },
                },
            }),
            prisma_1.default.loanApplication.count({
                where: {
                    createdAt: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    },
                },
            }),
        ]);
        const performance = totalLoans > 0
            ? Math.round((approvedLoans / totalLoans) * 100)
            : 0;
        let totalTransactions = 0;
        let totalWalletBalance = 0;
        let totalReferrals = 0;
        try {
            totalTransactions =
                await prisma_1.default.transaction.count();
        }
        catch { }
        try {
            const walletData = await prisma_1.default.wallet.aggregate({
                _sum: {
                    balance: true,
                },
            });
            totalWalletBalance =
                Number(walletData._sum.balance || 0);
        }
        catch { }
        try {
            const referralData = await prisma_1.default.referral.count();
            totalReferrals = referralData;
        }
        catch { }
        return res.status(200).json({
            success: true,
            analytics: {
                totalUsers,
                totalLoans,
                approvedLoans,
                pendingLoans,
                rejectedLoans,
                totalTransactions,
                totalWalletBalance,
                totalReferrals,
                performance,
                monthlyUsers,
                monthlyLoans,
            },
            recentData: {
                recentUsers,
                recentLoans,
            },
            leaderboard: {
                topUsers,
            },
        });
    }
    catch (error) {
        console.error("ANALYTICS ERROR => ", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch analytics",
            error: error instanceof Error
                ? error.message
                : "Unknown error",
        });
    }
};
exports.getAnalytics = getAnalytics;
// =========================================
// OVERVIEW ANALYTICS
// =========================================
const getOverviewAnalytics = async (req, res) => {
    try {
        const [totalUsers, totalLoans, totalTransactions, totalRevenue, approvedLoans, pendingLoans, rejectedLoans,] = await Promise.all([
            prisma_1.default.user.count(),
            prisma_1.default.loanApplication.count(),
            prisma_1.default.transaction.count(),
            prisma_1.default.revenue.aggregate({
                _sum: {
                    amount: true,
                },
            }),
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
        ]);
        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalLoans,
                totalTransactions,
                totalRevenue: totalRevenue._sum.amount ?? 0,
                approvedLoans,
                pendingLoans,
                rejectedLoans,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch overview analytics",
        });
    }
};
exports.getOverviewAnalytics = getOverviewAnalytics;
// =========================================
// LOAN AMOUNT ANALYTICS
// =========================================
const getLoanAmountAnalytics = async (req, res) => {
    try {
        const analytics = await prisma_1.default.loanApplication.aggregate({
            _count: {
                id: true,
            },
            _sum: {
                amount: true,
            },
            _avg: {
                amount: true,
            },
            _min: {
                amount: true,
            },
            _max: {
                amount: true,
            },
        });
        res.status(200).json({
            success: true,
            data: analytics,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch loan amount analytics",
        });
    }
};
exports.getLoanAmountAnalytics = getLoanAmountAnalytics;
// =========================================
// LOAN STATUS ANALYTICS
// =========================================
const getLoanStatusAnalytics = async (req, res) => {
    try {
        const statusAnalytics = await prisma_1.default.loanApplication.groupBy({
            by: ["status"],
            _count: {
                status: true,
            },
            _sum: {
                amount: true,
            },
            orderBy: {
                _count: {
                    status: "desc",
                },
            },
        });
        res.status(200).json({
            success: true,
            data: statusAnalytics,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch loan status analytics",
        });
    }
};
exports.getLoanStatusAnalytics = getLoanStatusAnalytics;
// =========================================
// USER ROLE ANALYTICS
// =========================================
const getUserRoleAnalytics = async (req, res) => {
    try {
        const roleAnalytics = await prisma_1.default.user.groupBy({
            by: ["role"],
            _count: {
                role: true,
            },
            orderBy: {
                _count: {
                    role: "desc",
                },
            },
        });
        res.status(200).json({
            success: true,
            data: roleAnalytics,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user role analytics",
        });
    }
};
exports.getUserRoleAnalytics = getUserRoleAnalytics;
// =========================================
// MONTHLY USER ANALYTICS
// =========================================
const getMonthlyUserAnalytics = async (req, res) => {
    try {
        const users = await prisma_1.default.user.findMany({
            select: {
                id: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: "asc",
            },
        });
        const monthlyMap = new Map();
        users.forEach((user) => {
            const date = new Date(user.createdAt);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
            if (!monthlyMap.has(key)) {
                monthlyMap.set(key, {
                    month: key,
                    users: 0,
                });
            }
            monthlyMap.get(key).users++;
        });
        res.status(200).json({
            success: true,
            data: Array.from(monthlyMap.values()),
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch monthly user analytics",
        });
    }
};
exports.getMonthlyUserAnalytics = getMonthlyUserAnalytics;
// =========================================
// TOP CUSTOMERS
// =========================================
const getTopCustomers = async (req, res) => {
    try {
        const limit = Number(req.query.limit ?? 10);
        const customers = await prisma_1.default.user.findMany({
            take: limit,
            include: {
                loans: {
                    select: {
                        id: true,
                        amount: true,
                        status: true,
                    },
                },
            },
        });
        const result = customers
            .map((user) => {
            const totalLoanAmount = user.loans.reduce((sum, loan) => sum + Number(loan.amount), 0);
            const approvedLoans = user.loans.filter((loan) => loan.status === "APPROVED").length;
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                phoneNo: user.phoneNo,
                totalLoans: user.loans.length,
                approvedLoans,
                totalLoanAmount,
            };
        })
            .sort((a, b) => b.totalLoanAmount - a.totalLoanAmount);
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch top customers",
        });
    }
};
exports.getTopCustomers = getTopCustomers;
// =========================================
// RECENT ACTIVITIES
// =========================================
const getRecentActivities = async (req, res) => {
    try {
        const limit = Number(req.query.limit ?? 20);
        const activities = await prisma_1.default.userActivity.findMany({
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phoneNo: true,
                    },
                },
            },
        });
        res.status(200).json({
            success: true,
            data: activities,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch recent activities",
        });
    }
};
exports.getRecentActivities = getRecentActivities;
// =========================================
// DASHBOARD ANALYTICS
// =========================================
const getDashboardAnalytics = async (req, res) => {
    try {
        const [totalUsers, totalLoans, totalTransactions, totalRevenue, approvedLoans, pendingLoans, rejectedLoans, recentLoans, recentUsers,] = await Promise.all([
            prisma_1.default.user.count(),
            prisma_1.default.loanApplication.count(),
            prisma_1.default.transaction.count(),
            prisma_1.default.revenue.aggregate({
                _sum: {
                    amount: true,
                },
            }),
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
            prisma_1.default.loanApplication.findMany({
                take: 5,
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    id: true,
                    fullName: true,
                    loanType: true,
                    amount: true,
                    status: true,
                    createdAt: true,
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
                    phoneNo: true,
                    createdAt: true,
                },
            }),
        ]);
        const approvalRate = totalLoans === 0
            ? 0
            : Number(((approvedLoans / totalLoans) * 100).toFixed(2));
        res.status(200).json({
            success: true,
            data: {
                statistics: {
                    totalUsers,
                    totalLoans,
                    totalTransactions,
                    totalRevenue: totalRevenue._sum.amount ?? 0,
                    approvedLoans,
                    pendingLoans,
                    rejectedLoans,
                    approvalRate,
                },
                recentLoans,
                recentUsers,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard analytics",
        });
    }
};
exports.getDashboardAnalytics = getDashboardAnalytics;
// =========================================
// LOAN TYPE ANALYTICS
// =========================================
const getLoanTypeAnalytics = async (req, res) => {
    try {
        const analytics = await prisma_1.default.loanApplication.groupBy({
            by: ["loanType"],
            _count: {
                loanType: true,
            },
            _sum: {
                amount: true,
            },
            _avg: {
                amount: true,
            },
            orderBy: {
                _count: {
                    loanType: "desc",
                },
            },
        });
        res.status(200).json({
            success: true,
            data: analytics,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch loan type analytics",
        });
    }
};
exports.getLoanTypeAnalytics = getLoanTypeAnalytics;
// =========================================
// MONTHLY LOAN ANALYTICS
// =========================================
const getMonthlyLoanAnalytics = async (req, res) => {
    try {
        const loans = await prisma_1.default.loanApplication.findMany({
            select: {
                id: true,
                amount: true,
                status: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: "asc",
            },
        });
        const monthlyMap = new Map();
        for (const loan of loans) {
            const date = new Date(loan.createdAt);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
            if (!monthlyMap.has(key)) {
                monthlyMap.set(key, {
                    month: key,
                    totalLoans: 0,
                    approvedLoans: 0,
                    pendingLoans: 0,
                    rejectedLoans: 0,
                    totalAmount: 0,
                });
            }
            const current = monthlyMap.get(key);
            current.totalLoans++;
            current.totalAmount += Number(loan.amount);
            if (loan.status === client_1.LoanStatus.APPROVED) {
                current.approvedLoans++;
            }
            else if (loan.status === client_1.LoanStatus.PENDING) {
                current.pendingLoans++;
            }
            else if (loan.status === client_1.LoanStatus.REJECTED) {
                current.rejectedLoans++;
            }
        }
        res.status(200).json({
            success: true,
            data: Array.from(monthlyMap.values()),
        });
        return;
    }
    catch (error) {
        console.error("MONTHLY LOAN ANALYTICS ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch monthly loan analytics",
        });
        return;
    }
};
exports.getMonthlyLoanAnalytics = getMonthlyLoanAnalytics;
