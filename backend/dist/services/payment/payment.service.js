"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../config/database/prisma"));
class PaymentService {
    /* ========================================
       CREATE PAYMENT
    ======================================== */
    async createPayment(data) {
        return prisma_1.default.payment.create({
            data: {
                paymentId: `PAY-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
                userId: data.userId,
                loanApplicationId: data.loanApplicationId,
                amount: data.amount,
                paymentMethod: data.paymentMethod,
                purpose: data.purpose,
                referenceId: data.referenceId,
                status: "PENDING",
            },
        });
    }
    /* ========================================
       GET ALL PAYMENTS
    ======================================== */
    async getAllPayments(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [payments, total] = await Promise.all([
            prisma_1.default.payment.findMany({
                skip,
                take: limit,
                include: {
                    user: true,
                    loanApplication: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.payment.count(),
        ]);
        return {
            payments,
            total,
            page,
            pages: Math.ceil(total / limit),
        };
    }
    /* ========================================
       GET PAYMENT BY ID
    ======================================== */
    async getPaymentById(paymentId) {
        return prisma_1.default.payment.findUnique({
            where: {
                id: paymentId,
            },
            include: {
                user: true,
                loanApplication: true,
            },
        });
    }
    /* ========================================
       UPDATE PAYMENT
    ======================================== */
    async updatePayment(paymentId, data) {
        return prisma_1.default.payment.update({
            where: {
                id: paymentId,
            },
            data,
        });
    }
    /* ========================================
       DELETE PAYMENT
    ======================================== */
    async deletePayment(paymentId) {
        return prisma_1.default.payment.delete({
            where: {
                id: paymentId,
            },
        });
    }
    /* ========================================
       VERIFY PAYMENT
    ======================================== */
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
    /* ========================================
       FAIL PAYMENT
    ======================================== */
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
    /* ========================================
       REFUND PAYMENT
    ======================================== */
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
    /* ========================================
       EMI PAYMENT
    ======================================== */
    async payEMI(loanId, amount, userId) {
        const payment = await prisma_1.default.payment.create({
            data: {
                paymentId: `EMI-${Date.now()}`,
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
                transactionId: `TXN-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
                userId,
                amount,
                type: "DEBIT",
                category: "EMI",
                remark: "Loan EMI Payment",
            }
        });
        return payment;
    }
    /* ========================================
       WALLET RECHARGE
    ======================================== */
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
                transactionId: `TXN-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
                userId,
                amount,
                type: "CREDIT",
                category: "WALLET",
                remark: "Wallet Recharge",
                status: "SUCCESS",
            },
        });
        return {
            success: true,
            amount,
        };
    }
    /* ========================================
       COMMISSION PAYOUT
    ======================================== */
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
                transactionId: `TXN-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
                userId,
                amount,
                type: "CREDIT",
                category: "COMMISSION",
                remark: "Commission Payout",
                status: "SUCCESS",
            },
        });
        return {
            success: true,
        };
    }
    /* ========================================
       USER PAYMENTS
    ======================================== */
    async getUserPayments(userId) {
        return prisma_1.default.payment.findMany({
            where: {
                userId,
            },
            include: {
                user: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    /* ========================================
       LOAN PAYMENTS
    ======================================== */
    async getLoanPayments(loanId) {
        return prisma_1.default.payment.findMany({
            where: {
                loanApplicationId: loanId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    /* ========================================
       PENDING PAYMENTS
    ======================================== */
    async getPendingPayments() {
        return prisma_1.default.payment.findMany({
            where: {
                status: "PENDING",
            },
        });
    }
    async getSuccessPayments() {
        return prisma_1.default.payment.findMany({
            where: {
                status: "SUCCESS",
            },
        });
    }
    async getFailedPayments() {
        return prisma_1.default.payment.findMany({
            where: {
                status: "FAILED",
            },
        });
    }
    async getRefundedPayments() {
        return prisma_1.default.payment.findMany({
            where: {
                status: "REFUNDED",
            },
        });
    }
    /* ========================================
       ANALYTICS
    ======================================== */
    async getPaymentAnalytics() {
        const [totalPayments, successPayments, failedPayments, pendingPayments, refundedPayments, totalRevenue,] = await Promise.all([
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
            prisma_1.default.payment.count({
                where: {
                    status: "PENDING",
                },
            }),
            prisma_1.default.payment.count({
                where: {
                    status: "REFUNDED",
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
            pendingPayments,
            refundedPayments,
            revenue: totalRevenue._sum
                .amount || 0,
        };
    }
    /* ========================================
       DAILY COLLECTION
    ======================================== */
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
    /* ========================================
       MONTHLY REPORT
    ======================================== */
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
    /* ========================================
       TOP CUSTOMERS
    ======================================== */
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
