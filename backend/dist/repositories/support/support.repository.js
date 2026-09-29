"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportRepository = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class SupportRepository {
    static async createTicket(data) {
        return prisma_1.default.supportTicket.create({
            data: {
                ticketNumber: `TKT-${Date.now()}`,
                ...data,
                priority: data.priority ?? "medium",
                status: "open",
            },
        });
    }
    /* =========================
        GET TICKET
    ========================= */
    static async getTicketById(id) {
        return prisma_1.default.supportTicket.findUnique({
            where: { id },
            include: {
                user: true
            }
        });
    }
    /* =========================
        GET BY TICKET NUMBER
    ========================= */
    static async getByTicketNumber(ticketNumber) {
        return prisma_1.default.supportTicket.findUnique({
            where: {
                ticketNumber
            },
            include: {
                user: true
            }
        });
    }
    /* =========================
        USER TICKETS
    ========================= */
    static async getUserTickets(userId) {
        return prisma_1.default.supportTicket.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    }
    /* =========================
        ASSIGN TICKET
    ========================= */
    static async assignTicket(ticketId, assignedTo) {
        return prisma_1.default.supportTicket.update({
            where: {
                id: ticketId
            },
            data: {
                assignedTo,
                status: "ASSIGNED"
            }
        });
    }
    /* =========================
        IN PROGRESS
    ========================= */
    static async markInProgress(ticketId) {
        return prisma_1.default.supportTicket.update({
            where: {
                id: ticketId
            },
            data: {
                status: "IN_PROGRESS"
            }
        });
    }
    /* =========================
        RESOLVE TICKET
    ========================= */
    static async resolveTicket(ticketId, resolution) {
        return prisma_1.default.supportTicket.update({
            where: {
                id: ticketId
            },
            data: {
                status: "RESOLVED",
                adminReply: resolution,
                resolvedAt: new Date()
            }
        });
    }
    /* =========================
        CLOSE TICKET
    ========================= */
    static async closeTicket(ticketId) {
        return prisma_1.default.supportTicket.update({
            where: {
                id: ticketId
            },
            data: {
                status: "CLOSED"
            }
        });
    }
    /* =========================
        REOPEN TICKET
    ========================= */
    static async reopenTicket(ticketId) {
        return prisma_1.default.supportTicket.update({
            where: {
                id: ticketId
            },
            data: {
                status: "OPEN",
                resolvedAt: null
            }
        });
    }
    /* =========================
        UPDATE PRIORITY
    ========================= */
    static async updatePriority(ticketId, priority) {
        return prisma_1.default.supportTicket.update({
            where: {
                id: ticketId
            },
            data: {
                priority
            }
        });
    }
    /* =========================
        SEARCH TICKETS
    ========================= */
    static async searchTickets(keyword) {
        return prisma_1.default.supportTicket.findMany({
            where: {
                OR: [
                    {
                        subject: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    },
                    {
                        description: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    },
                    {
                        message: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    }
                ]
            },
            include: {
                user: true
            }
        });
    }
    /* =========================
        GET BY STATUS
    ========================= */
    static async getByStatus(status) {
        return prisma_1.default.supportTicket.findMany({
            where: {
                status
            },
            include: {
                user: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    }
    /* =========================
        GET BY PRIORITY
    ========================= */
    static async getByPriority(priority) {
        return prisma_1.default.supportTicket.findMany({
            where: {
                priority
            },
            include: {
                user: true
            }
        });
    }
    /* =========================
        ALL TICKETS
    ========================= */
    static async getAllTickets(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [tickets, total] = await Promise.all([
            prisma_1.default.supportTicket.findMany({
                skip,
                take: limit,
                include: {
                    user: true
                },
                orderBy: {
                    createdAt: "desc"
                }
            }),
            prisma_1.default.supportTicket.count()
        ]);
        return {
            tickets,
            total,
            page,
            limit
        };
    }
    /* =========================
        SUPPORT ANALYTICS
    ========================= */
    static async getAnalytics() {
        const [totalTickets, openTickets, resolvedTickets, closedTickets, highPriority] = await Promise.all([
            prisma_1.default.supportTicket.count(),
            prisma_1.default.supportTicket.count({
                where: {
                    status: "OPEN"
                }
            }),
            prisma_1.default.supportTicket.count({
                where: {
                    status: "RESOLVED"
                }
            }),
            prisma_1.default.supportTicket.count({
                where: {
                    status: "CLOSED"
                }
            }),
            prisma_1.default.supportTicket.count({
                where: {
                    priority: "HIGH"
                }
            })
        ]);
        return {
            totalTickets,
            openTickets,
            resolvedTickets,
            closedTickets,
            highPriority
        };
    }
    /* =========================
        SUPPORT DASHBOARD
    ========================= */
    static async getDashboard() {
        const [analytics, recentTickets] = await Promise.all([
            this.getAnalytics(),
            prisma_1.default.supportTicket.findMany({
                take: 10,
                include: {
                    user: true
                },
                orderBy: {
                    createdAt: "desc"
                }
            })
        ]);
        return {
            analytics,
            recentTickets
        };
    }
}
exports.SupportRepository = SupportRepository;
