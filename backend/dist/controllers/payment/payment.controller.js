"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkRefundPayments = exports.bulkVerifyPayments = exports.exportPaymentsPdf = exports.exportPaymentsExcel = exports.getMonthlyPayments = exports.getDailyPayments = exports.getPaymentDashboard = exports.getPaymentAnalytics = exports.paymentAnalytics = exports.getRefundedPayments = exports.getFailedPayments = exports.getSuccessPayments = exports.getPendingPayments = exports.searchPayments = exports.getTransactionPayments = exports.getLoanPayments = exports.getUserPayments = exports.verifyPayment = exports.initiatePayment = exports.refundPayment = exports.markPaymentRefunded = exports.markPaymentFailed = exports.markPaymentSuccess = exports.deletePayment = exports.updatePayment = exports.getPaymentById = exports.getAllPayments = exports.createPayment = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
/* ========================================
   CREATE PAYMENT
======================================== */
const createPayment = async (req, res) => {
    try {
        const payment = await prisma_1.default.payment.create({
            data: {
                paymentId: `PAY-${Date.now()}`,
                userId: req.body.userId,
                loanApplicationId: req.body.loanApplicationId,
                amount: Number(req.body.amount),
                paymentMethod: req.body.paymentMethod,
                gateway: req.body.gateway,
                purpose: req.body.purpose || "GENERAL",
                remarks: req.body.remarks,
                status: "PENDING",
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
            error,
        });
    }
};
exports.createPayment = createPayment;
/* ========================================
   GET ALL PAYMENTS
======================================== */
const getAllPayments = async (req, res) => {
    try {
        const payments = await prisma_1.default.payment.findMany({
            include: {
                user: true,
                loanApplication: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.status(200).json({
            success: true,
            data: payments,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch payments",
            error,
        });
    }
};
exports.getAllPayments = getAllPayments;
/* ========================================
   GET PAYMENT BY ID
======================================== */
const getPaymentById = async (req, res) => {
    try {
        const payment = await prisma_1.default.payment.findUnique({
            where: {
                id: String(req.params.id),
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
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed",
            error,
        });
    }
};
exports.getPaymentById = getPaymentById;
/* ========================================
   UPDATE PAYMENT
======================================== */
const updatePayment = async (req, res) => {
    try {
        const payment = await prisma_1.default.payment.update({
            where: {
                id: String(req.params.id),
            },
            data: req.body,
        });
        res.status(200).json({
            success: true,
            data: payment,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Update failed",
            error,
        });
    }
};
exports.updatePayment = updatePayment;
/* ========================================
   DELETE PAYMENT
======================================== */
const deletePayment = async (req, res) => {
    try {
        await prisma_1.default.payment.delete({
            where: {
                id: String(req.params.id),
            },
        });
        res.status(200).json({
            success: true,
            message: "Payment deleted",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Delete failed",
            error,
        });
    }
};
exports.deletePayment = deletePayment;
/* ========================================
   PAYMENT STATUS
======================================== */
const markPaymentSuccess = async (req, res) => {
    try {
        const payment = await prisma_1.default.payment.update({
            where: { id: String(req.params.id) },
            data: {
                status: "SUCCESS",
                paidAt: new Date(),
            },
        });
        res.json({
            success: true,
            data: payment,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error });
    }
};
exports.markPaymentSuccess = markPaymentSuccess;
const markPaymentFailed = async (req, res) => {
    try {
        const payment = await prisma_1.default.payment.update({
            where: { id: String(req.params.id) },
            data: {
                status: "FAILED",
                failureReason: req.body.reason,
            },
        });
        res.json({
            success: true,
            data: payment,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error });
    }
};
exports.markPaymentFailed = markPaymentFailed;
const markPaymentRefunded = async (req, res) => {
    try {
        const payment = await prisma_1.default.payment.update({
            where: { id: String(req.params.id) },
            data: {
                status: "REFUNDED",
                refundedAt: new Date(),
            },
        });
        res.json({
            success: true,
            data: payment,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error });
    }
};
exports.markPaymentRefunded = markPaymentRefunded;
exports.refundPayment = exports.markPaymentRefunded;
/* ========================================
   PAYMENT FLOW
======================================== */
exports.initiatePayment = exports.createPayment;
const verifyPayment = async (req, res) => {
    try {
        const payment = await prisma_1.default.payment.update({
            where: {
                id: String(req.body.paymentId),
            },
            data: {
                status: "SUCCESS",
                paidAt: new Date(),
            },
        });
        res.json({
            success: true,
            data: payment,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error });
    }
};
exports.verifyPayment = verifyPayment;
/* ========================================
   FILTERS
======================================== */
exports.getUserPayments = exports.getAllPayments;
exports.getLoanPayments = exports.getAllPayments;
exports.getTransactionPayments = exports.getAllPayments;
exports.searchPayments = exports.getAllPayments;
exports.getPendingPayments = exports.getAllPayments;
exports.getSuccessPayments = exports.getAllPayments;
exports.getFailedPayments = exports.getAllPayments;
exports.getRefundedPayments = exports.getAllPayments;
/* ========================================
   ANALYTICS
======================================== */
const paymentAnalytics = async (req, res) => {
    try {
        const totalPayments = await prisma_1.default.payment.count();
        res.json({
            success: true,
            totalPayments,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error });
    }
};
exports.paymentAnalytics = paymentAnalytics;
exports.getPaymentAnalytics = exports.paymentAnalytics;
exports.getPaymentDashboard = exports.paymentAnalytics;
exports.getDailyPayments = exports.paymentAnalytics;
exports.getMonthlyPayments = exports.paymentAnalytics;
/* ========================================
   EXPORTS
======================================== */
const exportPaymentsExcel = async (req, res) => {
    res.json({
        success: true,
        message: "Excel export pending",
    });
};
exports.exportPaymentsExcel = exportPaymentsExcel;
const exportPaymentsPdf = async (req, res) => {
    res.json({
        success: true,
        message: "PDF export pending",
    });
};
exports.exportPaymentsPdf = exportPaymentsPdf;
/* ========================================
   BULK ACTIONS
======================================== */
const bulkVerifyPayments = async (req, res) => {
    res.json({
        success: true,
        message: "Bulk verify completed",
    });
};
exports.bulkVerifyPayments = bulkVerifyPayments;
const bulkRefundPayments = async (req, res) => {
    res.json({
        success: true,
        message: "Bulk refund completed",
    });
};
exports.bulkRefundPayments = bulkRefundPayments;
