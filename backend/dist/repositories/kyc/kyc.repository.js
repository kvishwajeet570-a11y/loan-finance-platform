"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KycRepository = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class KycRepository {
    /* ==========================
        CREATE KYC
    ========================== */
    static async createKyc(data) {
        return prisma_1.default.kYC.create({
            data,
        });
    }
    /* ==========================
        GET KYC BY ID
    ========================== */
    static async getById(kycId) {
        return prisma_1.default.kYC.findUnique({
            where: {
                id: kycId,
            },
            include: {
                user: true,
            },
        });
    }
    /* ==========================
        GET USER KYC
    ========================== */
    static async getUserKyc(userId) {
        return prisma_1.default.kYC.findUnique({
            where: {
                userId,
            },
            include: {
                user: true,
            },
        });
    }
    /* ==========================
        APPROVE KYC
    ========================== */
    static async approveKyc(userId, adminId) {
        return prisma_1.default.kYC.update({
            where: {
                userId,
            },
            data: {
                status: "APPROVED",
                approvedBy: adminId,
                approvedAt: new Date(),
            },
        });
    }
    /* ==========================
        REJECT KYC
    ========================== */
    static async rejectKyc(userId, reason) {
        return prisma_1.default.kYC.update({
            where: {
                userId,
            },
            data: {
                status: "REJECTED",
                rejectionReason: reason,
            },
        });
    }
    /* ==========================
        PENDING KYC
    ========================== */
    static async getPendingKyc() {
        return prisma_1.default.kYC.findMany({
            where: {
                status: "PENDING",
            },
            include: {
                user: true,
            },
        });
    }
    /* ==========================
        APPROVED KYC
    ========================== */
    static async getApprovedKyc() {
        return prisma_1.default.kYC.findMany({
            where: {
                status: "APPROVED",
            },
            include: {
                user: true,
            },
        });
    }
    /* ==========================
        REJECTED KYC
    ========================== */
    static async getRejectedKyc() {
        return prisma_1.default.kYC.findMany({
            where: {
                status: "REJECTED",
            },
            include: {
                user: true,
            },
        });
    }
    /* ==========================
        SEARCH KYC
    ========================== */
    static async searchKyc(keyword) {
        return prisma_1.default.kYC.findMany({
            where: {
                OR: [
                    {
                        fullName: {
                            contains: keyword,
                            mode: "insensitive",
                        },
                    },
                    {
                        panNumber: {
                            contains: keyword,
                            mode: "insensitive",
                        },
                    },
                ],
            },
            include: {
                user: true,
            },
        });
    }
    /* ==========================
        ALL KYC
    ========================== */
    static async getAllKyc(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [records, total] = await Promise.all([
            prisma_1.default.kYC.findMany({
                skip,
                take: limit,
                include: {
                    user: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.kYC.count(),
        ]);
        return {
            total,
            page,
            limit,
            records,
        };
    }
    /* ==========================
        KYC ANALYTICS
    ========================== */
    static async getAnalytics() {
        const [totalKyc, approved, pending, rejected,] = await Promise.all([
            prisma_1.default.kYC.count(),
            prisma_1.default.kYC.count({
                where: {
                    status: "APPROVED",
                },
            }),
            prisma_1.default.kYC.count({
                where: {
                    status: "PENDING",
                },
            }),
            prisma_1.default.kYC.count({
                where: {
                    status: "REJECTED",
                },
            }),
        ]);
        return {
            totalKyc,
            approved,
            pending,
            rejected,
        };
    }
    /* ==========================
        DELETE KYC
    ========================== */
    static async deleteKyc(id) {
        return prisma_1.default.kYC.delete({
            where: {
                id,
            },
        });
    }
}
exports.KycRepository = KycRepository;
