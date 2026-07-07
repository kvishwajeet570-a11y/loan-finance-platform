"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAnalytics = exports.verifyUser = exports.unblockUser = exports.blockUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getAllUsers = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
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
