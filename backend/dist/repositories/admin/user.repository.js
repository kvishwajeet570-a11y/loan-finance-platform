"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class UserRepository {
    /* ==========================
       GET ALL USERS
    ========================== */
    static async getAllUsers(page = 1, limit = 20, search = "", role) {
        const skip = (page - 1) * limit;
        const where = {};
        if (role) {
            where.role = role;
        }
        if (search) {
            where.OR = [
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
            ];
        }
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
                    isBlocked: true,
                    createdAt: true,
                },
            }),
            prisma_1.default.user.count({
                where,
            }),
        ]);
        return {
            users,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    /* ==========================
       GET USER BY ID
    ========================== */
    static async getUserById(userId) {
        return prisma_1.default.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                loans: true,
            },
        });
    }
    /* ==========================
       BLOCK USER
    ========================== */
    static async blockUser(userId) {
        return prisma_1.default.user.update({
            where: {
                id: userId,
            },
            data: {
                isBlocked: true,
            },
        });
    }
    /* ==========================
       UNBLOCK USER
    ========================== */
    static async unblockUser(userId) {
        return prisma_1.default.user.update({
            where: {
                id: userId,
            },
            data: {
                isBlocked: false,
            },
        });
    }
    /* ==========================
       VERIFY USER
    ========================== */
    static async verifyUser(userId) {
        return prisma_1.default.user.update({
            where: {
                id: userId,
            },
            data: {
                isVerified: true,
            },
        });
    }
    /* ==========================
       UNVERIFY USER
    ========================== */
    static async unverifyUser(userId) {
        return prisma_1.default.user.update({
            where: {
                id: userId,
            },
            data: {
                isVerified: false,
            },
        });
    }
    /* ==========================
       DELETE USER
    ========================== */
    static async deleteUser(userId) {
        return prisma_1.default.user.delete({
            where: {
                id: userId,
            },
        });
    }
    /* ==========================
       RECENT USERS
    ========================== */
    static async getRecentUsers(limit = 10) {
        return prisma_1.default.user.findMany({
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });
    }
    /* ==========================
       USER ANALYTICS
    ========================== */
    static async getUserAnalytics() {
        const [totalUsers, verifiedUsers, blockedUsers, customers, dsas, partners, admins,] = await Promise.all([
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
            prisma_1.default.user.count({
                where: {
                    role: "CUSTOMER",
                },
            }),
            prisma_1.default.user.count({
                where: {
                    role: "DSA",
                },
            }),
            prisma_1.default.user.count({
                where: {
                    role: "PARTNER",
                },
            }),
            prisma_1.default.user.count({
                where: {
                    role: "ADMIN",
                },
            }),
        ]);
        return {
            totalUsers,
            verifiedUsers,
            blockedUsers,
            customers,
            dsas,
            partners,
            admins,
        };
    }
    /* ==========================
       ROLE WISE USERS
    ========================== */
    static async getUsersByRole(role) {
        return prisma_1.default.user.findMany({
            where: {
                role,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
}
exports.UserRepository = UserRepository;
