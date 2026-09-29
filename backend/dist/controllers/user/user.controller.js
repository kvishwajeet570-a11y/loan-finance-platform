"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkBlockUsers = exports.bulkVerifyUsers = exports.exportUsersPdf = exports.exportUsersExcel = exports.getUserAuditLogs = exports.getActivityLogs = exports.disableTwoFactorAuth = exports.enableTwoFactorAuth = exports.verifyPhone = exports.verifyEmail = exports.updatePhone = exports.updateEmail = exports.resetPassword = exports.changePassword = exports.getUserLeaderboardRank = exports.getUserAchievements = exports.getUserCommissions = exports.getUserReferrals = exports.getUserNotifications = exports.getUserWallet = exports.getUserKyc = exports.getUserDocuments = exports.getUserTransactions = exports.getUserLoans = exports.getRecentUsers = exports.getNewUsers = exports.getTopUsers = exports.searchUsers = exports.getActiveUsers = exports.getBlockedUsers = exports.getVerifiedUsers = exports.getPendingUsers = exports.getUserAnalytics = exports.getUserDashboard = exports.deactivateUser = exports.activateUser = exports.deleteUser = exports.getLoginHistory = exports.removeProfileImage = exports.uploadProfileImage = exports.updateProfile = exports.getUserProfile = exports.userAnalytics = exports.verifyUser = exports.unblockUser = exports.blockUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getAllUsers = void 0;
exports.bulkDeleteUsers = exports.bulkUnblockUsers = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const XLSX = __importStar(require("xlsx"));
const pdfkit_1 = __importDefault(require("pdfkit"));
/**
 * GET ALL USERS
 */
const getAllUsers = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const search = String(req.query.search || "");
        const users = await prisma_1.default.user.findMany({
            where: {
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
                        },
                    },
                ],
            },
            skip,
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                name: true,
                email: true,
                phoneNo: true,
                role: true,
                isVerified: true,
                isBlocked: true,
                createdAt: true,
            },
        });
        const total = await prisma_1.default.user.count();
        res.status(200).json({
            success: true,
            page,
            total,
            data: users,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error,
        });
    }
};
exports.getAllUsers = getAllUsers;
/**
 * GET USER BY ID
 */
