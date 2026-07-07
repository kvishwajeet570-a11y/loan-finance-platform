"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserStats = exports.deleteProfile = exports.updateProfile = exports.getUserProfile = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma"));
/* ========================================
   GET USER PROFILE
======================================== */
const getUserProfile = async (req, res) => {
    try {
        const userId = req.params.userId;
        /* ========================================
           VALIDATION
        ======================================== */
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }
        /* ========================================
           FETCH USER
        ======================================== */
        const user = await prisma_1.default.user.findUnique({
            where: {
                id: userId,
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
                notifications: true,
                supportTickets: true,
                activities: true,
            },
        });
        /* ========================================
           CHECK USER
        ======================================== */
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        /* ========================================
           RESPONSE
        ======================================== */
        return res.status(200).json({
            success: true,
            user,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch profile",
        });
    }
};
exports.getUserProfile = getUserProfile;
/* ========================================
   UPDATE PROFILE
======================================== */
const updateProfile = async (req, res) => {
    try {
        const { userId, name, email, phoneNo, profileImage, } = req.body;
        /* ========================================
           VALIDATION
        ======================================== */
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }
        /* ========================================
           CHECK USER
        ======================================== */
        const existingUser = await prisma_1.default.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        /* ========================================
           UPDATE USER
        ======================================== */
        const updatedUser = await prisma_1.default.user.update({
            where: {
                id: userId,
            },
            data: {
                name,
                email,
                phoneNo,
                profileImage,
            },
        });
        /* ========================================
           CREATE NOTIFICATION
        ======================================== */
        await prisma_1.default.notification.create({
            data: {
                userId,
                title: "Profile Updated",
                message: "Your profile has been updated successfully.",
                type: "profile",
            },
        });
        /* ========================================
           RESPONSE
        ======================================== */
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update profile",
        });
    }
};
exports.updateProfile = updateProfile;
/* ========================================
   DELETE PROFILE
======================================== */
const deleteProfile = async (req, res) => {
    try {
        const userId = req.params.userId;
        /* ========================================
           VALIDATION
        ======================================== */
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }
        /* ========================================
           CHECK USER
        ======================================== */
        const user = await prisma_1.default.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        /* ========================================
           DELETE USER
        ======================================== */
        await prisma_1.default.user.delete({
            where: {
                id: userId,
            },
        });
        /* ========================================
           RESPONSE
        ======================================== */
        return res.status(200).json({
            success: true,
            message: "Profile deleted successfully",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete profile",
        });
    }
};
exports.deleteProfile = deleteProfile;
/* ========================================
   GET USER STATS
======================================== */
const getUserStats = async (req, res) => {
    try {
        const userId = req.params.userId;
        const totalLoans = await prisma_1.default.loanApplication.count({
            where: {
                userId,
            },
        });
        const totalRecharges = await prisma_1.default.recharge.count({
            where: {
                userId,
            },
        });
        const totalTransactions = await prisma_1.default.transaction.count({
            where: {
                wallet: {
                    userId,
                },
            },
        });
        const wallet = await prisma_1.default.wallet.findUnique({
            where: {
                userId,
            },
        });
        return res.status(200).json({
            success: true,
            stats: {
                totalLoans,
                totalRecharges,
                totalTransactions,
                walletBalance: wallet?.balance || 0,
            },
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user stats",
        });
    }
};
exports.getUserStats = getUserStats;
