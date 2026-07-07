"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class PaymentService {
    /**
     * Create Payment
     */
    async createPayment(data) {
        return prisma_1.default.payment.create({
            data: {
                userId: data.userId,
                amount: data.amount,
                paymentMethod: data.paymentMethod,
                purpose: data.purpose,
                referenceId: data.referenceId,
                status: "PENDING",
            },
        });
    }
    /**
     * Verify Payment
     */
    async verifyPayment(paymentId, gatewayTxnId) {
        return prisma_1.default.payment.update({
            where: {
                id: paymentId,
            },
            data: {
                status: "SUCCESS",
                transactionId: gatewayTxnId,
                paidAt: new Date(),
            },
        });
    }
    /**
     * Failed Payment
     */
    async failPayment(paymentId, reason) {
        return prisma_1.default.payment.update({
            where: {
                id: paymentId,
            },
            data: {
                status: "FAILED",
                failureReason: reason,
            },
        });
    }
    /**
     * Refund Payment
     */
    async refundPayment(paymentId, refundAmount) {
        const payment = await prisma_1.default.payment.findUnique({
            where: {
                id: paymentId,
            },
        });
        if (!payment) {
            throw new Error("Payment not found");
        }
        return prisma_1.default.payment.update({
            where: {
                id: paymentId,
            },
            data: {
                status: "REFUNDED",
                refundAmount,
                refundedAt: new Date(),
            },
        });
    }
    /**
     * Loan EMI Payment
     */
    async payEMI(loanId, amount, userId) {
        const payment = await prisma_1.default.payment.create({
            data: {
                userId,
                amount,
                purpose: "LOAN_EMI",
                referenceId: loanId,
                status: "SUCCESS",
                paidAt: new Date(),
            },
        });
        await prisma_1.default.transaction.create({
            data: {
                userId,
                amount,
                type: "DEBIT",
                remark: "Loan EMI Payment",
            },
        });
        return payment;
    }
    /**
     * Wallet Recharge
     */
    async walletRecharge(userId, amount) {
        const wallet = await prisma_1.default.wallet.findUnique({
            where: {
                userId,
            },
        });
        if (!wallet) {
            throw new Error("Wallet not found");
        }
        await prisma_1.default.wallet.update({
            where: {
                userId,
            },
            data: {
                balance: {
                    increment: amount,
                },
            },
        });
        await prisma_1.default.transaction.create({
            data: {
                userId,
                amount,
                type: "CREDIT",
                remark: "Wallet Recharge",
            },
        });
        return {
            success: true,
            amount,
        };
    }
    /**
     * Commission Payout
     */
    async commissionPayout(userId, amount) {
        await prisma_1.default.wallet.update({
            where: {
                userId,
            },
            data: {
                balance: {
                    increment: amount,
                },
            },
        });
        await prisma_1.default.transaction.create({
            data: {
                userId,
                amount,
                type: "CREDIT",
                remark: "Commission Payout",
            },
        });
        return {
            success: true,
        };
    }
    /**
     * Payment History
     */
    async getPaymentHistory(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [payments, total] = await Promise.all([
            prisma_1.default.payment.findMany({
                where: {
                    userId,
                },
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.payment.count({
                where: {
                    userId,
                },
            }),
        ]);
        return {
            payments,
            total,
            page,
            pages: Math.ceil(total / limit),
        };
    }
    /**
     * Payment By ID
     */
    async getPaymentById(paymentId) {
        return prisma_1.default.payment.findUnique({
            where: {
                id: paymentId,
            },
            include: {
                user: true,
            },
        });
    }
    /**
     * Admin Analytics
     */
    async getPaymentAnalytics() {
        const [totalPayments, successPayments, failedPayments, totalRevenue,] = await Promise.all([
            prisma_1.default.payment.count(),
            prisma_1.default.payment.count({
                where: {
                    status: "SUCCESS",
                },
            }),
            prisma_1.default.payment.count({
                where: {
                    status: "FAILED",
                },
            }),
            prisma_1.default.payment.aggregate({
                _sum: {
                    amount: true,
                },
                where: {
                    status: "SUCCESS",
                },
            }),
        ]);
        return {
            totalPayments,
            successPayments,
            failedPayments,
            revenue: totalRevenue._sum
                .amount || 0,
        };
    }
    /**
     * Daily Collection Report
     */
    async dailyCollection() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return prisma_1.default.payment.aggregate({
            where: {
                status: "SUCCESS",
                createdAt: {
                    gte: today,
                },
            },
            _sum: {
                amount: true,
            },
        });
    }
    /**
     * Monthly Revenue Report
     */
    async monthlyRevenue() {
        const currentYear = new Date().getFullYear();
        return prisma_1.default.$queryRaw `
      SELECT
      EXTRACT(MONTH FROM "createdAt") AS month,
      COUNT(*) AS total_payments,
      SUM(amount) AS revenue
      FROM "Payment"
      WHERE status='SUCCESS'
      AND EXTRACT(YEAR FROM "createdAt")=${currentYear}
      GROUP BY month
      ORDER BY month ASC
    `;
    }
    /**
     * Top Paying Customers
     */
    async topCustomers() {
        return prisma_1.default.payment.groupBy({
            by: ["userId"],
            where: {
                status: "SUCCESS",
            },
            _sum: {
                amount: true,
            },
            orderBy: {
                _sum: {
                    amount: "desc",
                },
            },
            take: 10,
        });
    }
}
exports.default = new PaymentService();
