"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTicket = exports.updateTicketStatus = exports.getAllTickets = exports.getUserTickets = exports.createSupportTicket = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma"));
/* ========================================
   CREATE SUPPORT TICKET
======================================== */
const createSupportTicket = async (req, res) => {
    try {
        const { userId, subject, message, priority, } = req.body;
        /* ========================================
           VALIDATION
        ======================================== */
        if (!userId ||
            !subject ||
            !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        /* ========================================
           CHECK USER
        ======================================== */
        const user = await prisma_1.default.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        /* ========================================
           CREATE TICKET
        ======================================== */
        const ticket = await prisma_1.default.supportTicket.create({
            data: {
                userId,
                subject,
                message,
                priority: priority || "medium",
                status: "open",
            },
        });
        /* ========================================
           CREATE NOTIFICATION
        ======================================== */
        await prisma_1.default.notification.create({
            data: {
                userId,
                title: "Support Ticket Created",
                message: `Your support ticket "${subject}" has been created successfully.`,
                type: "support",
            },
        });
        /* ========================================
           RESPONSE
        ======================================== */
        return res.status(201).json({
            success: true,
            message: "Support ticket created successfully",
            ticket,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create ticket",
        });
    }
};
exports.createSupportTicket = createSupportTicket;
/* ========================================
   GET USER TICKETS
======================================== */
const getUserTickets = async (req, res) => {
    try {
        const userId = req.params.userId;
        /* ========================================
           VALIDATION
        ======================================== */
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }
        /* ========================================
           FETCH TICKETS
        ======================================== */
        const tickets = await prisma_1.default.supportTicket.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        /* ========================================
           RESPONSE
        ======================================== */
        return res.status(200).json({
            success: true,
            count: tickets.length,
            tickets,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch tickets",
        });
    }
};
exports.getUserTickets = getUserTickets;
/* ========================================
   GET ALL SUPPORT TICKETS
======================================== */
const getAllTickets = async (req, res) => {
    try {
        const tickets = await prisma_1.default.supportTicket.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return res.status(200).json({
            success: true,
            count: tickets.length,
            tickets,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch support tickets",
        });
    }
};
exports.getAllTickets = getAllTickets;
/* ========================================
   UPDATE TICKET STATUS
======================================== */
const updateTicketStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status, adminReply, } = req.body;
        /* ========================================
           FIND TICKET
        ======================================== */
        const existingTicket = await prisma_1.default.supportTicket.findUnique({
            where: {
                id,
            },
        });
        if (!existingTicket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }
        /* ========================================
           UPDATE TICKET
        ======================================== */
        const updatedTicket = await prisma_1.default.supportTicket.update({
            where: {
                id,
            },
            data: {
                status,
                adminReply,
            },
        });
        /* ========================================
           CREATE NOTIFICATION
        ======================================== */
        await prisma_1.default.notification.create({
            data: {
                userId: existingTicket.userId,
                title: "Support Ticket Updated",
                message: `Your ticket "${existingTicket.subject}" status changed to ${status}.`,
                type: "support",
            },
        });
        /* ========================================
           RESPONSE
        ======================================== */
        return res.status(200).json({
            success: true,
            message: "Ticket updated successfully",
            ticket: updatedTicket,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update ticket",
        });
    }
};
exports.updateTicketStatus = updateTicketStatus;
/* ========================================
   DELETE SUPPORT TICKET
======================================== */
const deleteTicket = async (req, res) => {
    try {
        const id = req.params.id;
        const ticket = await prisma_1.default.supportTicket.findUnique({
            where: {
                id,
            },
        });
        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }
        await prisma_1.default.supportTicket.delete({
            where: {
                id,
            },
        });
        return res.status(200).json({
            success: true,
            message: "Support ticket deleted successfully",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete support ticket",
        });
    }
};
exports.deleteTicket = deleteTicket;
