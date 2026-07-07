"use strict";
// src/integrations/sms/sms.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendLoanRejectedSms = exports.sendLoanApprovedSms = exports.sendOtpSms = exports.sendSms = void 0;
const axios_1 = __importDefault(require("axios"));
const smsApi = axios_1.default.create({
    baseURL: process.env.SMS_API_URL,
    headers: {
        Authorization: `Bearer ${process.env.SMS_API_KEY}`,
        "Content-Type": "application/json",
    },
});
const sendSms = async (phone, message) => {
    const { data } = await smsApi.post("/send", {
        phone,
        message,
    });
    return data;
};
exports.sendSms = sendSms;
const sendOtpSms = async (phone, otp) => {
    return (0, exports.sendSms)(phone, `Your OTP is ${otp}. Valid for 10 minutes.`);
};
exports.sendOtpSms = sendOtpSms;
const sendLoanApprovedSms = async (phone) => {
    return (0, exports.sendSms)(phone, "Congratulations! Your loan application has been approved.");
};
exports.sendLoanApprovedSms = sendLoanApprovedSms;
const sendLoanRejectedSms = async (phone) => {
    return (0, exports.sendSms)(phone, "Your loan application status has been updated. Please check your account.");
};
exports.sendLoanRejectedSms = sendLoanRejectedSms;