const getUserById = async (req, res) => {
    try {
        const user = await prisma_1.default.user.findUnique({
            where: {
                id: req.params.id,
            },
            include: {
                loans: true,
            },
        });
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }
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
exports.getUserById = getUserById;
/**
 * CREATE USER
 */
const createUser = async (req, res) => {
    try {
        const { name, email, phoneNo, password, role, } = req.body;
        const exists = await prisma_1.default.user.findFirst({
            where: {
                OR: [
                    { email },
                    { phoneNo },
                ],
            },
        });
        if (exists) {
            res.status(400).json({
                success: false,
                message: "User already exists",
            });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma_1.default.user.create({
            data: {
                name,
                email,
                phoneNo,
                password: hashedPassword,
                role,
            },
        });
        res.status(201).json({
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
exports.createUser = createUser;
/**
 * UPDATE USER
 */
const updateUser = async (req, res) => {
    try {
        const user = await prisma_1.default.user.update({
            where: {
                id: req.params.id,
            },
            data: req.body,
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
exports.updateUser = updateUser;
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
 * VERIFY USER
 */
const verifyUser = async (req, res) => {
    try {
        const user = await prisma_1.default.user.update({
            where: {
                id: req.params.id,
            },
            data: {
                isVerified: true,
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
exports.verifyUser = verifyUser;
/**
 * USER ANALYTICS
 */
const userAnalytics = async (req, res) => {
    try {
        const [totalUsers, verifiedUsers, blockedUsers,] = await Promise.all([
            prisma_1.default.user.count(),
            prisma_1.default.user.count({
                where: {
                    isVerified: true,
                },
            }),
            prisma_1.default.user.count({
                where: {
                    isBlocked: true,
                },
            }),
        ]);
        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                verifiedUsers,
                blockedUsers,
            },
        });
    }
    catch {
        res.status(500).json({
            success: false,
        });
    }
};
exports.userAnalytics = userAnalytics;
exports.getUserProfile = exports.getUserById;
exports.updateProfile = exports.updateUser;
exports.uploadProfileImage = exports.updateUser;
exports.removeProfileImage = exports.updateUser;
/* ==========================================
   LOGIN HISTORY
========================================== */
const getLoginHistory = async (req, res) => {
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
        res.status(500).json({
            success: false,
            error,
        });
    }
};
exports.getLoginHistory = getLoginHistory;
/**
 * DELETE USER
 */
const deleteUser = async (req, res) => {
    try {
        const id = String(req.params.id);
        const user = await prisma_1.default.user.findUnique({
            where: { id },
        });
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        await prisma_1.default.user.delete({
            where: { id },
        });
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete user",
            error,
        });
    }
};
exports.deleteUser = deleteUser;
/**
 * ACTIVATE USER
 */
const activateUser = async (req, res) => {
    try {
        const id = String(req.params.id);
        const existingUser = await prisma_1.default.user.findUnique({
            where: { id },
            select: {
                id: true,
                isActive: true,
            },
        });
        if (!existingUser) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        if (existingUser.isActive) {
            res.status(400).json({
                success: false,
                message: "User is already active",
            });
            return;
        }
        const user = await prisma_1.default.user.update({
            where: { id },
            data: {
                isActive: true,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phoneNo: true,
                isActive: true,
                updatedAt: true,
            },
        });
        res.status(200).json({
            success: true,
            message: "User activated successfully",
            data: user,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to activate user",
            error,
        });
    }
};
exports.activateUser = activateUser;
/**
 * DEACTIVATE USER
 */
const deactivateUser = async (req, res) => {
    try {
        const id = String(req.params.id);
        const existingUser = await prisma_1.default.user.findUnique({
            where: { id },
            select: {
                id: true,
                isActive: true,
            },
        });
        if (!existingUser) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        if (!existingUser.isActive) {
            res.status(400).json({
                success: false,
                message: "User is already inactive",
            });
            return;
        }
        const user = await prisma_1.default.user.update({
            where: { id },
            data: {
                isActive: false,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phoneNo: true,
                isActive: true,
                updatedAt: true,
            },
        });
        res.status(200).json({
            success: true,
            message: "User deactivated successfully",
            data: user,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to deactivate user",
            error,
        });
    }
};
exports.deactivateUser = deactivateUser;
/**
 * USER DASHBOARD
 */
const getUserDashboard = async (req, res) => {
    try {
        const [totalUsers, activeUsers, inactiveUsers, verifiedUsers, blockedUsers, totalLoans, totalTransactions, totalNotifications,] = await Promise.all([
            prisma_1.default.user.count(),
            prisma_1.default.user.count({
                where: {
                    isActive: true,
                },
            }),
            prisma_1.default.user.count({
                where: {
                    isActive: false,
                },
            }),
            prisma_1.default.user.count({
                where: {
                    isVerified: true,
                },
            }),
            prisma_1.default.user.count({
                where: {
                    isBlocked: true,
                },
            }),
            prisma_1.default.loanApplication.count(),
            prisma_1.default.transaction.count(),
            prisma_1.default.notification.count(),
        ]);
        res.status(200).json({
            success: true,
            data: {
                users: {
                    total: totalUsers,
                    active: activeUsers,
                    inactive: inactiveUsers,
                    verified: verifiedUsers,
                    blocked: blockedUsers,
                },
                loans: {
                    total: totalLoans,
                },
                transactions: {
                    total: totalTransactions,
                },
                notifications: {
                    total: totalNotifications,
                },
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to load dashboard",
            error,
        });
    }
};
exports.getUserDashboard = getUserDashboard;
/**
 * USER ANALYTICS
 */
const getUserAnalytics = async (req, res) => {
    try {
        const [totalUsers, activeUsers, inactiveUsers, verifiedUsers, unverifiedUsers, blockedUsers, unblockedUsers, todayUsers, thisMonthUsers,] = await Promise.all([
            prisma_1.default.user.count(),
            prisma_1.default.user.count({
                where: {
                    isActive: true,
                },
            }),
            prisma_1.default.user.count({
                where: {
                    isActive: false,
                },
            }),
            prisma_1.default.user.count({
                where: {
                    isVerified: true,
                },
            }),
            prisma_1.default.user.count({
                where: {
                    isVerified: false,
                },
            }),
            prisma_1.default.user.count({
                where: {
                    isBlocked: true,
                },
            }),
            prisma_1.default.user.count({
                where: {
                    isBlocked: false,
                },
            }),
            prisma_1.default.user.count({
                where: {
                    createdAt: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    },
                },
            }),
            prisma_1.default.user.count({
                where: {
                    createdAt: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    },
                },
            }),
        ]);
        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                activeUsers,
                inactiveUsers,
                verifiedUsers,
                unverifiedUsers,
                blockedUsers,
                unblockedUsers,
                todayUsers,
                thisMonthUsers,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch user analytics",
            error,
        });
    }
};
exports.getUserAnalytics = getUserAnalytics;
/**
 * GET PENDING USERS
 */
const getPendingUsers = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const where = {
            isVerified: false,
        };
        const [users, total] = await Promise.all([
            prisma_1.default.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phoneNo: true,
                    role: true,
                    isVerified: true,
                    isActive: true,
                    isBlocked: true,
                    createdAt: true,
                },
            }),
            prisma_1.default.user.count({ where }),
        ]);
        res.status(200).json({
            success: true,
            total,
            page,
            limit,
            data: users,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch pending users",
            error,
        });
    }
};
exports.getPendingUsers = getPendingUsers;
/**
 * GET VERIFIED USERS
 */
const getVerifiedUsers = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const where = {
            isVerified: true,
        };
        const [users, total] = await Promise.all([
            prisma_1.default.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phoneNo: true,
                    role: true,
                    isVerified: true,
                    isActive: true,
                    isBlocked: true,
                    createdAt: true,
                },
            }),
            prisma_1.default.user.count({
                where,
            }),
        ]);
        res.status(200).json({
            success: true,
            total,
            page,
            limit,
            data: users,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch verified users",
            error,
        });
    }
};
exports.getVerifiedUsers = getVerifiedUsers;
/**
 * GET BLOCKED USERS
 */
