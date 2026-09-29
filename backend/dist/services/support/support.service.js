"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class SupportService {
    /**
     * Create Ticket
     */
    async createTicket(data) {
        return prisma_1.default.supportTicket.create({
            data: {
                ticketNumber: `TKT-${Date.now()}`,
                userId: data.userId,
                subject: data.subject,
                message: data.description, // या DTO में अलग message field जोड़ो
                description: data.description,
                category: data.category,
                priority: data.priority || "medium",
                status: "open",
            },
        });
    }
    /**
     * Get Ticket By ID
     */
    async getTicketById(ticketId) {
        return prisma_1.default.supportTicket.findUnique({
            where: {
                id: ticketId,
            },
            include: {
                user: true,
                assignedAdmin: true,
                replies: {
                    orderBy: {
                        createdAt: "asc",
                    },
                },
            },
        });
    }
    /**
     * Get All Tickets
     */
    async getAllTickets(page = 1, limit = 20, status) {
        const skip = (page - 1) * limit;
        const where = status
            ? { status }
            : {};
        const [tickets, total] = await Promise.all([
            prisma_1.default.supportTicket.findMany({
                where,
                skip,
                take: limit,
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
            }),
            prisma_1.default.supportTicket.count({
                where,
            }),
        ]);
        return {
            tickets,
            total,
            page,
            pages: Math.ceil(total / limit),
        };
    }
    /**
     * Assign Ticket
     */
    async assignTicket(ticketId, adminId) {
        return prisma_1.default.supportTicket.update({
            where: {
                id: ticketId,
            },
            data: {
                assignedTo: adminId,
                status: "ASSIGNED",
            },
        });
    }
    /**
     * Add Reply
     */
    async addReply(ticketId, userId, message) {
        return prisma_1.default.supportReply.create({
            data: {
                ticketId,
                userId,
                message,
            },
        });
    }
    /**
     * Resolve Ticket
     */
    async resolveTicket(ticketId) {
        return prisma_1.default.supportTicket.update({
            where: {
                id: ticketId,
            },
            data: {
                status: "RESOLVED",
                resolvedAt: new Date(),
            },
        });
    }
    /**
     * Close Ticket
     */
    async closeTicket(ticketId) {
        return prisma_1.default.supportTicket.update({
            where: {
                id: ticketId,
            },
            data: {
                status: "CLOSED",
            },
        });
    }
    /**
     * Escalate Ticket
     */
    async escalateTicket(ticketId) {
        return prisma_1.default.supportTicket.update({
            where: {
                id: ticketId,
            },
            data: {
                priority: "HIGH",
                status: "ESCALATED",
            },
        });
    }
    /**
     * User Tickets
     */
    async getUserTickets(userId) {
        return prisma_1.default.supportTicket.findMany({
            where: {
                userId,
            },
            include: {
                replies: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    /**
     * Admin Tickets
     */
    async getAssignedTickets(adminId) {
        return prisma_1.default.supportTicket.findMany({
            where: {
                assignedTo: adminId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    /**
     * Support Analytics
     */
    async getSupportStats() {
        const [totalTickets, openTickets, resolvedTickets, closedTickets, escalatedTickets,] = await Promise.all([
            prisma_1.default.supportTicket.count(),
            prisma_1.default.supportTicket.count({
                where: {
                    status: "OPEN",
                },
            }),
            prisma_1.default.supportTicket.count({
                where: {
                    status: "RESOLVED",
                },
            }),
            prisma_1.default.supportTicket.count({
                where: {
                    status: "CLOSED",
                },
            }),
            prisma_1.default.supportTicket.count({
                where: {
                    status: "ESCALATED",
                },
            }),
        ]);
        return {
            totalTickets,
            openTickets,
            resolvedTickets,
            closedTickets,
            escalatedTickets,
        };
    }
    /**
     * SLA Report
     */
    async slaReport() {
        return prisma_1.default.supportTicket.findMany({
            where: {
                status: {
                    not: "CLOSED",
                },
            },
            select: {
                id: true,
                subject: true,
                priority: true,
                createdAt: true,
            },
        });
    }
    /**
     * Recent Support Activity
     */
    async recentActivities() {
        return prisma_1.default.supportReply.findMany({
            take: 50,
            include: {
                ticket: true,
                user: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
}
exports.default = new SupportService();
