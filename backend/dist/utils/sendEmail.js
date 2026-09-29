"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = async (to, subject, text) => {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    if (!user || !pass) {
        throw new Error("EMAIL_USER or EMAIL_PASS is missing");
    }
    if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
        throw new Error("Invalid recipient email");
    }
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        secure: false,
        auth: {
            user,
            pass,
        },
    });
    const info = await transporter.sendMail({
        from: `"${process.env.BREVO_SENDER_NAME || "India Loan Finance"}" <${process.env.BREVO_SENDER_EMAIL || user}>`,
        to,
        subject,
        text,
    });
    console.log("EMAIL_SENT:", {
        to,
        messageId: info.messageId,
    });
    return {
        success: true,
        messageId: info.messageId,
    };
};
exports.sendEmail = sendEmail;