const getBlockedUsers = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const where = {
            isBlocked: true,
        };
        const [users, total] = await Promise.all([
            prisma_1.default.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phoneNo: true,
                    role: true,
                    isVerified: true,
                    isActive: true,
                    isBlocked: true,
                    createdAt: true,
                },
            }),
            prisma_1.default.user.count({
                where,
            }),
        ]);
        res.status(200).json({
            success: true,
            total,
            page,
            limit,
            data: users,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch blocked users",
            error,
        });
    }
};
exports.getBlockedUsers = getBlockedUsers;
/**
 * GET ACTIVE USERS
 */
const getActiveUsers = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const where = {
            isActive: true,
        };
        const [users, total] = await Promise.all([
            prisma_1.default.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phoneNo: true,
                    role: true,
                    isVerified: true,
                    isActive: true,
                    isBlocked: true,
                    createdAt: true,
                },
            }),
            prisma_1.default.user.count({
                where,
            }),
        ]);
        res.status(200).json({
            success: true,
            page,
            limit,
            total,
            data: users,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch active users",
            error,
        });
    }
};
exports.getActiveUsers = getActiveUsers;
/**
 * SEARCH USERS
 */
const searchUsers = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const search = String(req.query.search || "").trim();
        const where = search
            ? {
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
                        },
                    },
                ],
            }
            : {};
        const [users, total] = await Promise.all([
            prisma_1.default.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phoneNo: true,
                    role: true,
                    isVerified: true,
                    isActive: true,
                    isBlocked: true,
                    createdAt: true,
                },
            }),
            prisma_1.default.user.count({
                where,
            }),
        ]);
        res.status(200).json({
            success: true,
            page,
            limit,
            total,
            search,
            data: users,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to search users",
            error,
        });
    }
};
exports.searchUsers = searchUsers;
/**
 * GET TOP USERS
 */
const getTopUsers = async (req, res) => {
    try {
        const limit = Number(req.query.limit) || 10;
        const users = await prisma_1.default.user.findMany({
            where: {
                isActive: true,
            },
            take: limit,
            orderBy: [
                {
                    createdAt: "desc",
                },
            ],
            select: {
                id: true,
                name: true,
                email: true,
                phoneNo: true,
                role: true,
                isVerified: true,
                isBlocked: true,
                isActive: true,
                createdAt: true,
            },
        });
        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch top users",
            error,
        });
    }
};
exports.getTopUsers = getTopUsers;
/**
 * GET NEW USERS
 */
