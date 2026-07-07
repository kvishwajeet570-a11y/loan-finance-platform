"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class UserService {
    async getAllUsers() {
        return prisma_1.default.user.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async getUserById(id) {
        return prisma_1.default.user.findUnique({
            where: { id },
        });
    }
    async blockUser(id) {
        return prisma_1.default.user.update({
            where: { id },
            data: {
                isBlocked: true,
            },
        });
    }
    async unblockUser(id) {
        return prisma_1.default.user.update({
            where: { id },
            data: {
                isBlocked: false,
            },
        });
    }
    async getUserStats() {
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
        return {
            totalUsers,
            verifiedUsers,
            blockedUsers,
        };
    }
}
exports.default = new UserService();
