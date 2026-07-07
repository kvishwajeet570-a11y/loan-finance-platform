"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentAnalytics = exports.refundPayment = exports.markPaymentSuccess = exports.getPaymentById = exports.getAllPayments = exports.createPayment = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
/**
 * CREATE PAYMENT
 */
const createPayment = async (req, res) => {
    try {
        const payment = await prisma_1.default.payment.create({
            data: {
                paymentId: `PAY-${Date.now()}`,
                userId: req.body.userId,
                loanApplicationId: req.body.loanApplicationId,
                amount: Number(req.body.amount),
                paymentType: req.body.paymentType,
                paymentMethod: req.body.paymentMethod,
                gateway: req.body.gateway,
                remarks: req.body.remarks,
            },
        });
        res.status(201).json({
            success: true,
            data: payment,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Payment creation failed",
        });
    }
};
exports.createPayment = createPayment;
/**
 * GET ALL PAYMENTS
 */
const getAllPayments = async (req, res) => {
    try {
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 20);
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
        res.status(200).json({
            success: true,
            total,
            page,
            data: payments,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch payments",
        });
    }
};
exports.getAllPayments = getAllPayments;
/**
 * GET PAYMENT BY ID
 */
const getPaymentById = async (req, res) => {
    try {
        const payment = await prisma_1.default.payment.findUnique({
            where: {
                id: req.params.id,
            },
            include: {
                user: true,
                loanApplication: true,
            },
        });
        if (!payment) {
            res.status(404).json({
                success: false,
                message: "Payment not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: payment,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed",
        });
    }
};
exports.getPaymentById = getPaymentById;
/**
 * MARK SUCCESS
 */
const markPaymentSuccess = async (req, res) => {
    try {
        const payment = await prisma_1.default.payment.update({
            where: {
                id: req.params.id,
            },
            data: {
                status: "SUCCESS",
                transactionId: req.body.transactionId,
                gatewayResponse: req.body.gatewayResponse,
                paidAt: new Date(),
            },
        });
        res.status(200).json({
            success: true,
            message: "Payment successful",
            data: payment,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Update failed",
        });
    }
};
exports.markPaymentSuccess = markPaymentSuccess;
/**
 * REFUND PAYMENT
 */
const refundPayment = async (req, res) => {
    try {
        const payment = await prisma_1.default.payment.update({
            where: {
                id: req.params.id,
            },
            data: {
                status: "REFUNDED",
            },
        });
        res.status(200).json({
            success: true,
            data: payment,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Refund failed",
        });
    }
};
exports.refundPayment = refundPayment;
/**
 * PAYMENT ANALYTICS
 */
const paymentAnalytics = async (req, res) => {
    try {
        const [totalPayments, successPayments, failedPayments, revenue,] = await Promise.all([
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
        res.status(200).json({
            success: true,
            data: {
                totalPayments,
                successPayments,
                failedPayments,
                revenue: revenue._sum.amount || 0,
            },
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Analytics failed",
        });
    }
};
exports.paymentAnalytics = paymentAnalytics;