const getNewUsers = async (req, res) => {
    try {
        const limit = Number(req.query.limit) || 10;
        const users = await prisma_1.default.user.findMany({
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                name: true,
                email: true,
                phoneNo: true,
                role: true,
                isVerified: true,
                isActive: true,
                isBlocked: true,
                createdAt: true,
            },
        });
        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch new users",
            error,
        });
    }
};
exports.getNewUsers = getNewUsers;
/**
 * GET RECENT USERS
 */
const getRecentUsers = async (req, res) => {
    try {
        const limit = Number(req.query.limit) || 20;
        const users = await prisma_1.default.user.findMany({
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                name: true,
                email: true,
                phoneNo: true,
                role: true,
                isVerified: true,
                isActive: true,
                isBlocked: true,
                profileImage: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch recent users",
            error,
        });
    }
};
exports.getRecentUsers = getRecentUsers;
/**
 * GET USER LOANS
 */
const getUserLoans = async (req, res) => {
    try {
        const userId = String(req.params.userId);
        const loans = await prisma_1.default.loanApplication.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.status(200).json({
            success: true,
            count: loans.length,
            data: loans,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch user loans",
            error,
        });
    }
};
exports.getUserLoans = getUserLoans;
/**
 * GET USER TRANSACTIONS
 */
const getUserTransactions = async (req, res) => {
    try {
        const userId = String(req.params.userId);
        const transactions = await prisma_1.default.transaction.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.status(200).json({
            success: true,
            count: transactions.length,
            data: transactions,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch user transactions",
            error,
        });
    }
};
exports.getUserTransactions = getUserTransactions;
/**
 * GET USER DOCUMENTS
 */
const getUserDocuments = async (req, res) => {
    try {
        const userId = String(req.params.userId);
        const documents = await prisma_1.default.document.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.status(200).json({
            success: true,
            count: documents.length,
            data: documents,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch user documents",
            error,
        });
    }
};
exports.getUserDocuments = getUserDocuments;
/**
 * GET USER KYC
 */
const getUserKyc = async (req, res) => {
    try {
        const userId = String(req.params.userId);
        const kyc = await prisma_1.default.kYC.findFirst({
            where: {
                userId,
            },
        });
        if (!kyc) {
            res.status(404).json({
                success: false,
                message: "KYC record not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: kyc,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch user KYC",
            error,
        });
    }
};
exports.getUserKyc = getUserKyc;
/**
 * GET USER WALLET
 */
const getUserWallet = async (req, res) => {
    try {
        const userId = String(req.params.userId);
        const wallet = await prisma_1.default.wallet.findUnique({
            where: {
                userId,
            },
        });
        if (!wallet) {
            res.status(404).json({
                success: false,
                message: "Wallet not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: wallet,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch user wallet",
            error,
        });
    }
};
exports.getUserWallet = getUserWallet;
/**
 * GET USER NOTIFICATIONS
 */
const getUserNotifications = async (req, res) => {
    try {
        const userId = String(req.params.userId);
        const notifications = await prisma_1.default.notification.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.status(200).json({
            success: true,
            count: notifications.length,
            data: notifications,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch user notifications",
            error,
        });
    }
};
exports.getUserNotifications = getUserNotifications;
/**
 * GET USER REFERRALS
 */
const getUserReferrals = async (req, res) => {
    try {
        const userId = String(req.params.userId);
        const referrals = await prisma_1.default.referral.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.status(200).json({
            success: true,
            count: referrals.length,
            data: referrals,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch user referrals",
            error,
        });
    }
};
exports.getUserReferrals = getUserReferrals;
/**
 * GET USER COMMISSIONS
 */
const getUserCommissions = async (req, res) => {
    try {
        const userId = String(req.params.userId);
        const commissions = await prisma_1.default.commission.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.status(200).json({
            success: true,
            count: commissions.length,
            data: commissions,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch user commissions",
            error,
        });
    }
};
exports.getUserCommissions = getUserCommissions;
/**
 * GET USER ACHIEVEMENTS
 */
const getUserAchievements = async (req, res) => {
    try {
        const userId = String(req.params.userId);
        const achievements = await prisma_1.default.achievement.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.status(200).json({
            success: true,
            count: achievements.length,
            data: achievements,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch user achievements",
            error,
        });
    }
};
exports.getUserAchievements = getUserAchievements;
/**
 * GET USER LEADERBOARD RANK
 */
const getUserLeaderboardRank = async (req, res) => {
    try {
        const userId = String(req.params.userId);
        const users = await prisma_1.default.user.findMany({
            orderBy: {
                createdAt: "asc",
            },
            select: {
                id: true,
                name: true,
            },
        });
        const rank = users.findIndex((user) => user.id === userId) + 1;
        if (rank === 0) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: {
                userId,
                rank,
                totalUsers: users.length,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch leaderboard rank",
            error,
        });
    }
};
exports.getUserLeaderboardRank = getUserLeaderboardRank;
/**
 * CHANGE PASSWORD
 */
const changePassword = async (req, res) => {
    try {
        const { userId, currentPassword, newPassword } = req.body;
        const user = await prisma_1.default.user.findUnique({
            where: {
                id: String(userId),
            },
        });
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isMatch) {
            res.status(400).json({
                success: false,
                message: "Current password is incorrect",
            });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await prisma_1.default.user.update({
            where: {
                id: user.id,
            },
            data: {
                password: hashedPassword,
            },
        });
        res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to change password",
            error,
        });
    }
};
exports.changePassword = changePassword;
/**
 * RESET PASSWORD (Admin)
 */
