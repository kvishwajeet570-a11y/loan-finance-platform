"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginAnalytics = exports.logoutSession = exports.getUserLoginHistory = exports.getAllLoginHistory = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
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
                        },
                    },
                },
            }),
            prisma_1.default.loginHistory.count(),
        ]);
        res.status(200).json({
            success: true,
            total,
            page,
            records,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch login history",
        });
    }
};
exports.getAllLoginHistory = getAllLoginHistory;
const getUserLoginHistory = async (req, res) => {
    try {
        const userId = req.params.userId;
        const history = await prisma_1.default.loginHistory.findMany({
            where: { userId },
            orderBy: {
                loginTime: "desc",
            },
        });
        res.status(200).json({
            success: true,
            data: history,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "History fetch failed",
        });
    }
};
exports.getUserLoginHistory = getUserLoginHistory;
const logoutSession = async (req, res) => {
    try {
        const sessionId = req.params.id;
        const session = await prisma_1.default.loginHistory.update({
            where: { id: sessionId },
            data: {
                logoutTime: new Date(),
            },
        });
        res.status(200).json({
            success: true,
            message: "Session closed",
            data: session,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Logout failed",
        });
    }
};
exports.logoutSession = logoutSession;
const loginAnalytics = async (req, res) => {
    try {
        const totalLogins = await prisma_1.default.loginHistory.count();
        const failedLogins = await prisma_1.default.loginHistory.count({
            where: {
                status: "FAILED",
            },
        });
        const successLogins = await prisma_1.default.loginHistory.count({
            where: {
                status: "SUCCESS",
            },
        });
        res.status(200).json({
            success: true,
            data: {
                totalLogins,
                successLogins,
                failedLogins,
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
exports.loginAnalytics = loginAnalytics;
