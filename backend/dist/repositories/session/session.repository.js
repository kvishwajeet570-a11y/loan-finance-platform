"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionRepository = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class SessionRepository {
    /* ==========================================================
       CREATE SESSION
    ========================================================== */
    static async create(data) {
        return prisma_1.default.session.create({
            data: {
                token: data.token,
                ipAddress: data.ipAddress,
                userAgent: data.userAgent,
                isActive: data.isActive ?? true,
                expiresAt: data.expiresAt,
                user: {
                    connect: {
                        id: data.userId,
                    },
                },
            },
            include: {
                user: true,
            },
        });
    }
    /* ==========================================================
       GET SESSION BY ID
    ========================================================== */
    static async getById(id) {
        return prisma_1.default.session.findUnique({
            where: { id },
            include: {
                user: true,
            },
        });
    }
    /* ==========================================================
       GET SESSION BY TOKEN
    ========================================================== */
    static async getByToken(token) {
        return prisma_1.default.session.findUnique({
            where: { token },
            include: {
                user: true,
            },
        });
    }
    /* ==========================================================
       GET ACTIVE SESSIONS
    ========================================================== */
    static async getActiveSessions() {
        return prisma_1.default.session.findMany({
            where: {
                isActive: true,
            },
            include: {
                user: true,
            },
            orderBy: {
                loginAt: "desc",
            },
        });
    }
    /* ==========================================================
       GET USER SESSIONS
    ========================================================== */
    static async getUserSessions(userId) {
        return prisma_1.default.session.findMany({
            where: {
                userId,
            },
            include: {
                user: true,
            },
            orderBy: {
                loginAt: "desc",
            },
        });
    }
    /* ==========================================================
       UPDATE SESSION
    ========================================================== */
    static async update(id, data) {
        return prisma_1.default.session.update({
            where: {
                id,
            },
            data,
        });
    }
    /* ==========================================================
       FORCE LOGOUT SESSION
    ========================================================== */
    static async forceLogoutSession(id) {
        return prisma_1.default.session.update({
            where: {
                id,
            },
            data: {
                isActive: false,
                logoutAt: new Date(),
            },
        });
    }
    /* ==========================================================
       LOGOUT ALL USER SESSIONS
    ========================================================== */
    static async logoutAllUserSessions(userId) {
        return prisma_1.default.session.updateMany({
            where: {
                userId,
                isActive: true,
            },
            data: {
                isActive: false,
                logoutAt: new Date(),
            },
        });
    }
    /* ==========================================================
       DELETE SESSION
    ========================================================== */
    static async delete(id) {
        return prisma_1.default.session.delete({
            where: {
                id,
            },
        });
    }
    /* ==========================================================
       CLEANUP EXPIRED SESSIONS
    ========================================================== */
    static async cleanupExpiredSessions() {
        return prisma_1.default.session.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date(),
                },
            },
        });
    }
    /* ==========================================================
       SESSION ANALYTICS
    ========================================================== */
    static async getAnalytics() {
        const now = new Date();
        const [totalSessions, activeSessions, inactiveSessions, expiredSessions,] = await Promise.all([
            prisma_1.default.session.count(),
            prisma_1.default.session.count({
                where: {
                    isActive: true,
                },
            }),
            prisma_1.default.session.count({
                where: {
                    isActive: false,
                },
            }),
            prisma_1.default.session.count({
                where: {
                    expiresAt: {
                        lt: now,
                    },
                },
            }),
        ]);
        return {
            totalSessions,
            activeSessions,
            inactiveSessions,
            expiredSessions,
        };
    }
    /* ==========================================================
       RECENT SESSIONS
    ========================================================== */
    static async getRecent(limit = 10) {
        return prisma_1.default.session.findMany({
            take: limit,
            include: {
                user: true,
            },
            orderBy: {
                loginAt: "desc",
            },
        });
    }
    /* ==========================================================
       SEARCH SESSIONS
    ========================================================== */
    static async search(keyword) {
        return prisma_1.default.session.findMany({
            where: {
                OR: [
                    {
                        token: {
                            contains: keyword,
                            mode: "insensitive",
                        },
                    },
                    {
                        ipAddress: {
                            contains: keyword,
                            mode: "insensitive",
                        },
                    },
                    {
                        userAgent: {
                            contains: keyword,
                            mode: "insensitive",
                        },
                    },
                    {
                        user: {
                            OR: [
                                {
                                    name: {
                                        contains: keyword,
                                        mode: "insensitive",
                                    },
                                },
                                {
                                    email: {
                                        contains: keyword,
                                        mode: "insensitive",
                                    },
                                },
                                {
                                    phoneNo: {
                                        contains: keyword,
                                        mode: "insensitive",
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
            include: {
                user: true,
            },
            orderBy: {
                loginAt: "desc",
            },
        });
    }
}
exports.SessionRepository = SessionRepository;
exports.default = SessionRepository;