const resetPassword = async (req, res) => {
    try {
        const { userId, newPassword } = req.body;
        if (!userId || !newPassword) {
            res.status(400).json({
                success: false,
                message: "User ID and new password are required",
            });
            return;
        }
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
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await prisma_1.default.user.update({
            where: {
                id: user.id,
            },
            data: {
                password: hashedPassword,
            },
        });
        res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to reset password",
            error,
        });
    }
};
exports.resetPassword = resetPassword;
/**
 * UPDATE EMAIL
 */
const updateEmail = async (req, res) => {
    try {
        const { userId, email } = req.body;
        if (!userId || !email) {
            res.status(400).json({
                success: false,
                message: "User ID and email are required",
            });
            return;
        }
        const existingUser = await prisma_1.default.user.findUnique({
            where: {
                id: String(userId),
            },
        });
        if (!existingUser) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        const emailExists = await prisma_1.default.user.findFirst({
            where: {
                email,
                NOT: {
                    id: String(userId),
                },
            },
        });
        if (emailExists) {
            res.status(400).json({
                success: false,
                message: "Email already exists",
            });
            return;
        }
        const user = await prisma_1.default.user.update({
            where: {
                id: String(userId),
            },
            data: {
                email,
                isVerified: false,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phoneNo: true,
                isVerified: true,
            },
        });
        res.status(200).json({
            success: true,
            message: "Email updated successfully",
            data: user,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update email",
            error,
        });
    }
};
exports.updateEmail = updateEmail;
/**
 * UPDATE PHONE
 */
const updatePhone = async (req, res) => {
    try {
        const { userId, phoneNo } = req.body;
        if (!userId || !phoneNo) {
            res.status(400).json({
                success: false,
                message: "User ID and phone number are required",
            });
            return;
        }
        const user = await prisma_1.default.user.findUnique({
            where: {
                id: String(userId),
            },
        });
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        const phoneExists = await prisma_1.default.user.findFirst({
            where: {
                phoneNo,
                NOT: {
                    id: String(userId),
                },
            },
        });
        if (phoneExists) {
            res.status(400).json({
                success: false,
                message: "Phone number already exists",
            });
            return;
        }
        const updatedUser = await prisma_1.default.user.update({
            where: {
                id: String(userId),
            },
            data: {
                phoneNo,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phoneNo: true,
            },
        });
        res.status(200).json({
            success: true,
            message: "Phone number updated successfully",
            data: updatedUser,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update phone number",
            error,
        });
    }
};
exports.updatePhone = updatePhone;
/**
 * VERIFY EMAIL
 */
