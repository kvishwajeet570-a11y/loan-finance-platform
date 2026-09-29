"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLoginHistory = exports.loginAnalytics = exports.getActiveSessions = exports.logoutSession = exports.getUserLoginHistory = exports.getAllLoginHistory = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
/* ==========================================
   GET ALL LOGIN HISTORY
========================================== */
const getAllLoginHistory = async (req, res) => {
    try {
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 20);
        const skip = (page - 1) * limit;
        const [records, total] = await Promise.all([
            prisma_1.default.loginHistory.findMany({
                skip,
                take: limit,
                orderBy: {
                    loginTime: "desc",
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
            }),
            prisma_1.default.loginHistory.count(),
        ]);
        res.status(200).json({
            success: true,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            records,
        });
    }
    catch (error) {
        console.error("GET LOGIN HISTORY ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch login history",
            error: error?.message,
        });
    }
};
exports.getAllLoginHistory = getAllLoginHistory;
/* ==========================================
   GET USER LOGIN HISTORY
========================================== */
const getUserLoginHistory = async (req, res) => {
    try {
        const userId = String(req.params.userId);
        const history = await prisma_1.default.loginHistory.findMany({
            where: {
                userId,
            },
            orderBy: {
                loginTime: "desc",
            },
        });
        res.status(200).json({
            success: true,
            count: history.length,
            data: history,
        });
    }
    catch (error) {
        console.error("USER LOGIN HISTORY ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user login history",
            error: error?.message,
        });
    }
};
exports.getUserLoginHistory = getUserLoginHistory;
/* ==========================================
   LOGOUT SESSION
========================================== */
const logoutSession = async (req, res) => {
    try {
        const id = String(req.params.id);
        const session = await prisma_1.default.loginHistory.update({
            where: {
                id,
            },
            data: {
                logoutTime: new Date(),
                isActive: false,
                status: "LOGOUT",
            },
        });
        res.status(200).json({
            success: true,
            message: "Session logged out successfully",
            data: session,
        });
    }
    catch (error) {
        console.error("LOGOUT SESSION ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Failed to logout session",
            error: error?.message,
        });
    }
};
exports.logoutSession = logoutSession;
/* ==========================================
   ACTIVE SESSIONS
========================================== */
const getActiveSessions = async (req, res) => {
    try {
        const sessions = await prisma_1.default.loginHistory.findMany({
            where: {
                isActive: true,
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
                loginTime: "desc",
            },
        });
        res.status(200).json({
            success: true,
            count: sessions.length,
            data: sessions,
        });
    }
    catch (error) {
        console.error("ACTIVE SESSION ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch active sessions",
            error: error?.message,
        });
    }
};
exports.getActiveSessions = getActiveSessions;
/* ==========================================
   LOGIN ANALYTICS
========================================== */
const loginAnalytics = async (req, res) => {
    try {
        const [totalLogins, successLogins, failedLogins, activeSessions,] = await Promise.all([
            prisma_1.default.loginHistory.count(),
            prisma_1.default.loginHistory.count({
                where: {
                    status: "SUCCESS",
                },
            }),
            prisma_1.default.loginHistory.count({
                where: {
                    status: "FAILED",
                },
            }),
            prisma_1.default.loginHistory.count({
                where: {
                    isActive: true,
                },
            }),
        ]);
        res.status(200).json({
            success: true,
            analytics: {
                totalLogins,
                successLogins,
                failedLogins,
                activeSessions,
                successRate: totalLogins > 0
                    ? Number(((successLogins / totalLogins) * 100).toFixed(2))
                    : 0,
            },
        });
    }
    catch (error) {
        console.error("LOGIN ANALYTICS ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch login analytics",
            error: error?.message,
        });
    }
};
exports.loginAnalytics = loginAnalytics;
/* ==========================================
   DELETE LOGIN HISTORY
========================================== */
const deleteLoginHistory = async (req, res) => {
    try {
        const id = String(req.params.id);
        await prisma_1.default.loginHistory.delete({
            where: {
                id,
            },
        });
        res.status(200).json({
            success: true,
            message: "Login history deleted successfully",
        });
    }
    catch (error) {
        console.error("DELETE LOGIN HISTORY ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete login history",
            error: error?.message,
        });
    }
};
exports.deleteLoginHistory = deleteLoginHistory;
