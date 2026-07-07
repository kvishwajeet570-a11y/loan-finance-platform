"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityAnalytics = exports.cleanupSecurityLogs = exports.createSecurityLog = exports.getUserSecurityLogs = exports.getAllSecurityLogs = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
/**
 * GET ALL SECURITY LOGS
 */
const getAllSecurityLogs = async (req, res) => {
    try {
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 20);
        const severity = req.query.severity;
        const skip = (page - 1) * limit;
        const where = severity
            ? { severity }
            : {};
        const [logs, total] = await Promise.all([
            prisma_1.default.securityLog.findMany({
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
            prisma_1.default.securityLog.count({ where }),
        ]);
        res.status(200).json({
            success: true,
            total,
            page,
            data: logs,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch security logs",
        });
    }
};
exports.getAllSecurityLogs = getAllSecurityLogs;
/**
 * GET USER SECURITY LOGS
 */
const getUserSecurityLogs = async (req, res) => {
    try {
        const logs = await prisma_1.default.securityLog.findMany({
            where: {
                userId: req.params.userId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.status(200).json({
            success: true,
            data: logs,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed",
        });
    }
};
exports.getUserSecurityLogs = getUserSecurityLogs;
/**
 * CREATE SECURITY EVENT
 */
const createSecurityLog = async (req, res) => {
    try {
        const log = await prisma_1.default.securityLog.create({
            data: {
                userId: req.body.userId,
                action: req.body.action,
                severity: req.body.severity,
                module: req.body.module,
                description: req.body.description,
                ipAddress: req.ip,
                userAgent: req.headers["user-agent"],
                status: req.body.status,
                metadata: req.body.metadata,
            },
        });
        res.status(201).json({
            success: true,
            data: log,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to create log",
        });
    }
};
exports.createSecurityLog = createSecurityLog;
/**
 * DELETE OLD LOGS
 */
const cleanupSecurityLogs = async (req, res) => {
    try {
        const days = Number(req.query.days) || 90;
        const date = new Date();
        date.setDate(date.getDate() - days);
        const deleted = await prisma_1.default.securityLog.deleteMany({
            where: {
                createdAt: {
                    lt: date,
                },
            },
        });
        res.status(200).json({
            success: true,
            deleted: deleted.count,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Cleanup failed",
        });
    }
};
exports.cleanupSecurityLogs = cleanupSecurityLogs;
/**
 * SECURITY ANALYTICS
 */
const securityAnalytics = async (req, res) => {
    try {
        const [totalLogs, criticalLogs, failedEvents,] = await Promise.all([
            prisma_1.default.securityLog.count(),
            prisma_1.default.securityLog.count({
                where: {
                    severity: "CRITICAL",
                },
            }),
            prisma_1.default.securityLog.count({
                where: {
                    status: "FAILED",
                },
            }),
        ]);
        res.status(200).json({
            success: true,
            data: {
                totalLogs,
                criticalLogs,
                failedEvents,
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
exports.securityAnalytics = securityAnalytics;
