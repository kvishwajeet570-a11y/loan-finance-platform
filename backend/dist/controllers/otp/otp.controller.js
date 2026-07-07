"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpAnalytics = exports.resendOTP = exports.verifyOTP = exports.sendOTP = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const OTP_EXPIRY_MINUTES = 10;
const MAX_ATTEMPTS = 5;
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
/**
 * SEND OTP
 */
const sendOTP = async (req, res) => {
    try {
        const { phoneNo, email, purpose } = req.body;
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
        await prisma_1.default.oTP.create({
            data: {
                phoneNo,
                email,
                purpose,
                otp,
                expiresAt,
            },
        });
        // TODO:
        // SMS Service
        // Email Service
        console.log("OTP:", otp);
        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to send OTP",
        });
    }
};
exports.sendOTP = sendOTP;
/**
 * VERIFY OTP
 */
const verifyOTP = async (req, res) => {
    try {
        const { phoneNo, email, otp, purpose } = req.body;
        const record = await prisma_1.default.oTP.findFirst({
            where: {
                OR: [
                    { phoneNo },
                    { email },
                ],
                purpose,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        if (!record) {
            res.status(404).json({
                success: false,
                message: "OTP not found",
            });
            return;
        }
        if (record.attempts >= MAX_ATTEMPTS) {
            res.status(403).json({
                success: false,
                message: "Maximum verification attempts exceeded",
            });
            return;
        }
        if (new Date() >
            record.expiresAt) {
            res.status(400).json({
                success: false,
                message: "OTP expired",
            });
            return;
        }
        if (record.otp !== otp) {
            await prisma_1.default.oTP.update({
                where: {
                    id: record.id,
                },
                data: {
                    attempts: {
                        increment: 1,
                    },
                },
            });
            res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
            return;
        }
        await prisma_1.default.oTP.update({
            where: {
                id: record.id,
            },
            data: {
                isVerified: true,
            },
        });
        res.status(200).json({
            success: true,
            message: "OTP verified successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "OTP verification failed",
        });
    }
};
exports.verifyOTP = verifyOTP;
/**
 * RESEND OTP
 */
const resendOTP = async (req, res) => {
    try {
        const { phoneNo, email, purpose, } = req.body;
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
        await prisma_1.default.oTP.create({
            data: {
                phoneNo,
                email,
                purpose,
                otp,
                expiresAt,
            },
        });
        console.log("Resend OTP:", otp);
        res.status(200).json({
            success: true,
            message: "OTP resent successfully",
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Resend failed",
        });
    }
};
exports.resendOTP = resendOTP;
/**
 * OTP ANALYTICS
 */
const otpAnalytics = async (req, res) => {
    try {
        const [total, verified, pending,] = await Promise.all([
            prisma_1.default.oTP.count(),
            prisma_1.default.oTP.count({
                where: {
                    isVerified: true,
                },
            }),
            prisma_1.default.oTP.count({
                where: {
                    isVerified: false,
                },
            }),
        ]);
        res.status(200).json({
            success: true,
            data: {
                total,
                verified,
                pending,
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
exports.otpAnalytics = otpAnalytics;
