"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRepository = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class CustomerRepository {
    /* ==========================
        CUSTOMER PROFILE
    ========================== */
    static async getCustomerProfile(userId) {
        return prisma_1.default.user.findUnique({
            where: {
                id: userId
            },
            include: {
                loans: true
            }
        });
    }
    /* ==========================
        UPDATE PROFILE
    ========================== */
    static async updateProfile(userId, data) {
        return prisma_1.default.user.update({
            where: {
                id: userId
            },
            data
        });
    }
    /* ==========================
        CUSTOMER LOANS
    ========================== */
    static async getCustomerLoans(userId) {
        return prisma_1.default.loanApplication.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    }
    /* ==========================
        LOAN DETAILS
    ========================== */
    static async getLoanDetails(loanId) {
        return prisma_1.default.loanApplication.findUnique({
            where: {
                id: loanId
            }
        });
    }
    /* ==========================
        CUSTOMER BANK ACCOUNTS
    ========================== */
    static async getBankAccounts(userId) {
        return prisma_1.default.bankAccount.findMany({
            where: {
                userId
            }
        });
    }
    /* ==========================
        CUSTOMER CREDIT SCORES
    ========================== */
    static async getCreditHistory(userId) {
        return prisma_1.default.creditScoreHistory.findMany({
            where: {
                userId
            },
            orderBy: {
                enquiryDate: "desc"
            }
        });
    }
    /* ==========================
        LATEST CREDIT SCORE
    ========================== */
    static async getLatestCreditScore(userId) {
        return prisma_1.default.creditScoreHistory.findFirst({
            where: {
                userId
            },
            orderBy: {
                enquiryDate: "desc"
            }
        });
    }
    /* ==========================
        CUSTOMER DASHBOARD
    ========================== */
    static async getDashboard(userId) {
        const [profile, totalLoans, approvedLoans, pendingLoans, latestCreditScore] = await Promise.all([
            prisma_1.default.user.findUnique({
                where: {
                    id: userId
                }
            }),
            prisma_1.default.loanApplication.count({
                where: {
                    userId
                }
            }),
            prisma_1.default.loanApplication.count({
                where: {
                    userId,
                    status: "APPROVED"
                }
            }),
            prisma_1.default.loanApplication.count({
                where: {
                    userId,
                    status: "PENDING"
                }
            }),
            prisma_1.default.creditScoreHistory.findFirst({
                where: {
                    userId
                },
                orderBy: {
                    enquiryDate: "desc"
                }
            })
        ]);
        return {
            profile,
            totalLoans,
            approvedLoans,
            pendingLoans,
            latestCreditScore
        };
    }
    /* ==========================
        LOAN ANALYTICS
    ========================== */
    static async getLoanAnalytics(userId) {
        const totalAmount = await prisma_1.default.loanApplication.aggregate({
            where: {
                userId
            },
            _sum: {
                amount: true
            }
        });
        return {
            totalLoanAmount: totalAmount._sum.amount || 0
        };
    }
    /* ==========================
        DELETE CUSTOMER
    ========================== */
    static async deleteCustomer(userId) {
        return prisma_1.default.user.delete({
            where: {
                id: userId
            }
        });
    }
    /* ==========================
        CUSTOMER NOTIFICATIONS
    ========================== */
    static async getNotifications(userId) {
        return prisma_1.default.notification.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    }
    /* ==========================
        CUSTOMER SUPPORT TICKETS
    ========================== */
    static async getSupportTickets(userId) {
        return prisma_1.default.supportTicket.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    }
    /* ==========================
        CUSTOMER COMMISSIONS
    ========================== */
    static async getCustomerReferralIncome(userId) {
        return prisma_1.default.commission.findMany({
            where: {
                userId,
                status: "PAID"
            }
        });
    }
}
exports.CustomerRepository = CustomerRepository;
