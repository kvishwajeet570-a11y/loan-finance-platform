"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = async (to, subject, text) => {
    try {
        /* ========================================
           ENV CHECK
        ======================================== */
        if (!process.env.EMAIL_USER ||
            !process.env.EMAIL_PASS) {
            throw new Error("Email environment variables missing");
        }
        /* ========================================
           TRANSPORTER
        ======================================== */
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        /* ========================================
           VERIFY SMTP
        ======================================== */
        await transporter.verify();
        console.log("SMTP SERVER CONNECTED");
        /* ========================================
           SEND EMAIL
        ======================================== */
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
        /* ========================================
           ERROR LOG
        ======================================== */
        console.log("EMAIL ERROR =>", error.message);
        console.log(error);
        /* ========================================
           THROW ERROR
        ======================================== */
        const emailError = new Error("Failed to send email");
        throw emailError;
    }
};
exports.sendEmail = sendEmail;
