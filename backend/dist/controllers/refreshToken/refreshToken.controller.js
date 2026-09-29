"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenAnalytics = exports.getActiveSessions = exports.revokeAllTokens = exports.revokeRefreshToken = exports.refreshAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../../prisma/prisma"));
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
/**
 * GENERATE NEW ACCESS TOKEN
 */
const refreshAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(400).json({
                success: false,
                message: "Refresh token required",
            });
            return;
        }
        const tokenRecord = await prisma_1.default.refreshToken.findUnique({
            where: {
                token: refreshToken,
            },
            include: {
                user: true,
            },
        });
        if (!tokenRecord ||
            tokenRecord.isRevoked) {
            res.status(401).json({
                success: false,
                message: "Invalid refresh token",
            });
            return;
        }
        if (new Date() >
            tokenRecord.expiresAt) {
            res.status(401).json({
                success: false,
                message: "Refresh token expired",
            });
            return;
        }
        const payload = jsonwebtoken_1.default.verify(refreshToken, REFRESH_SECRET);
        const accessToken = jsonwebtoken_1.default.sign({
            userId: payload.userId,
            role: payload.role,
        }, ACCESS_SECRET, {
            expiresIn: "15m",
        });
        res.status(200).json({
            success: true,
            accessToken,
        });
    }
    catch {
        res.status(401).json({
            success: false,
            message: "Token refresh failed",
        });
    }
};
exports.refreshAccessToken = refreshAccessToken;
/**
 * LOGOUT CURRENT DEVICE
 */
const revokeRefreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        await prisma_1.default.refreshToken.update({
            where: {
                token: refreshToken,
            },
            data: {
                isRevoked: true,
            },
        });
        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Logout failed",
        });
    }
};
exports.revokeRefreshToken = revokeRefreshToken;
/**
 * LOGOUT ALL DEVICES
 */
const revokeAllTokens = async (req, res) => {
    try {
        const userId = req.user?.id;
        await prisma_1.default.refreshToken.updateMany({
            where: {
                userId,
            },
            data: {
                isRevoked: true,
            },
        });
        res.status(200).json({
            success: true,
            message: "All sessions terminated",
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Operation failed",
        });
    }
};
exports.revokeAllTokens = revokeAllTokens;
/**
 * GET ACTIVE SESSIONS
 */
const getActiveSessions = async (req, res) => {
    try {
        const userId = req.user?.id;
        const sessions = await prisma_1.default.refreshToken.findMany({
            where: {
                userId,
                isRevoked: false,
            },
            orderBy: {
                createdAt: "desc",
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
            message: "Failed to fetch sessions",
        });
    }
};
exports.getActiveSessions = getActiveSessions;
/**
 * TOKEN ANALYTICS
 */
const refreshTokenAnalytics = async (req, res) => {
    try {
        const [totalTokens, activeTokens, revokedTokens,] = await Promise.all([
            prisma_1.default.refreshToken.count(),
            prisma_1.default.refreshToken.count({
                where: {
                    isRevoked: false,
                },
            }),
            prisma_1.default.refreshToken.count({
                where: {
                    isRevoked: true,
                },
            }),
        ]);
        res.status(200).json({
            success: true,
            data: {
                totalTokens,
                activeTokens,
                revokedTokens,
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
exports.refreshTokenAnalytics = refreshTokenAnalytics;