const verifyEmail = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            res.status(400).json({
                success: false,
                message: "User ID is required",
            });
            return;
        }
        const user = await prisma_1.default.user.findUnique({
            where: {
                id: String(userId),
            },
        });
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        const updatedUser = await prisma_1.default.user.update({
            where: {
                id: String(userId),
            },
            data: {
                isVerified: true,
            },
            select: {
                id: true,
                name: true,
                email: true,
                isVerified: true,
                updatedAt: true,
            },
        });
        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            data: updatedUser,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to verify email",
            error,
        });
    }
};
exports.verifyEmail = verifyEmail;
/**
 * VERIFY PHONE
 */
const verifyPhone = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            res.status(400).json({
                success: false,
                message: "User ID is required",
            });
            return;
        }
        const user = await prisma_1.default.user.findUnique({
            where: {
                id: String(userId),
            },
        });
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        const updatedUser = await prisma_1.default.user.update({
            where: {
                id: String(userId),
            },
            data: {
                isVerified: true,
            },
            select: {
                id: true,
                name: true,
                phoneNo: true,
                isVerified: true,
                updatedAt: true,
            },
        });
        res.status(200).json({
            success: true,
            message: "Phone verified successfully",
            data: updatedUser,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to verify phone",
            error,
        });
    }
};
exports.verifyPhone = verifyPhone;
/**
 * ENABLE TWO FACTOR AUTHENTICATION
 */
const enableTwoFactorAuth = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            res.status(400).json({
                success: false,
                message: "User ID is required",
            });
            return;
        }
        const user = await prisma_1.default.user.findUnique({
            where: {
                id: String(userId),
            },
            select: {
                id: true,
                isActive: true,
            },
        });
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        const updatedUser = await prisma_1.default.user.update({
            where: {
                id: String(userId),
            },
            data: {
                twoFactorEnabled: true,
            },
            select: {
                id: true,
                name: true,
                email: true,
                twoFactorEnabled: true,
            },
        });
        res.status(200).json({
            success: true,
            message: "Two-factor authentication enabled successfully",
            data: updatedUser,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to enable two-factor authentication",
            error,
        });
    }
};
exports.enableTwoFactorAuth = enableTwoFactorAuth;
/**
 * DISABLE TWO FACTOR AUTHENTICATION
 */
const disableTwoFactorAuth = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            res.status(400).json({
                success: false,
                message: "User ID is required",
            });
            return;
        }
        const user = await prisma_1.default.user.findUnique({
            where: {
                id: String(userId),
            },
            select: {
                id: true,
                twoFactorEnabled: true,
            },
        });
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        const updatedUser = await prisma_1.default.user.update({
            where: {
                id: String(userId),
            },
            data: {
                twoFactorEnabled: false,
            },
            select: {
                id: true,
                name: true,
                email: true,
                twoFactorEnabled: true,
            },
        });
        res.status(200).json({
            success: true,
            message: "Two-factor authentication disabled successfully",
            data: updatedUser,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to disable two-factor authentication",
            error,
        });
    }
};
exports.disableTwoFactorAuth = disableTwoFactorAuth;
/**
 * GET ACTIVITY LOGS
 */
const getActivityLogs = async (req, res) => {
    try {
        const userId = String(req.params.userId);
        const logs = await prisma_1.default.activityLog.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.status(200).json({
            success: true,
            count: logs.length,
            data: logs,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch activity logs",
            error,
        });
    }
};
exports.getActivityLogs = getActivityLogs;
/**
 * GET USER AUDIT LOGS
 */
const getUserAuditLogs = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const logs = await prisma_1.default.securityLog.findMany({
            skip,
            take: limit,
            orderBy: {
                createdAt: "desc",
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
        });
        const total = await prisma_1.default.securityLog.count();
        res.status(200).json({
            success: true,
            page,
            limit,
            total,
            data: logs,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch audit logs",
            error,
        });
    }
};
exports.getUserAuditLogs = getUserAuditLogs;
/**
 * EXPORT USERS EXCEL
 */
const exportUsersExcel = async (req, res) => {
    try {
        const users = await prisma_1.default.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                phoneNo: true,
                role: true,
                isActive: true,
                isVerified: true,
                isBlocked: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        const worksheet = XLSX.utils.json_to_sheet(users);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
        const buffer = XLSX.write(workbook, {
            type: "buffer",
            bookType: "xlsx",
        });
        res.setHeader("Content-Disposition", 'attachment; filename="users.xlsx"');
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.send(buffer);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to export users",
            error,
        });
    }
};
exports.exportUsersExcel = exportUsersExcel;
/**
 * EXPORT USERS PDF
 */
