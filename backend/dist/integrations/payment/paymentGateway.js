"use strict";
// src/integrations/payment/paymentGateway.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refundPayment = exports.verifyPayment = exports.createPaymentOrder = void 0;
const axios_1 = __importDefault(require("axios"));
const paymentApi = axios_1.default.create({
    baseURL: process.env.PAYMENT_GATEWAY_URL,
    timeout: 10000,
    headers: {
        Authorization: `Bearer ${process.env.PAYMENT_GATEWAY_KEY}`,
        "Content-Type": "application/json",
    },
});
const createPaymentOrder = async (amount, customerName, customerEmail, customerPhone) => {
    const { data } = await paymentApi.post("/orders", {
        amount,
        customerName,
        customerEmail,
        customerPhone,
    });
    return data;
};
exports.createPaymentOrder = createPaymentOrder;
const verifyPayment = async (transactionId) => {
    const { data } = await paymentApi.get(`/payments/${transactionId}`);
    return data;
};
exports.verifyPayment = verifyPayment;
const refundPayment = async (transactionId, amount) => {
    const { data } = await paymentApi.post("/refund", {
        transactionId,
        amount,
    });
    return data;
};
exports.refundPayment = refundPayment;
exports.default = paymentApi;
