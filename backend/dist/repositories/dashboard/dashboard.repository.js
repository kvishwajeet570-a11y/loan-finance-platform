"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardRepository = void 0;
const prisma_1 = __importDefault(require("../../config/database/prisma"));
class DashboardRepository {
    /* ==========================
        OVERVIEW STATS
    ========================== */
    static async getOverviewStats() {
        const [totalUsers, totalLoans, approvedLoans, pendingLoans, rejectedLoans, verifiedUsers] = await Promise.all([
            prisma_1.default.user.count(),
            prisma_1.default.loanApplication.count(),
            prisma_1.default.loanApplication.count({
                where: { status: "APPROVED" }
            }),
            prisma_1.default.loanApplication.count({
                where: { status: "PENDING" }
            }),
            prisma_1.default.loanApplication.count({
                where: { status: "REJECTED" }
            }),
            prisma_1.default.user.count({
                where: { isVerified: true }
            })
        ]);
        return {
            totalUsers,
            totalLoans,
            approvedLoans,
            pendingLoans,
            rejectedLoans,
            verifiedUsers
        };
    }
    /* ==========================
        LOAN AMOUNT ANALYTICS
    ========================== */
    static async getLoanAmountAnalytics() {
        const result = await prisma_1.default.loanApplication.aggregate({
            _sum: {
                amount: true
            },
            _avg: {
                amount: true
            },
            _max: {
                amount: true
            },
            _min: {
                amount: true
            }
        });
        return result;
    }
    /* ==========================
        RECENT LOANS
    ========================== */
    static async getRecentLoans(limit = 10) {
        return prisma_1.default.loanApplication.findMany({
            take: limit,
            orderBy: {
                createdAt: "desc"
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
    }
    /* ==========================
        RECENT USERS
    ========================== */
    static async getRecentUsers(limit = 10) {
        return prisma_1.default.user.findMany({
            take: limit,
            orderBy: {
                createdAt: "desc"
            },
            select: {
                id: true,
                name: true,
                email: true,
                phoneNo: true,
                role: true,
                createdAt: true
            }
        });
    }
    /* ==========================
        MONTHLY LOANS
    ========================== */
    static async getMonthlyLoans(year) {
        const start = new Date(`${year}-01-01`);
        const end = new Date(`${year}-12-31`);
        return prisma_1.default.loanApplication.findMany({
            where: {
                createdAt: {
                    gte: start,
                    lte: end
                }
            },
            select: {
                amount: true,
                status: true,
                createdAt: true
            }
        });
    }
    /* ==========================
        MONTHLY USERS
    ========================== */
    static async getMonthlyUsers(year) {
        const start = new Date(`${year}-01-01`);
        const end = new Date(`${year}-12-31`);
        return prisma_1.default.user.findMany({
            where: {
                createdAt: {
                    gte: start,
                    lte: end
                }
            },
            select: {
                id: true,
                createdAt: true
            }
        });
    }
    /* ==========================
        LOAN STATUS CHART
    ========================== */
    static async getLoanStatusChart() {
        return prisma_1.default.loanApplication.groupBy({
            by: ["status"],
            _count: {
                status: true
            }
        });
    }
    /* ==========================
        LOAN TYPE CHART
    ========================== */
    static async getLoanTypeChart() {
        return prisma_1.default.loanApplication.groupBy({
            by: ["loanType"],
            _count: {
                loanType: true
            },
            _sum: {
                amount: true
            }
        });
    }
    /* ==========================
        TOP CUSTOMERS
    ========================== */
    static async getTopCustomers() {
        return prisma_1.default.loanApplication.groupBy({
            by: ["userId"],
            _sum: {
                amount: true
            },
            orderBy: {
                _sum: {
                    amount: "desc"
                }
            },
            take: 10
        });
    }
    /* ==========================
        CREDIT SCORE ANALYTICS
    ========================== */
    static async getCreditScoreAnalytics() {
        return prisma_1.default.creditScoreHistory.aggregate({
            _avg: {
                score: true
            },
            _max: {
                score: true
            },
            _min: {
                score: true
            }
        });
    }
    /* ==========================
        COMMISSION ANALYTICS
    ========================== */
    static async getCommissionAnalytics() {
        return prisma_1.default.commission.aggregate({
            _sum: {
                commissionAmount: true
            },
            _avg: {
                commissionAmount: true
            }
        });
    }
    /* ==========================
        DASHBOARD DATA
    ========================== */
    static async getDashboardData() {
        const [overview, loanAnalytics, loanStatus, loanTypes, creditAnalytics, commissionAnalytics, recentLoans, recentUsers] = await Promise.all([
            this.getOverviewStats(),
            this.getLoanAmountAnalytics(),
            this.getLoanStatusChart(),
            this.getLoanTypeChart(),
            this.getCreditScoreAnalytics(),
            this.getCommissionAnalytics(),
            this.getRecentLoans(),
            this.getRecentUsers()
        ]);
        return {
            overview,
            loanAnalytics,
            loanStatus,
            loanTypes,
            creditAnalytics,
            commissionAnalytics,
            recentLoans,
            recentUsers
        };
    }
}
exports.DashboardRepository = DashboardRepository;
