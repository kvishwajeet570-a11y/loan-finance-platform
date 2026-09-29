"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRepository = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class PaymentRepository {
    static async createPayment(data) {
        return prisma_1.default.payment.create({
            data,
        });
    }
    static async getById(id) {
        return prisma_1.default.payment.findUnique({
            where: { id },
            include: {
                user: true,
                loanApplication: true,
            },
        });
    }
    static async getByPaymentId(paymentId) {
        return prisma_1.default.payment.findUnique({
            where: {
                paymentId,
            },
            include: {
                user: true,
                loanApplication: true,
            },
        });
    }
    static async getUserPayments(userId) {
        return prisma_1.default.payment.findMany({
            where: { userId },
            include: {
                loanApplication: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    static async markSuccess(paymentId, gatewayPaymentId, referenceId) {
        return prisma_1.default.payment.update({
            where: {
                paymentId,
            },
            data: {
                status: "SUCCESS",
                gatewayPaymentId,
                referenceId,
                paidAt: new Date(),
            },
        });
    }
    static async markFailed(paymentId, reason) {
        return prisma_1.default.payment.update({
            where: {
                paymentId,
            },
            data: {
                status: "FAILED",
                failureReason: reason,
            },
        });
    }
    static async markPending(paymentId) {
        return prisma_1.default.payment.update({
            where: {
                paymentId,
            },
            data: {
                status: "PENDING",
            },
        });
    }
    static async processRefund(paymentId, refundAmount) {
        return prisma_1.default.payment.update({
            where: {
                paymentId,
            },
            data: {
                status: "REFUNDED",
                refundAmount,
                refundedAt: new Date(),
            },
        });
    }
    static async verifyPayment(paymentId, verifiedBy) {
        return prisma_1.default.payment.update({
            where: {
                paymentId,
            },
            data: {
                verifiedBy,
                verifiedAt: new Date(),
            },
        });
    }
    static async updatePayment(id, data) {
        return prisma_1.default.payment.update({
            where: { id },
            data,
        });
    }
    static async getPaymentsByStatus(status) {
        return prisma_1.default.payment.findMany({
            where: { status },
            include: {
                user: true,
                loanApplication: true,
            },
        });
    }
    static async getPaymentsByPurpose(purpose) {
        return prisma_1.default.payment.findMany({
            where: { purpose },
            include: {
                user: true,
                loanApplication: true,
            },
        });
    }
    static async searchPayments(keyword) {
        return prisma_1.default.payment.findMany({
            where: {
                OR: [
                    {
                        paymentId: {
                            contains: keyword,
                            mode: "insensitive",
                        },
                    },
                    {
                        transactionId: {
                            contains: keyword,
                            mode: "insensitive",
                        },
                    },
                    {
                        referenceId: {
                            contains: keyword,
                            mode: "insensitive",
                        },
                    },
                    {
                        gatewayPaymentId: {
                            contains: keyword,
                            mode: "insensitive",
                        },
                    },
                ],
            },
            include: {
                user: true,
            },
        });
    }
    static async getAllPayments(page = 1, limit = 20) {
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
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    static async deletePayment(id) {
        return prisma_1.default.payment.delete({
            where: { id },
        });
    }
    static async getAnalytics() {
        const [totalPayments, successPayments, failedPayments, pendingPayments, refundedPayments, totalAmount,] = await Promise.all([
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
            }),
        ]);
        return {
            totalPayments,
            successPayments,
            failedPayments,
            pendingPayments,
            refundedPayments,
            totalAmount: totalAmount._sum.amount || 0,
        };
    }
    static async getRevenueReport() {
        return prisma_1.default.payment.aggregate({
            where: {
                status: "SUCCESS",
            },
            _sum: {
                amount: true,
            },
            _avg: {
                amount: true,
            },
            _count: {
                _all: true,
            },
        });
    }
}
exports.PaymentRepository = PaymentRepository;