const exportUsersPdf = async (req, res) => {
    try {
        const users = await prisma_1.default.user.findMany({
            select: {
                name: true,
                email: true,
                phoneNo: true,
                role: true,
                isActive: true,
                isVerified: true,
                isBlocked: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        const doc = new pdfkit_1.default({
            margin: 30,
            size: "A4",
        });
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", 'attachment; filename="users.pdf"');
        doc.pipe(res);
        doc
            .fontSize(20)
            .text("Users Report", {
            align: "center",
        });
        doc.moveDown();
        users.forEach((user, index) => {
            doc
                .fontSize(12)
                .text(`${index + 1}. ${user.name}`, {
                underline: true,
            });
            doc.text(`Email      : ${user.email}`);
            doc.text(`Phone      : ${user.phoneNo}`);
            doc.text(`Role       : ${user.role}`);
            doc.text(`Active     : ${user.isActive ? "Yes" : "No"}`);
            doc.text(`Verified   : ${user.isVerified ? "Yes" : "No"}`);
            doc.text(`Blocked    : ${user.isBlocked ? "Yes" : "No"}`);
            doc.text(`Created At : ${user.createdAt.toLocaleString()}`);
            doc.moveDown();
            doc.moveTo(30, doc.y).lineTo(565, doc.y).stroke();
            doc.moveDown();
        });
        doc.end();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to export users PDF",
            error,
        });
    }
};
exports.exportUsersPdf = exportUsersPdf;
/**
 * BULK VERIFY USERS
 */
const bulkVerifyUsers = async (req, res) => {
    try {
        const { userIds } = req.body;
        if (!Array.isArray(userIds) || userIds.length === 0) {
            res.status(400).json({
                success: false,
                message: "User IDs are required",
            });
            return;
        }
        const result = await prisma_1.default.user.updateMany({
            where: {
                id: {
                    in: userIds,
                },
            },
            data: {
                isVerified: true,
            },
        });
        res.status(200).json({
            success: true,
            message: `${result.count} users verified successfully`,
            updatedCount: result.count,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to verify users",
            error,
        });
    }
};
exports.bulkVerifyUsers = bulkVerifyUsers;
/**
 * BULK BLOCK USERS
 */
const bulkBlockUsers = async (req, res) => {
    try {
        const { userIds } = req.body;
        if (!Array.isArray(userIds) || userIds.length === 0) {
            res.status(400).json({
                success: false,
                message: "User IDs are required",
            });
            return;
        }
        const result = await prisma_1.default.user.updateMany({
            where: {
                id: {
                    in: userIds,
                },
            },
            data: {
                isBlocked: true,
            },
        });
        res.status(200).json({
            success: true,
            message: `${result.count} users blocked successfully`,
            updatedCount: result.count,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to block users",
            error,
        });
    }
};
exports.bulkBlockUsers = bulkBlockUsers;
/**
 * BULK UNBLOCK USERS
 */
const bulkUnblockUsers = async (req, res) => {
    try {
        const { userIds } = req.body;
        if (!Array.isArray(userIds) || userIds.length === 0) {
            res.status(400).json({
                success: false,
                message: "User IDs are required",
            });
            return;
        }
        const result = await prisma_1.default.user.updateMany({
            where: {
                id: {
                    in: userIds,
                },
            },
            data: {
                isBlocked: false,
            },
        });
        res.status(200).json({
            success: true,
            message: `${result.count} users unblocked successfully`,
            updatedCount: result.count,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to unblock users",
            error,
        });
    }
};
exports.bulkUnblockUsers = bulkUnblockUsers;
/**
 * BULK DELETE USERS
 */
const bulkDeleteUsers = async (req, res) => {
    try {
        const { userIds } = req.body;
        if (!Array.isArray(userIds) || userIds.length === 0) {
            res.status(400).json({
                success: false,
                message: "User IDs are required",
            });
            return;
        }
        const result = await prisma_1.default.user.deleteMany({
            where: {
                id: {
                    in: userIds,
                },
            },
        });
        res.status(200).json({
            success: true,
            message: `${result.count} users deleted successfully`,
            deletedCount: result.count,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete users",
            error,
        });
    }
};
exports.bulkDeleteUsers = bulkDeleteUsers;
