"use strict";
// src/integrations/whatsapp/whatsapp.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendLoanRejectedWhatsapp = exports.sendLoanApprovedWhatsapp = exports.sendOtpWhatsapp = exports.sendWhatsappMessage = void 0;
const axios_1 = __importDefault(require("axios"));
const whatsappApi = axios_1.default.create({
    baseURL: process.env.WHATSAPP_API_URL,
    headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_API_KEY}`,
        "Content-Type": "application/json",
    },
});
const sendWhatsappMessage = async (phone, message) => {
    const { data } = await whatsappApi.post("/send", {
        phone,
        message,
    });
    return data;
};
exports.sendWhatsappMessage = sendWhatsappMessage;
const sendOtpWhatsapp = async (phone, otp) => {
    return (0, exports.sendWhatsappMessage)(phone, `Your OTP is ${otp}. Valid for 10 minutes.`);
};
exports.sendOtpWhatsapp = sendOtpWhatsapp;
const sendLoanApprovedWhatsapp = async (phone, name) => {
    return (0, exports.sendWhatsappMessage)(phone, `Hello ${name}, your loan application has been approved.`);
};
exports.sendLoanApprovedWhatsapp = sendLoanApprovedWhatsapp;
const sendLoanRejectedWhatsapp = async (phone, name) => {
    return (0, exports.sendWhatsappMessage)(phone, `Hello ${name}, your loan application status has been updated.`);
};
exports.sendLoanRejectedWhatsapp = sendLoanRejectedWhatsapp;
