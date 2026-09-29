"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTicketStatistics = exports.getResponseTimeReport = exports.getSlaReport = exports.convertTicketToFaq = exports.createFaqTicket = exports.sendSupportMessage = exports.getChatHistory = exports.getLiveSupportChats = exports.bulkDeleteTickets = exports.bulkCloseTickets = exports.bulkAssignTickets = exports.getTicketAuditLogs = exports.exportTicketsPdf = exports.exportTicketsExcel = exports.searchTickets = exports.getCustomerSupportHistory = exports.getDepartmentPerformance = exports.getAgentPerformance = exports.getTopAgents = exports.getRecentTickets = exports.getSupportAnalytics = exports.getSupportDashboard = exports.escalateTicket = exports.getEscalatedTickets = exports.getClosedTickets = exports.getResolvedTickets = exports.getOpenTickets = exports.getPendingTickets = exports.getMyTickets = exports.getTicketReplies = exports.addReply = exports.resolveTicket = exports.reopenTicket = exports.closeTicket = exports.transferTicket = exports.assignTicket = exports.updateTicket = exports.getTicketById = exports.deleteTicket = exports.updateTicketStatus = exports.getAllTickets = exports.getUserTickets = exports.createTicket = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
/* ========================================
   CREATE SUPPORT TICKET
======================================== */
const createTicket = async (req, res) => {
    try {
        const { userId, subject, message, priority, } = req.body;
        /* ========================================
           VALIDATION
        ======================================== */
        if (!userId || !subject || !message) {
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
                ticketNumber: `TKT-${Date.now()}`,
                userId,
                subject,
                message,
                priority: priority || "medium",
                status: "open",
            },
        });
        return res.status(201).json({
            success: true,
            message: "Support ticket created successfully",
            ticket,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create support ticket",
        });
    }
};
exports.createTicket = createTicket;
/* ========================================
   GET USER TICKETS
======================================== */
const getUserTickets = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }
        const tickets = await prisma_1.default.supportTicket.findMany({
            where: {
                userId,
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
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user tickets",
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
/* ========================================
 GET TICKET BY ID
======================================== */
const getTicketById = async (req, res) => {
    try {
        const id = String(req.params.id);
        const ticket = await prisma_1.default.supportTicket.findUnique({
            where: { id },
            include: {
                user: true,
                replies: true,
            },
        });
        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }
        return res.status(200).json({
            success: true,
            ticket,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch ticket",
        });
    }
};
exports.getTicketById = getTicketById;
/* ========================================
   UPDATE TICKET
======================================== */
const updateTicket = async (req, res) => {
    try {
        const id = String(req.params.id);
        const ticket = await prisma_1.default.supportTicket.findUnique({
            where: { id },
        });
        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }
        const updated = await prisma_1.default.supportTicket.update({
            where: { id },
            data: req.body,
        });
        return res.status(200).json({
            success: true,
            ticket: updated,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update ticket",
        });
    }
};
exports.updateTicket = updateTicket;
/* ========================================
   ASSIGN TICKET
======================================== */
const assignTicket = async (req, res) => {
    try {
        const { assignedTo } = req.body;
        const ticket = await prisma_1.default.supportTicket.update({
            where: { id: String(req.params.id) },
            data: {
                assignedTo,
                status: "assigned",
            },
        });
        return res.status(200).json({
            success: true,
            ticket,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to assign ticket",
        });
    }
};
exports.assignTicket = assignTicket;
/* ========================================
   TRANSFER TICKET
======================================== */
const transferTicket = async (req, res) => {
    try {
        const { assignedTo } = req.body;
        const ticket = await prisma_1.default.supportTicket.update({
            where: { id: String(req.params.id) },
            data: {
                assignedTo,
            },
        });
        return res.status(200).json({
            success: true,
            ticket,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to transfer ticket",
        });
    }
};
exports.transferTicket = transferTicket;
/* ========================================
   CLOSE TICKET
======================================== */
const closeTicket = async (req, res) => {
    try {
        const id = String(req.params.id);
        const ticket = await prisma_1.default.supportTicket.update({
            where: { id },
            data: {
                status: "closed",
            },
        });
        return res.status(200).json({
            success: true,
            ticket,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to close ticket",
        });
    }
};
exports.closeTicket = closeTicket;
/* ========================================
   REOPEN TICKET
======================================== */
const reopenTicket = async (req, res) => {
    try {
        const id = String(req.params.id);
        const ticket = await prisma_1.default.supportTicket.update({
            where: { id },
            data: {
                status: "open",
                resolvedAt: null,
            },
        });
        return res.status(200).json({
            success: true,
            ticket,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to reopen ticket",
        });
    }
};
exports.reopenTicket = reopenTicket;
/* ========================================
   RESOLVE TICKET
======================================== */
const resolveTicket = async (req, res) => {
    try {
        const { adminReply } = req.body;
        const ticket = await prisma_1.default.supportTicket.update({
            where: { id: String(req.params.id) },
            data: {
                status: "resolved",
                adminReply,
                resolvedAt: new Date(),
            },
        });
        return res.status(200).json({
            success: true,
            ticket,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to resolve ticket",
        });
    }
};
exports.resolveTicket = resolveTicket;
/* ========================================
   ADD REPLY
======================================== */
const addReply = async (req, res) => {
    try {
        const id = String(req.params.id);
        const { userId, message } = req.body;
        if (!userId || !message) {
            return res.status(400).json({
                success: false,
                message: "userId and message are required",
            });
        }
        const ticket = await prisma_1.default.supportTicket.findUnique({
            where: { id },
        });
        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }
        const reply = await prisma_1.default.supportReply.create({
            data: {
                ticketId: id,
                userId,
                message,
            },
        });
        return res.status(201).json({
            success: true,
            message: "Reply added successfully",
            reply,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to add reply",
        });
    }
};
exports.addReply = addReply;
/* ========================================
   GET TICKET REPLIES
======================================== */
const getTicketReplies = async (req, res) => {
    try {
        const id = String(req.params.id);
        const replies = await prisma_1.default.supportReply.findMany({
            where: {
                ticketId: id,
            },
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
                createdAt: "asc",
            },
        });
        return res.status(200).json({
            success: true,
            count: replies.length,
            replies,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch replies",
        });
    }
};
exports.getTicketReplies = getTicketReplies;
/* ========================================
   GET MY TICKETS
======================================== */
const getMyTickets = async (req, res) => {
    try {
        const userId = req.query.userId;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }
        const tickets = await prisma_1.default.supportTicket.findMany({
            where: {
                userId,
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
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch tickets",
        });
    }
};
exports.getMyTickets = getMyTickets;
/* ========================================
   GET PENDING TICKETS
======================================== */
const getPendingTickets = async (req, res) => {
    try {
        const tickets = await prisma_1.default.supportTicket.findMany({
            where: {
                status: "pending",
            },
            include: {
                user: true,
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
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch pending tickets",
        });
    }
};
exports.getPendingTickets = getPendingTickets;
/* ========================================
   GET OPEN TICKETS
======================================== */
const getOpenTickets = async (req, res) => {
    try {
        const tickets = await prisma_1.default.supportTicket.findMany({
            where: {
                status: "open",
            },
            include: {
                user: true,
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
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch open tickets",
        });
    }
};
exports.getOpenTickets = getOpenTickets;
/* ========================================
   GET RESOLVED TICKETS
======================================== */
const getResolvedTickets = async (req, res) => {
    try {
        const tickets = await prisma_1.default.supportTicket.findMany({
            where: {
                status: "resolved",
            },
            include: {
                user: true,
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
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch resolved tickets",
        });
    }
};
exports.getResolvedTickets = getResolvedTickets;
/* ========================================
   GET CLOSED TICKETS
======================================== */
const getClosedTickets = async (req, res) => {
    try {
        const tickets = await prisma_1.default.supportTicket.findMany({
            where: {
                status: "closed",
            },
            include: {
                user: true,
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
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch closed tickets",
        });
    }
};
exports.getClosedTickets = getClosedTickets;
/* ========================================
   GET ESCALATED TICKETS
======================================== */
const getEscalatedTickets = async (req, res) => {
    try {
        const tickets = await prisma_1.default.supportTicket.findMany({
            where: {
                status: "escalated",
            },
            include: {
                user: true,
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
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch escalated tickets",
        });
    }
};
exports.getEscalatedTickets = getEscalatedTickets;
/* ========================================
   ESCALATE TICKET
======================================== */
const escalateTicket = async (req, res) => {
    try {
        const id = String(req.params.id);
        const ticket = await prisma_1.default.supportTicket.findUnique({
            where: { id },
        });
        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }
        const updated = await prisma_1.default.supportTicket.update({
            where: { id },
            data: {
                status: "escalated",
            },
        });
        return res.status(200).json({
            success: true,
            message: "Ticket escalated successfully",
            ticket: updated,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to escalate ticket",
        });
    }
};
exports.escalateTicket = escalateTicket;
/* ========================================
   SUPPORT DASHBOARD
======================================== */
const getSupportDashboard = async (req, res) => {
    try {
        const [total, open, pending, resolved, closed, escalated,] = await Promise.all([
            prisma_1.default.supportTicket.count(),
            prisma_1.default.supportTicket.count({
                where: { status: "open" },
            }),
            prisma_1.default.supportTicket.count({
                where: { status: "pending" },
            }),
            prisma_1.default.supportTicket.count({
                where: { status: "resolved" },
            }),
            prisma_1.default.supportTicket.count({
                where: { status: "closed" },
            }),
            prisma_1.default.supportTicket.count({
                where: { status: "escalated" },
            }),
        ]);
        return res.status(200).json({
            success: true,
            dashboard: {
                total,
                open,
                pending,
                resolved,
                closed,
                escalated,
            },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to load dashboard",
        });
    }
};
exports.getSupportDashboard = getSupportDashboard;
/* ========================================
   SUPPORT ANALYTICS
======================================== */
const getSupportAnalytics = async (req, res) => {
    try {
        const analytics = await prisma_1.default.supportTicket.groupBy({
            by: ["status"],
            _count: {
                status: true,
            },
        });
        return res.status(200).json({
            success: true,
            analytics,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch analytics",
        });
    }
};
exports.getSupportAnalytics = getSupportAnalytics;
/* ========================================
   RECENT TICKETS
======================================== */
const getRecentTickets = async (req, res) => {
    try {
        const tickets = await prisma_1.default.supportTicket.findMany({
            include: {
                user: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 10,
        });
        return res.status(200).json({
            success: true,
            tickets,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch recent tickets",
        });
    }
};
exports.getRecentTickets = getRecentTickets;
/* ========================================
   TOP AGENTS
======================================== */
const getTopAgents = async (req, res) => {
    try {
        const agents = await prisma_1.default.supportTicket.groupBy({
            by: ["assignedTo"],
            _count: {
                assignedTo: true,
            },
            orderBy: {
                _count: {
                    assignedTo: "desc",
                },
            },
            take: 10,
        });
        return res.status(200).json({
            success: true,
            agents,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch top agents",
        });
    }
};
exports.getTopAgents = getTopAgents;
/* ========================================
   AGENT PERFORMANCE
======================================== */
const getAgentPerformance = async (req, res) => {
    try {
        const performance = await prisma_1.default.supportTicket.groupBy({
            by: ["assignedTo", "status"],
            _count: true,
        });
        return res.status(200).json({
            success: true,
            performance,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch agent performance",
        });
    }
};
exports.getAgentPerformance = getAgentPerformance;
/* ========================================
   DEPARTMENT PERFORMANCE
======================================== */
const getDepartmentPerformance = async (req, res) => {
    try {
        const performance = await prisma_1.default.supportTicket.groupBy({
            by: ["category"],
            _count: {
                category: true,
            },
        });
        return res.status(200).json({
            success: true,
            performance,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch department performance",
        });
    }
};
exports.getDepartmentPerformance = getDepartmentPerformance;
/* ========================================
   GET CUSTOMER SUPPORT HISTORY
======================================== */
const getCustomerSupportHistory = async (req, res) => {
    try {
        const customerId = String(req.params.customerId);
        const history = await prisma_1.default.supportTicket.findMany({
            where: {
                userId: customerId,
            },
            include: {
                replies: {
                    orderBy: {
                        createdAt: "asc",
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return res.status(200).json({
            success: true,
            count: history.length,
            history,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch customer support history",
        });
    }
};
exports.getCustomerSupportHistory = getCustomerSupportHistory;
/* ========================================
   SEARCH TICKETS
======================================== */
const searchTickets = async (req, res) => {
    try {
        const keyword = String(req.query.keyword || "");
        const tickets = await prisma_1.default.supportTicket.findMany({
            where: {
                OR: [
                    {
                        subject: {
                            contains: keyword,
                            mode: "insensitive",
                        },
                    },
                    {
                        message: {
                            contains: keyword,
                            mode: "insensitive",
                        },
                    },
                    {
                        description: {
                            contains: keyword,
                            mode: "insensitive",
                        },
                    },
                    {
                        category: {
                            contains: keyword,
                            mode: "insensitive",
                        },
                    },
                ],
            },
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
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Search failed",
        });
    }
};
exports.searchTickets = searchTickets;
/* ========================================
   EXPORT TICKETS EXCEL
======================================== */
const exportTicketsExcel = async (req, res) => {
    try {
        const tickets = await prisma_1.default.supportTicket.findMany({
            include: {
                user: {
                    select: {
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
            message: "Excel export data generated successfully",
            total: tickets.length,
            data: tickets,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to export Excel",
        });
    }
};
exports.exportTicketsExcel = exportTicketsExcel;
/* ========================================
   EXPORT TICKETS PDF
======================================== */
const exportTicketsPdf = async (req, res) => {
    try {
        const tickets = await prisma_1.default.supportTicket.findMany({
            include: {
                user: {
                    select: {
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
            message: "PDF export data generated successfully",
            total: tickets.length,
            data: tickets,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to export PDF",
        });
    }
};
exports.exportTicketsPdf = exportTicketsPdf;
/* ========================================
   TICKET AUDIT LOGS
======================================== */
const getTicketAuditLogs = async (req, res) => {
    try {
        const { id } = req.query;
        const ticket = await prisma_1.default.supportTicket.findUnique({
            where: {
                id: String(id),
            },
            include: {
                replies: {
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
                        createdAt: "asc",
                    },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                assignedAdmin: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }
        return res.status(200).json({
            success: true,
            auditLog: ticket,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch audit logs",
        });
    }
};
exports.getTicketAuditLogs = getTicketAuditLogs;
/* ========================================
   BULK ASSIGN TICKETS
======================================== */
const bulkAssignTickets = async (req, res) => {
    try {
        const { ticketIds, assignedTo } = req.body;
        if (!Array.isArray(ticketIds) ||
            ticketIds.length === 0 ||
            !assignedTo) {
            return res.status(400).json({
                success: false,
                message: "ticketIds and assignedTo are required",
            });
        }
        const result = await prisma_1.default.supportTicket.updateMany({
            where: {
                id: {
                    in: ticketIds,
                },
            },
            data: {
                assignedTo,
                status: "assigned",
            },
        });
        return res.status(200).json({
            success: true,
            updated: result.count,
            message: "Tickets assigned successfully",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Bulk assignment failed",
        });
    }
};
exports.bulkAssignTickets = bulkAssignTickets;
/* ========================================
   BULK CLOSE TICKETS
======================================== */
const bulkCloseTickets = async (req, res) => {
    try {
        const { ticketIds } = req.body;
        if (!Array.isArray(ticketIds) ||
            ticketIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "ticketIds are required",
            });
        }
        const result = await prisma_1.default.supportTicket.updateMany({
            where: {
                id: {
                    in: ticketIds,
                },
            },
            data: {
                status: "closed",
            },
        });
        return res.status(200).json({
            success: true,
            updated: result.count,
            message: "Tickets closed successfully",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Bulk close failed",
        });
    }
};
exports.bulkCloseTickets = bulkCloseTickets;
/* ========================================
   BULK DELETE TICKETS
======================================== */
const bulkDeleteTickets = async (req, res) => {
    try {
        const { ticketIds } = req.body;
        if (!Array.isArray(ticketIds) ||
            ticketIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "ticketIds are required",
            });
        }
        const result = await prisma_1.default.supportTicket.deleteMany({
            where: {
                id: {
                    in: ticketIds,
                },
            },
        });
        return res.status(200).json({
            success: true,
            deleted: result.count,
            message: "Tickets deleted successfully",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Bulk delete failed",
        });
    }
};
exports.bulkDeleteTickets = bulkDeleteTickets;
/* ========================================
   LIVE SUPPORT CHATS
======================================== */
const getLiveSupportChats = async (req, res) => {
    try {
        const chats = await prisma_1.default.supportTicket.findMany({
            where: {
                status: {
                    in: ["open", "assigned", "escalated"],
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                replies: {
                    orderBy: {
                        createdAt: "asc",
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return res.status(200).json({
            success: true,
            total: chats.length,
            chats,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch live chats",
        });
    }
};
exports.getLiveSupportChats = getLiveSupportChats;
/* ========================================
   CHAT HISTORY
======================================== */
const getChatHistory = async (req, res) => {
    try {
        const chatId = String(req.params.chatId);
        const chat = await prisma_1.default.supportTicket.findUnique({
            where: {
                id: chatId,
            },
            include: {
                user: true,
                replies: {
                    include: {
                        user: true,
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
        });
        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found",
            });
        }
        return res.status(200).json({
            success: true,
            chat,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch chat history",
        });
    }
};
exports.getChatHistory = getChatHistory;
/* ========================================
   SEND SUPPORT MESSAGE
======================================== */
const sendSupportMessage = async (req, res) => {
    try {
        const { ticketId, userId, message, } = req.body;
        if (!ticketId || !userId || !message) {
            return res.status(400).json({
                success: false,
                message: "ticketId, userId and message are required",
            });
        }
        const reply = await prisma_1.default.supportReply.create({
            data: {
                ticketId,
                userId,
                message,
            },
        });
        return res.status(201).json({
            success: true,
            message: "Message sent successfully",
            reply,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to send message",
        });
    }
};
exports.sendSupportMessage = sendSupportMessage;
/* ========================================
   CREATE FAQ TICKET
======================================== */
const createFaqTicket = async (req, res) => {
    try {
        const { userId, subject, message, category } = req.body;
        const ticket = await prisma_1.default.supportTicket.create({
            data: {
                ticketNumber: `FAQ-${Date.now()}`,
                userId,
                subject,
                message,
                category,
                priority: "medium",
                status: "faq",
            },
        });
        return res.status(201).json({
            success: true,
            ticket,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create FAQ ticket",
        });
    }
};
exports.createFaqTicket = createFaqTicket;
/* ========================================
   CONVERT TICKET TO FAQ
======================================== */
const convertTicketToFaq = async (req, res) => {
    try {
        const ticketId = String(req.params.ticketId);
        const ticket = await prisma_1.default.supportTicket.update({
            where: {
                id: ticketId,
            },
            data: {
                status: "faq",
            },
        });
        return res.status(200).json({
            success: true,
            ticket,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to convert ticket",
        });
    }
};
exports.convertTicketToFaq = convertTicketToFaq;
/* ========================================
   SLA REPORT
======================================== */
const getSlaReport = async (req, res) => {
    try {
        const report = await prisma_1.default.supportTicket.groupBy({
            by: ["priority"],
            _count: true,
        });
        return res.status(200).json({
            success: true,
            report,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to generate SLA report",
        });
    }
};
exports.getSlaReport = getSlaReport;
/* ========================================
   RESPONSE TIME REPORT
======================================== */
const getResponseTimeReport = async (req, res) => {
    try {
        const tickets = await prisma_1.default.supportTicket.findMany({
            select: {
                id: true,
                subject: true,
                createdAt: true,
                resolvedAt: true,
                status: true,
            },
        });
        return res.status(200).json({
            success: true,
            report: tickets,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to generate response time report",
        });
    }
};
exports.getResponseTimeReport = getResponseTimeReport;
/* ========================================
   SUPPORT STATISTICS
======================================== */
const getTicketStatistics = async (req, res) => {
    try {
        const [total, open, pending, resolved, closed, escalated,] = await Promise.all([
            prisma_1.default.supportTicket.count(),
            prisma_1.default.supportTicket.count({ where: { status: "open" } }),
            prisma_1.default.supportTicket.count({ where: { status: "pending" } }),
            prisma_1.default.supportTicket.count({ where: { status: "resolved" } }),
            prisma_1.default.supportTicket.count({ where: { status: "closed" } }),
            prisma_1.default.supportTicket.count({ where: { status: "escalated" } }),
        ]);
        return res.status(200).json({
            success: true,
            statistics: {
                total,
                open,
                pending,
                resolved,
                closed,
                escalated,
            },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch statistics",
        });
    }
};
exports.getTicketStatistics = getTicketStatistics;
