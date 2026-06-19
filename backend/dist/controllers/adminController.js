"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAnalytics = exports.deleteUser = exports.unblockUser = exports.blockUser = exports.getSingleUser = exports.getUsers = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma"));
/* ========================================
   GET ALL USERS
======================================== */
const getUsers = async (req, res) => {
    try {
        const users = await prisma_1.default.user.findMany({
            include: {
                wallet: true,
                referral: true,
                loans: true,
                recharges: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return res.status(200).json({
            success: true,
            totalUsers: users.length,
            users,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch users",
        });
    }
};
exports.getUsers = getUsers;
/* ========================================
   GET SINGLE USER
======================================== */
const getSingleUser = async (req, res) => {
    try {
        /* USER ID */
        const id = req.params.id;
        /* VALIDATION */
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }
        /* FIND USER */
        const user = await prisma_1.default.user.findUnique({
            where: {
                id,
            },
            include: {
                wallet: {
                    include: {
                        transactions: true,
                        walletHistory: true,
                    },
                },
                loans: true,
                referral: {
                    include: {
                        referralHistory: true,
                    },
                },
                recharges: true,
                fastagRecharges: true,
                electricityBills: true,
                supportTickets: true,
                activities: true,
                securityLogs: true,
            },
        });
        /* USER NOT FOUND */
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        /* RESPONSE */
        return res.status(200).json({
            success: true,
            user,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user",
        });
    }
};
exports.getSingleUser = getSingleUser;
/* ========================================
   BLOCK USER
======================================== */
const blockUser = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }
        const user = await prisma_1.default.user.update({
            where: {
                id: userId,
            },
            data: {
                isBlocked: true,
            },
        });
        /* NOTIFICATION */
        await prisma_1.default.notification.create({
            data: {
                userId,
                title: "Account Blocked",
                message: "Your account has been blocked by admin.",
                type: "security",
            },
        });
        return res.status(200).json({
            success: true,
            message: "User blocked successfully",
            user,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to block user",
        });
    }
};
exports.blockUser = blockUser;
/* ========================================
   UNBLOCK USER
======================================== */
const unblockUser = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }
        const user = await prisma_1.default.user.update({
            where: {
                id: userId,
            },
            data: {
                isBlocked: false,
            },
        });
        /* NOTIFICATION */
        await prisma_1.default.notification.create({
            data: {
                userId,
                title: "Account Activated",
                message: "Your account has been activated again.",
                type: "general",
            },
        });
        return res.status(200).json({
            success: true,
            message: "User unblocked successfully",
            user,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to unblock user",
        });
    }
};
exports.unblockUser = unblockUser;
/* ========================================
   DELETE USER
======================================== */
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }
        await prisma_1.default.user.delete({
            where: {
                id: userId,
            },
        });
        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete user",
        });
    }
};
exports.deleteUser = deleteUser;
/* ========================================
   ADMIN ANALYTICS
======================================== */
const adminAnalytics = async (req, res) => {
    try {
        const totalUsers = await prisma_1.default.user.count();
        const totalLoans = await prisma_1.default.loanApplication.count();
        const totalRecharges = await prisma_1.default.recharge.count();
        const totalTransactions = await prisma_1.default.transaction.count();
        const totalRevenue = await prisma_1.default.transaction.aggregate({
            _sum: {
                amount: true,
            },
        });
        const recentUsers = await prisma_1.default.user.findMany({
            take: 5,
            orderBy: {
                createdAt: "desc",
            },
        });
        return res.status(200).json({
            success: true,
            analytics: {
                totalUsers,
                totalLoans,
                totalRecharges,
                totalTransactions,
                totalRevenue: totalRevenue._sum.amount || 0,
            },
            recentUsers,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch analytics",
        });
    }
};
exports.adminAnalytics = adminAnalytics;
