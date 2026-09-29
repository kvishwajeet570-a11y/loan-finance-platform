"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class AnalyticsService {
    /**
     * =========================================
     * DASHBOARD ANALYTICS
     * =========================================
     */
    async getDashboardAnalytics() {
        const [totalUsers, totalLoans, approvedLoans, rejectedLoans, pendingLoans, totalPartners, totalDSA, totalRevenue,] = await Promise.all([
            prisma_1.default.user.count(),
            prisma_1.default.loanApplication.count(),
            prisma_1.default.loanApplication.count({
                where: {
                    status: client_1.LoanStatus.APPROVED,
                },
            }),
            prisma_1.default.loanApplication.count({
                where: {
                    status: client_1.LoanStatus.REJECTED,
                },
            }),
            prisma_1.default.loanApplication.count({
                where: {
                    status: client_1.LoanStatus.PENDING,
                },
            }),
            prisma_1.default.user.count({
                where: {
                    role: "partner",
                },
            }),
            prisma_1.default.user.count({
                where: {
                    role: "dsa",
                },
            }),
            prisma_1.default.revenue.aggregate({
                _sum: {
                    amount: true,
                },
            }),
        ]);
        const disbursedAmount = await prisma_1.default.loanApplication.aggregate({
            where: {
                status: client_1.LoanStatus.APPROVED,
            },
            _sum: {
                amount: true,
            },
        });
        const averageLoan = await prisma_1.default.loanApplication.aggregate({
            _avg: {
                amount: true,
            },
        });
        const approvalRate = totalLoans === 0
            ? 0
            : Number(((approvedLoans / totalLoans) *
                100).toFixed(2));
        return {
            users: {
                total: totalUsers,
                partners: totalPartners,
                dsa: totalDSA,
            },
            loans: {
                total: totalLoans,
                approved: approvedLoans,
                rejected: rejectedLoans,
                pending: pendingLoans,
                approvalRate,
                averageLoan: Number(averageLoan._avg.amount) || 0,
                disbursedAmount: Number(disbursedAmount._sum.amount) || 0,
            },
            revenue: {
                total: Number(totalRevenue._sum.amount) || 0,
            },
        };
    }
    /**
     * =========================================
     * OVERVIEW ANALYTICS
     * =========================================
     */
    async getOverviewAnalytics() {
        const dashboard = await this.getDashboardAnalytics();
        return {
            success: true,
            generatedAt: new Date(),
            dashboard,
        };
    }
    /**
     * =========================================
     * LOAN TYPE ANALYTICS
     * =========================================
     */
    async getLoanTypeAnalytics() {
        const analytics = await prisma_1.default.loanApplication.groupBy({
            by: ["loanType"],
            _count: {
                loanType: true,
            },
            _sum: {
                amount: true,
            },
            orderBy: {
                loanType: "asc",
            },
        });
        return analytics.map((item) => ({
            loanType: item.loanType,
            totalLoans: item._count.loanType,
            totalAmount: Number(item._sum.amount) || 0,
        }));
    }
    /**
     * =========================================
     * LOAN STATUS ANALYTICS
     * =========================================
     */
    async getLoanStatusAnalytics() {
        const analytics = await prisma_1.default.loanApplication.groupBy({
            by: ["status"],
            _count: {
                status: true,
            },
            _sum: {
                amount: true,
            },
        });
        return analytics.map((item) => ({
            status: item.status,
            totalLoans: item._count.status,
            totalAmount: Number(item._sum.amount) || 0,
        }));
    } /**
     * =========================================
     * MONTHLY LOAN ANALYTICS
     * =========================================
     */
    async getMonthlyLoanAnalytics() {
        const loans = await prisma_1.default.loanApplication.findMany({
            select: {
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
            const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
            if (!monthlyMap.has(month)) {
                monthlyMap.set(month, {
                    month,
                    totalLoans: 0,
                    approvedLoans: 0,
                    pendingLoans: 0,
                    rejectedLoans: 0,
                    totalAmount: 0,
                });
            }
            const item = monthlyMap.get(month);
            item.totalLoans++;
            item.totalAmount += Number(loan.amount);
            switch (loan.status) {
                case client_1.LoanStatus.APPROVED:
                    item.approvedLoans++;
                    break;
                case client_1.LoanStatus.PENDING:
                    item.pendingLoans++;
                    break;
                case client_1.LoanStatus.REJECTED:
                    item.rejectedLoans++;
                    break;
            }
        }
        return Array.from(monthlyMap.values());
    }
    /**
     * =========================================
     * MONTHLY USER ANALYTICS
     * =========================================
     */
    async getMonthlyUserAnalytics() {
        const users = await prisma_1.default.user.findMany({
            select: {
                createdAt: true,
            },
            orderBy: {
                createdAt: "asc",
            },
        });
        const monthlyMap = new Map();
        for (const user of users) {
            const date = new Date(user.createdAt);
            const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
            if (!monthlyMap.has(month)) {
                monthlyMap.set(month, {
                    month,
                    totalUsers: 0,
                });
            }
            monthlyMap.get(month).totalUsers++;
        }
        return Array.from(monthlyMap.values());
    }
    /**
     * =========================================
     * RECENT APPLICATIONS
     * =========================================
     */
    async getRecentApplications(limit = 10) {
        return prisma_1.default.loanApplication.findMany({
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
                loanType: true,
                amount: true,
                status: true,
                createdAt: true,
            },
        });
    }
    /**
     * =========================================
     * TOP CUSTOMERS
     * =========================================
     */
    async getTopCustomers(limit = 10) {
        const users = await prisma_1.default.user.findMany({
            take: limit,
            select: {
                id: true,
                name: true,
                email: true,
                loans: {
                    select: {
                        amount: true,
                        status: true,
                    },
                },
            },
        });
        return users.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            totalLoans: user.loans.length,
            approvedLoans: user.loans.filter((loan) => loan.status === client_1.LoanStatus.APPROVED).length,
            totalAmount: user.loans.reduce((sum, loan) => sum + Number(loan.amount), 0),
        }));
    }
    /**
     * =========================================
     * LOAN AMOUNT ANALYTICS
     * =========================================
     */
    async getLoanAmountAnalytics() {
        const analytics = await prisma_1.default.loanApplication.aggregate({
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
            _count: {
                amount: true,
            },
        });
        return {
            totalAmount: Number(analytics._sum.amount) || 0,
            averageAmount: Number(analytics._avg.amount) || 0,
            minimumAmount: Number(analytics._min.amount) || 0,
            maximumAmount: Number(analytics._max.amount) || 0,
            totalLoans: analytics._count.amount,
        };
    }
    /**
   * =========================================
   * RECENT ACTIVITIES
   * =========================================
   */
    async getRecentActivities(limit = 10) {
        const [recentLoans, recentUsers, recentTransactions,] = await Promise.all([
            prisma_1.default.loanApplication.findMany({
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    id: true,
                    fullName: true,
                    status: true,
                    amount: true,
                    createdAt: true,
                },
            }),
            prisma_1.default.user.findMany({
                take: limit,
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
            prisma_1.default.transaction.findMany({
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    id: true,
                    amount: true,
                    type: true,
                    status: true,
                    createdAt: true,
                },
            }),
        ]);
        return {
            recentLoans,
            recentUsers,
            recentTransactions,
        };
    }
    /**
     * =========================================
     * REVENUE ANALYTICS
     * =========================================
     */
    async getRevenueAnalytics() {
        const revenue = await prisma_1.default.revenue.aggregate({
            _sum: {
                amount: true,
            },
            _avg: {
                amount: true,
            },
            _max: {
                amount: true,
            },
            _min: {
                amount: true,
            },
            _count: true,
        });
        return {
            totalRevenue: Number(revenue._sum.amount) || 0,
            averageRevenue: Number(revenue._avg.amount) || 0,
            highestRevenue: Number(revenue._max.amount) || 0,
            lowestRevenue: Number(revenue._min.amount) || 0,
            totalTransactions: revenue._count,
        };
    }
    /**
     * =========================================
     * PERFORMANCE ANALYTICS
     * =========================================
     */
    async getPerformanceAnalytics() {
        const dashboard = await this.getDashboardAnalytics();
        const revenue = await this.getRevenueAnalytics();
        const loanAmount = await this.getLoanAmountAnalytics();
        return {
            dashboard,
            revenue,
            loanAmount,
        };
    }
    /**
     * =========================================
     * COMPLETE DASHBOARD
     * =========================================
     */
    async getCompleteDashboard() {
        const [dashboard, loanType, loanStatus, monthlyLoans, monthlyUsers, recentApplications, topCustomers, revenue, loanAmount, recentActivities,] = await Promise.all([
            this.getDashboardAnalytics(),
            this.getLoanTypeAnalytics(),
            this.getLoanStatusAnalytics(),
            this.getMonthlyLoanAnalytics(),
            this.getMonthlyUserAnalytics(),
            this.getRecentApplications(),
            this.getTopCustomers(),
            this.getRevenueAnalytics(),
            this.getLoanAmountAnalytics(),
            this.getRecentActivities(),
        ]);
        return {
            overview: dashboard,
            analytics: {
                loanType,
                loanStatus,
                monthlyLoans,
                monthlyUsers,
                loanAmount,
                revenue,
            },
            recentApplications,
            topCustomers,
            recentActivities,
            generatedAt: new Date(),
        };
    }
}
exports.default = new AnalyticsService();
