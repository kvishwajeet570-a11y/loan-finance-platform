"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const prisma_1 = require("../../prisma");
class UserRepository {
    /* =========================
        CREATE USER
    ========================= */
    static async createUser(data) {
        return prisma_1.prisma.user.create({
            data
        });
    }
    /* =========================
        GET USER BY ID
    ========================= */
    static async getUserById(id) {
        return prisma_1.prisma.user.findUnique({
            where: { id },
            include: {
                loans: true
            }
        });
    }
    /* =========================
        EMAIL
    ========================= */
    static async getByEmail(email) {
        return prisma_1.prisma.user.findUnique({
            where: { email }
        });
    }
    /* =========================
        PHONE
    ========================= */
    static async getByPhone(phoneNo) {
        return prisma_1.prisma.user.findUnique({
            where: { phoneNo }
        });
    }
    /* =========================
        UPDATE USER
    ========================= */
    static async updateUser(id, data) {
        return prisma_1.prisma.user.update({
            where: { id },
            data
        });
    }
    /* =========================
        PROFILE IMAGE
    ========================= */
    static async updateProfileImage(id, profileImage) {
        return prisma_1.prisma.user.update({
            where: { id },
            data: {
                profileImage
            }
        });
    }
    /* =========================
        VERIFY USER
    ========================= */
    static async verifyUser(id) {
        return prisma_1.prisma.user.update({
            where: { id },
            data: {
                isVerified: true
            }
        });
    }
    /* =========================
        BLOCK USER
    ========================= */
    static async blockUser(id) {
        return prisma_1.prisma.user.update({
            where: { id },
            data: {
                isBlocked: true
            }
        });
    }
    /* =========================
        UNBLOCK USER
    ========================= */
    static async unblockUser(id) {
        return prisma_1.prisma.user.update({
            where: { id },
            data: {
                isBlocked: false
            }
        });
    }
    /* =========================
        CHANGE ROLE
    ========================= */
    static async changeRole(id, role) {
        return prisma_1.prisma.user.update({
            where: { id },
            data: { role }
        });
    }
    /* =========================
        UPDATE LOGIN
    ========================= */
    static async updateLastLogin(id) {
        return prisma_1.prisma.user.update({
            where: { id },
            data: {
                lastLogin: new Date()
            }
        });
    }
    /* =========================
        DELETE USER
    ========================= */
    static async deleteUser(id) {
        return prisma_1.prisma.user.delete({
            where: { id }
        });
    }
    /* =========================
        SEARCH USERS
    ========================= */
    static async searchUsers(keyword) {
        return prisma_1.prisma.user.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    },
                    {
                        email: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    },
                    {
                        phoneNo: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    }
                ]
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    }
    /* =========================
        USERS BY ROLE
    ========================= */
    static async getUsersByRole(role) {
        return prisma_1.prisma.user.findMany({
            where: { role }
        });
    }
    /* =========================
        VERIFIED USERS
    ========================= */
    static async getVerifiedUsers() {
        return prisma_1.prisma.user.findMany({
            where: {
                isVerified: true
            }
        });
    }
    /* =========================
        BLOCKED USERS
    ========================= */
    static async getBlockedUsers() {
        return prisma_1.prisma.user.findMany({
            where: {
                isBlocked: true
            }
        });
    }
    /* =========================
        ALL USERS
    ========================= */
    static async getAllUsers(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            prisma_1.prisma.user.findMany({
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc"
                }
            }),
            prisma_1.prisma.user.count()
        ]);
        return {
            users,
            total,
            page,
            limit
        };
    }
    /* =========================
        DASHBOARD STATS
    ========================= */
    static async getDashboardStats() {
        const [totalUsers, verifiedUsers, blockedUsers, customers, dsaUsers, partners, admins] = await Promise.all([
            prisma_1.prisma.user.count(),
            prisma_1.prisma.user.count({
                where: {
                    isVerified: true
                }
            }),
            prisma_1.prisma.user.count({
                where: {
                    isBlocked: true
                }
            }),
            prisma_1.prisma.user.count({
                where: {
                    role: "CUSTOMER"
                }
            }),
            prisma_1.prisma.user.count({
                where: {
                    role: "DSA"
                }
            }),
            prisma_1.prisma.user.count({
                where: {
                    role: "PARTNER"
                }
            }),
            prisma_1.prisma.user.count({
                where: {
                    role: "ADMIN"
                }
            })
        ]);
        return {
            totalUsers,
            verifiedUsers,
            blockedUsers,
            customers,
            dsaUsers,
            partners,
            admins
        };
    }
    /* =========================
        MONTHLY USERS
    ========================= */
    static async getMonthlyUsers() {
        return prisma_1.prisma.$queryRaw `
      SELECT
      DATE_TRUNC('month',"createdAt") AS month,
      COUNT(*)::int AS total
      FROM "User"
      GROUP BY month
      ORDER BY month ASC
    `;
    }
    /* =========================
        RECENT USERS
    ========================= */
    static async getRecentUsers(limit = 10) {
        return prisma_1.prisma.user.findMany({
            take: limit,
            orderBy: {
                createdAt: "desc"
            }
        });
    }
}
exports.UserRepository = UserRepository;
