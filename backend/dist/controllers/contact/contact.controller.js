"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma"));
/* ========================================
   SEND CONTACT MESSAGE
======================================== */
const sendMessage = async (req, res) => {
    try {
        /* ========================================
           GET DATA
        ======================================== */
        const { name, email, phone, subject, message, } = req.body;
        /* ========================================
           VALIDATION
        ======================================== */
        if (!name ||
            !email ||
            !phone ||
            !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        /* ========================================
           EMAIL VALIDATION
        ======================================== */
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email address",
            });
        }
        /* ========================================
           PHONE VALIDATION
        ======================================== */
        if (phone.length < 10) {
            return res.status(400).json({
                success: false,
                message: "Invalid phone number",
            });
        }
        /* ========================================
           SAVE MESSAGE
        ======================================== */
        const newMessage = await prisma_1.default.contactMessage.create({
            data: {
                name,
                email,
                phone,
                subject: subject || "General Inquiry",
                message,
            },
        });
        /* ========================================
           FIND ADMIN
        ======================================== */
        const admin = await prisma_1.default.user.findFirst({
            where: {
                role: "admin",
            },
        });
        /* ========================================
           CREATE NOTIFICATION
        ======================================== */
        if (admin) {
            await prisma_1.default.notification.create({
                data: {
                    userId: admin.id,
                    title: "New Contact Message",
                    message: `${name} sent a message`,
                    type: "contact",
                },
            });
        }
        /* ========================================
           RESPONSE
        ======================================== */
        return res.status(201).json({
            success: true,
            message: "Message sent successfully",
            contactMessage: newMessage,
        });
    }
    catch (error) {
        console.log("CONTACT ERROR =>", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.sendMessage = sendMessage;
