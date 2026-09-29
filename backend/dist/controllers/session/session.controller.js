"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSessionSummary = exports.deleteSession = exports.cleanupExpiredSessions = exports.sessionAnalytics = exports.getSessionById = exports.logoutAllUserSessions = exports.forceLogoutSession = exports.getUserSessions = exports.getAllSessions = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
/* ==========================================================
   GET ALL SESSIONS
   Features:
   - Pagination
   - Search
   - Active/Inactive Filter
   - Date Range Filter
   - User Include
========================================================== */
const getAllSessions = async (req, res) => {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
        const skip = (page - 1) * limit;
        const search = String(req.query.search || "").trim();
        const isActive = req.query.isActive !== undefined
            ? req.query.isActive === "true"
            : undefined;
        const from = req.query.from
            ? new Date(String(req.query.from))
            : undefined;
        const to = req.query.to
            ? new Date(String(req.query.to))
            : undefined;
        const where = {};
        if (typeof isActive === "boolean") {
            where.isActive = isActive;
        }
        if (search) {
            where.OR = [
                {
                    token: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    ipAddress: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    userAgent: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    user: {
                        OR: [
                            {
                                name: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            },
                            {
                                email: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            },
                            {
                                phoneNo: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            },
                        ],
                    },
                },
            ];
        }
        if (from || to) {
            where.loginAt = {};
            if (from) {
                where.loginAt.gte = from;
            }
            if (to) {
                where.loginAt.lte = to;
            }
        }
        const [sessions, total] = await Promise.all([
            prisma_1.default.session.findMany({
                where,
                skip,
                take: limit,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phoneNo: true,
                            role: true,
                        },
                    },
                },
                orderBy: {
                    loginAt: "desc",
                },
            }),
            prisma_1.default.session.count({
                where,
            }),
        ]);
        res.status(200).json({
            success: true,
            message: "Sessions fetched successfully",
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNext: page * limit < total,
                hasPrevious: page > 1,
            },
            data: sessions,
        });
    }
    catch (error) {
        console.error("Get Sessions Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch sessions",
            error: process.env.NODE_ENV === "development"
                ? error.message
                : undefined,
        });
    }
};
exports.getAllSessions = getAllSessions;
/* ==========================================================
   GET USER SESSIONS
========================================================== */
const getUserSessions = async (req, res) => {
    try {
        const { userId } = req.params;
        const sessions = await prisma_1.default.session.findMany({
            where: {
                userId: String(userId),
            },
            orderBy: {
                loginAt: "desc",
            },
        });
        res.status(200).json({
            success: true,
            count: sessions.length,
            data: sessions,
        });
    }
    catch (error) {
        console.error("User Sessions Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user sessions",
            error: process.env.NODE_ENV === "development"
                ? error.message
                : undefined,
        });
    }
};
exports.getUserSessions = getUserSessions;
/* ==========================================================
   FORCE LOGOUT SINGLE SESSION
========================================================== */
const forceLogoutSession = async (req, res) => {
    try {
        const { id } = req.params;
        const existingSession = await prisma_1.default.session.findUnique({
            where: {
                id: String(id),
            },
        });
        if (!existingSession) {
            res.status(404).json({
                success: false,
                message: "Session not found",
            });
            return;
        }
        if (!existingSession.isActive) {
            res.status(400).json({
                success: false,
                message: "Session is already logged out",
            });
            return;
        }
        const session = await prisma_1.default.session.update({
            where: {
                id: String(id),
            },
            data: {
                isActive: false,
                logoutAt: new Date(),
            },
        });
        res.status(200).json({
            success: true,
            message: "Session terminated successfully",
            data: session,
        });
    }
    catch (error) {
        console.error("Force Logout Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to terminate session",
            error: process.env.NODE_ENV === "development"
                ? error.message
                : undefined,
        });
    }
};
exports.forceLogoutSession = forceLogoutSession;
/* ==========================================================
   FORCE LOGOUT ALL USER SESSIONS
========================================================== */
const logoutAllUserSessions = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await prisma_1.default.user.findUnique({
            where: {
                id: String(userId),
            },
            select: {
                id: true,
            },
        });
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        const result = await prisma_1.default.session.updateMany({
            where: {
                userId: String(userId),
                isActive: true,
            },
            data: {
                isActive: false,
                logoutAt: new Date(),
            },
        });
        res.status(200).json({
            success: true,
            message: "All active sessions terminated successfully",
            affectedSessions: result.count,
        });
    }
    catch (error) {
        console.error("Logout All Sessions Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to terminate user sessions",
            error: process.env.NODE_ENV === "development"
                ? error.message
                : undefined,
        });
    }
};
exports.logoutAllUserSessions = logoutAllUserSessions;
/* ==========================================================
   GET SESSION BY ID
========================================================== */
const getSessionById = async (req, res) => {
    try {
        const { id } = req.params;
        const session = await prisma_1.default.session.findUnique({
            where: {
                id: String(id),
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phoneNo: true,
                        role: true,
                    },
                },
            },
        });
        if (!session) {
            res.status(404).json({
                success: false,
                message: "Session not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: session,
        });
    }
    catch (error) {
        console.error("Get Session Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch session",
            error: process.env.NODE_ENV === "development"
                ? error.message
                : undefined,
        });
    }
};
exports.getSessionById = getSessionById;
/* ==========================================================
   SESSION ANALYTICS
========================================================== */
const sessionAnalytics = async (req, res) => {
    try {
        const now = new Date();
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        const [totalSessions, activeSessions, inactiveSessions, expiredSessions, todayLogins, weeklyLogins, latestSessions,] = await Promise.all([
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
            prisma_1.default.session.count({
                where: {
                    loginAt: {
                        gte: todayStart,
                    },
                },
            }),
            prisma_1.default.session.count({
                where: {
                    loginAt: {
                        gte: sevenDaysAgo,
                    },
                },
            }),
            prisma_1.default.session.findMany({
                take: 10,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phoneNo: true,
                        },
                    },
                },
                orderBy: {
                    loginAt: "desc",
                },
            }),
        ]);
        res.status(200).json({
            success: true,
            data: {
                totalSessions,
                activeSessions,
                inactiveSessions,
                expiredSessions,
                todayLogins,
                weeklyLogins,
                latestSessions,
            },
        });
    }
    catch (error) {
        console.error("Session Analytics Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch session analytics",
            error: process.env.NODE_ENV === "development"
                ? error.message
                : undefined,
        });
    }
};
exports.sessionAnalytics = sessionAnalytics;
/* ==========================================================
   DELETE EXPIRED SESSIONS
========================================================== */
const cleanupExpiredSessions = async (req, res) => {
    try {
        const result = await prisma_1.default.session.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date(),
                },
            },
        });
        res.status(200).json({
            success: true,
            message: "Expired sessions deleted successfully",
            deleted: result.count,
        });
    }
    catch (error) {
        console.error("Cleanup Sessions Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to cleanup expired sessions",
            error: process.env.NODE_ENV === "development"
                ? error.message
                : undefined,
        });
    }
};
exports.cleanupExpiredSessions = cleanupExpiredSessions;
/* ==========================================================
   DELETE SESSION
========================================================== */
const deleteSession = async (req, res) => {
    try {
        const { id } = req.params;
        const session = await prisma_1.default.session.findUnique({
            where: {
                id: String(id),
            },
        });
        if (!session) {
            res.status(404).json({
                success: false,
                message: "Session not found",
            });
            return;
        }
        await prisma_1.default.session.delete({
            where: {
                id: String(id),
            },
        });
        res.status(200).json({
            success: true,
            message: "Session deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete Session Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete session",
            error: process.env.NODE_ENV === "development"
                ? error.message
                : undefined,
        });
    }
};
exports.deleteSession = deleteSession;
/* ==========================================================
   USER SESSION SUMMARY
========================================================== */
const userSessionSummary = async (req, res) => {
    try {
        const { userId } = req.params;
        const [total, active, expired, latest,] = await Promise.all([
            prisma_1.default.session.count({
                where: {
                    userId: String(userId),
                },
            }),
            prisma_1.default.session.count({
                where: {
                    userId: String(userId),
                    isActive: true,
                },
            }),
            prisma_1.default.session.count({
                where: {
                    userId: String(userId),
                    expiresAt: {
                        lt: new Date(),
                    },
                },
            }),
            prisma_1.default.session.findFirst({
                where: {
                    userId: String(userId),
                },
                orderBy: {
                    loginAt: "desc",
                },
            }),
        ]);
        res.status(200).json({
            success: true,
            data: {
                totalSessions: total,
                activeSessions: active,
                expiredSessions: expired,
                latestSession: latest,
            },
        });
    }
    catch (error) {
        console.error("User Session Summary Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch session summary",
            error: process.env.NODE_ENV === "development"
                ? error.message
                : undefined,
        });
    }
};
exports.userSessionSummary = userSessionSummary;
