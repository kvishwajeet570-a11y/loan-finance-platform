"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = async (to, subject, text) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            throw new Error("Email environment variables missing");
        }
        const transporter = nodemailer_1.default.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
        const info = await transporter.sendMail({
            from: `"Loan Finance" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
        });
        console.log("EMAIL SENT =>", info.messageId);
        return info;
    }
    catch (error) {
        console.log("EMAIL ERROR =>", error);
        throw new Error("Failed to send email");
    }
};
exports.sendEmail = sendEmail;
