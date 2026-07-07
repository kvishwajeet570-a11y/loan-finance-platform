"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRepository = void 0;
const prisma_1 = require("../../prisma/prisma");
class PaymentRepository {
    static async createPayment(data) {
        return prisma_1.prisma.payment.create({
            data
        });
    }
    static async getById(id) {
        return prisma_1.prisma.payment.findUnique({
            where: { id },
            include: {
                user: true
            }
        });
    }
    static async getByReference(paymentRef) {
        return prisma_1.prisma.payment.findUnique({
            where: {
                paymentRef
            }
        });
    }
    static async getUserPayments(userId) {
        return prisma_1.prisma.payment.findMany({
            where: { userId },
            orderBy: {
                createdAt: "desc"
            }
        });
    }
    static async markSuccess(paymentRef, gatewayTxnId, utrNumber) {
        return prisma_1.prisma.payment.update({
            where: {
                paymentRef
            },
            data: {
                status: "SUCCESS",
                gatewayTxnId,
                utrNumber,
                paidAt: new Date()
            }
        });
    }
    static async markFailed(paymentRef, remarks) {
        return prisma_1.prisma.payment.update({
            where: {
                paymentRef
            },
            data: {
                status: "FAILED",
                remarks
            }
        });
    }
    static async markPending(paymentRef) {
        return prisma_1.prisma.payment.update({
            where: {
                paymentRef
            },
            data: {
                status: "PENDING"
            }
        });
    }
    static async processRefund(paymentId, refundAmount, refundReason) {
        return prisma_1.prisma.payment.update({
            where: {
                id: paymentId
            },
            data: {
                status: "REFUNDED",
                refundAmount,
                refundReason,
                refundedAt: new Date()
            }
        });
    }
    static async updatePayment(id, data) {
        return prisma_1.prisma.payment.update({
            where: { id },
            data
        });
    }
    static async getPaymentsByStatus(status) {
        return prisma_1.prisma.payment.findMany({
            where: {
                status
            },
            include: {
                user: true
            }
        });
    }
    static async getPaymentsByType(paymentType) {
        return prisma_1.prisma.payment.findMany({
            where: {
                paymentType
            },
            include: {
                user: true
            }
        });
    }
    static async searchPayments(keyword) {
        return prisma_1.prisma.payment.findMany({
            where: {
                OR: [
                    {
                        paymentRef: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    },
                    {
                        gatewayTxnId: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    },
                    {
                        utrNumber: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    }
                ]
            },
            include: {
                user: true
            }
        });
    }
    static async getAllPayments(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [payments, total] = await Promise.all([
            prisma_1.prisma.payment.findMany({
                skip,
                take: limit,
                include: {
                    user: true
                },
                orderBy: {
                    createdAt: "desc"
                }
            }),
            prisma_1.prisma.payment.count()
        ]);
        return {
            payments,
            total,
            page,
            limit
        };
    }
    static async getAnalytics() {
        const [totalPayments, successPayments, failedPayments, pendingPayments, totalAmount] = await Promise.all([
            prisma_1.prisma.payment.count(),
            prisma_1.prisma.payment.count({
                where: {
                    status: "SUCCESS"
                }
            }),
            prisma_1.prisma.payment.count({
                where: {
                    status: "FAILED"
                }
            }),
            prisma_1.prisma.payment.count({
                where: {
                    status: "PENDING"
                }
            }),
            prisma_1.prisma.payment.aggregate({
                _sum: {
                    amount: true
                }
            })
        ]);
        return {
            totalPayments,
            successPayments,
            failedPayments,
            pendingPayments,
            totalAmount: totalAmount._sum.amount || 0
        };
    }
    static async getRevenueReport() {
        return prisma_1.prisma.payment.aggregate({
            where: {
                status: "SUCCESS"
            },
            _sum: {
                amount: true
            },
            _count: true,
            _avg: {
                amount: true
            }
        });
    }
}
exports.PaymentRepository = PaymentRepository;
