"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.superAdminAnalytics = exports.toggleMaintenance = exports.unblockUser = exports.blockUser = exports.systemOverview = exports.getDashboard = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
/**
 * DASHBOARD
 */
const getDashboard = async (req, res) => {
    try {
        const [users, loans, pendingLoans, approvedLoans, totalRevenue,] = await Promise.all([
            prisma_1.default.user.count(),
            prisma_1.default.loanApplication.count(),
            prisma_1.default.loanApplication.count({
                where: {
                    status: "PENDING",
                },
            }),
            prisma_1.default.loanApplication.count({
                where: {
                    status: "APPROVED",
                },
            }),
            prisma_1.default.payment.aggregate({
                _sum: {
                    amount: true,
                },
            }),
        ]);
        res.status(200).json({
            success: true,
            data: {
                users,
                loans,
                pendingLoans,
                approvedLoans,
                revenue: totalRevenue._sum.amount || 0,
            },
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Dashboard failed",
        });
    }
};
exports.getDashboard = getDashboard;
/**
 * SYSTEM OVERVIEW
 */
const systemOverview = async (req, res) => {
    try {
        const [activeUsers, blockedUsers, totalDSA, totalPartners,] = await Promise.all([
            prisma_1.default.user.count({
                where: {
                    isBlocked: false,
                },
            }),
            prisma_1.default.user.count({
                where: {
                    isBlocked: true,
                },
            }),
            prisma_1.default.dSA.count(),
            prisma_1.default.partner.count(),
        ]);
        res.status(200).json({
            success: true,
            data: {
                activeUsers,
                blockedUsers,
                totalDSA,
                totalPartners,
            },
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed",
        });
    }
};
exports.systemOverview = systemOverview;
/**
 * BLOCK USER
 */
const blockUser = async (req, res) => {
    try {
        const user = await prisma_1.default.user.update({
            where: {
                id: req.params.id,
            },
            data: {
                isBlocked: true,
            },
        });
        res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch {
        res.status(500).json({
            success: false,
        });
    }
};
exports.blockUser = blockUser;
/**
 * UNBLOCK USER
 */
const unblockUser = async (req, res) => {
    try {
        const user = await prisma_1.default.user.update({
            where: {
                id: req.params.id,
            },
            data: {
                isBlocked: false,
            },
        });
        res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch {
        res.status(500).json({
            success: false,
        });
    }
};
exports.unblockUser = unblockUser;
/**
 * TOGGLE MAINTENANCE MODE
 */
const toggleMaintenance = async (req, res) => {
    try {
        const setting = await prisma_1.default.setting.findUnique({
            where: {
                key: "maintenance_mode",
            },
        });
        const updated = await prisma_1.default.setting.update({
            where: {
                key: "maintenance_mode",
            },
            data: {
                value: !setting?.value,
            },
        });
        res.status(200).json({
            success: true,
            data: updated,
        });
    }
    catch {
        res.status(500).json({
            success: false,
        });
    }
};
exports.toggleMaintenance = toggleMaintenance;
/**
 * SUPER ADMIN ANALYTICS
 */
const superAdminAnalytics = async (req, res) => {
    try {
        const [totalUsers, totalLoans, totalPayments, totalSessions,] = await Promise.all([
            prisma_1.default.user.count(),
            prisma_1.default.loanApplication.count(),
            prisma_1.default.payment.count(),
            prisma_1.default.session.count(),
        ]);
        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalLoans,
                totalPayments,
                totalSessions,
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
exports.superAdminAnalytics = superAdminAnalytics;
