"use strict";
// src/integrations/email.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});
const sendEmail = async (to, subject, html) => {
    return exports.transporter.sendMail({
        from: `"India Loan Finance" <${process.env.SMTP_EMAIL}>`,
        to,
        subject,
        html,
    });
};
exports.sendEmail = sendEmail;
