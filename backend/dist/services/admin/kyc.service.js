"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class KYCService {
    async getAllKYC() {
        return prisma_1.default.user.findMany({
            where: {
                isVerified: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async getPendingKYC() {
        return prisma_1.default.user.findMany({
            where: {
                isVerified: false,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async verifyKYC(userId) {
        return prisma_1.default.user.update({
            where: {
                id: userId,
            },
            data: {
                isVerified: true,
            },
        });
    }
    async rejectKYC(userId) {
        return prisma_1.default.user.update({
            where: {
                id: userId,
            },
            data: {
                isVerified: false,
            },
        });
    }
    async getKYCStats() {
        const [totalUsers, verifiedUsers, pendingUsers,] = await Promise.all([
            prisma_1.default.user.count(),
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
        ]);
        return {
            totalUsers,
            verifiedUsers,
            pendingUsers,
        };
    }
}
exports.default = new KYCService();
