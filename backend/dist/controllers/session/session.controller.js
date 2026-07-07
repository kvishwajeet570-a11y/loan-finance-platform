"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupExpiredSessions = exports.sessionAnalytics = exports.logoutAllUserSessions = exports.forceLogoutSession = exports.getUserSessions = exports.getActiveSessions = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
/**
 * GET ACTIVE SESSIONS
 */
const getActiveSessions = async (req, res) => {
    try {
        const sessions = await prisma_1.default.session.findMany({
            where: {
                isActive: true,
            },
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
        });
        res.status(200).json({
            success: true,
            count: sessions.length,
            data: sessions,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch sessions",
        });
    }
};
exports.getActiveSessions = getActiveSessions;
/**
 * GET USER SESSIONS
 */
const getUserSessions = async (req, res) => {
    try {
        const sessions = await prisma_1.default.session.findMany({
            where: {
                userId: req.params.userId,
            },
            orderBy: {
                loginAt: "desc",
            },
        });
        res.status(200).json({
            success: true,
            data: sessions,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed",
        });
    }
};
exports.getUserSessions = getUserSessions;
/**
 * FORCE LOGOUT SESSION
 */
const forceLogoutSession = async (req, res) => {
    try {
        const session = await prisma_1.default.session.update({
            where: {
                id: req.params.id,
            },
            data: {
                isActive: false,
                logoutAt: new Date(),
            },
        });
        res.status(200).json({
            success: true,
            message: "Session terminated",
            data: session,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed",
        });
    }
};
exports.forceLogoutSession = forceLogoutSession;
/**
 * FORCE LOGOUT ALL USER SESSIONS
 */
const logoutAllUserSessions = async (req, res) => {
    try {
        const userId = req.params.userId;
        const result = await prisma_1.default.session.updateMany({
            where: {
                userId,
                isActive: true,
            },
            data: {
                isActive: false,
                logoutAt: new Date(),
            },
        });
        res.status(200).json({
            success: true,
            affected: result.count,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Operation failed",
        });
    }
};
exports.logoutAllUserSessions = logoutAllUserSessions;
/**
 * SESSION ANALYTICS
 */
const sessionAnalytics = async (req, res) => {
    try {
        const [totalSessions, activeSessions, inactiveSessions,] = await Promise.all([
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
        ]);
        res.status(200).json({
            success: true,
            data: {
                totalSessions,
                activeSessions,
                inactiveSessions,
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
exports.sessionAnalytics = sessionAnalytics;
/**
 * DELETE EXPIRED SESSIONS
 */
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
            deleted: result.count,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Cleanup failed",
        });
    }
};
exports.cleanupExpiredSessions = cleanupExpiredSessions;
