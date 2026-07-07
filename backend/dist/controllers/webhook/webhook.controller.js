"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookAnalytics = exports.getWebhookLogs = exports.whatsappWebhook = exports.cashfreeWebhook = exports.razorpayWebhook = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
/**
 * RAZORPAY WEBHOOK
 */
const razorpayWebhook = async (req, res) => {
    try {
        const payload = req.body;
        const event = payload.event;
        await prisma_1.default.webhookLog.create({
            data: {
                provider: "RAZORPAY",
                eventType: event,
                payload,
                status: "RECEIVED",
            },
        });
        switch (event) {
            case "payment.captured":
                await prisma_1.default.payment.updateMany({
                    where: {
                        transactionId: payload.payload.payment.entity.id,
                    },
                    data: {
                        status: "SUCCESS",
                    },
                });
                break;
            case "payment.failed":
                await prisma_1.default.payment.updateMany({
                    where: {
                        transactionId: payload.payload.payment.entity.id,
                    },
                    data: {
                        status: "FAILED",
                    },
                });
                break;
        }
        res.status(200).json({
            success: true,
        });
    }
    catch (error) {
        await prisma_1.default.webhookLog.create({
            data: {
                provider: "RAZORPAY",
                eventType: "UNKNOWN",
                payload: req.body,
                status: "FAILED",
                error: String(error),
            },
        });
        res.status(500).json({
            success: false,
        });
    }
};
exports.razorpayWebhook = razorpayWebhook;
/**
 * CASHFREE WEBHOOK
 */
const cashfreeWebhook = async (req, res) => {
    try {
        const payload = req.body;
        await prisma_1.default.webhookLog.create({
            data: {
                provider: "CASHFREE",
                eventType: payload.type,
                payload,
                status: "RECEIVED",
            },
        });
        if (payload.data.payment_status ===
            "SUCCESS") {
            await prisma_1.default.payment.updateMany({
                where: {
                    transactionId: payload.data.order_id,
                },
                data: {
                    status: "SUCCESS",
                },
            });
        }
        res.status(200).json({
            success: true,
        });
    }
    catch {
        res.status(500).json({
            success: false,
        });
    }
};
exports.cashfreeWebhook = cashfreeWebhook;
/**
 * WHATSAPP WEBHOOK
 */
const whatsappWebhook = async (req, res) => {
    try {
        const payload = req.body;
        await prisma_1.default.webhookLog.create({
            data: {
                provider: "WHATSAPP",
                eventType: "MESSAGE",
                payload,
                status: "RECEIVED",
            },
        });
        res.status(200).send("OK");
    }
    catch {
        res.status(500).json({
            success: false,
        });
    }
};
exports.whatsappWebhook = whatsappWebhook;
/**
 * GENERIC WEBHOOK LOGS
 */
const getWebhookLogs = async (req, res) => {
    try {
        const logs = await prisma_1.default.webhookLog.findMany({
            orderBy: {
                receivedAt: "desc",
            },
        });
        res.status(200).json({
            success: true,
            count: logs.length,
            data: logs,
        });
    }
    catch {
        res.status(500).json({
            success: false,
        });
    }
};
exports.getWebhookLogs = getWebhookLogs;
/**
 * WEBHOOK ANALYTICS
 */
const webhookAnalytics = async (req, res) => {
    try {
        const [total, success, failed,] = await Promise.all([
            prisma_1.default.webhookLog.count(),
            prisma_1.default.webhookLog.count({
                where: {
                    status: "RECEIVED",
                },
            }),
            prisma_1.default.webhookLog.count({
                where: {
                    status: "FAILED",
                },
            }),
        ]);
        res.status(200).json({
            success: true,
            data: {
                total,
                success,
                failed,
            },
        });
    }
    catch {
        res.status(500).json({
            success: false,
        });
    }
};
exports.webhookAnalytics = webhookAnalytics;
