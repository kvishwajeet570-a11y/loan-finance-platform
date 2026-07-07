"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class KYCService {
    /**
     * Submit KYC
     */
    async submitKYC(data) {
        const existingKYC = await prisma_1.default.kYC.findFirst({
            where: {
                userId: data.userId,
            },
        });
        if (existingKYC) {
            throw new Error("KYC already submitted");
        }
        return prisma_1.default.kYC.create({
            data: {
                ...data,
                status: "PENDING",
            },
        });
    }
    /**
     * Get KYC By User
     */
    async getUserKYC(userId) {
        return prisma_1.default.kYC.findFirst({
            where: {
                userId,
            },
        });
    }
    /**
     * Verify KYC
     */
    async approveKYC(kycId, adminId) {
        return prisma_1.default.$transaction(async (tx) => {
            const kyc = await tx.kYC.update({
                where: {
                    id: kycId,
                },
                data: {
                    status: "APPROVED",
                    approvedBy: adminId,
                    approvedAt: new Date(),
                },
            });
            await tx.user.update({
                where: {
                    id: kyc.userId,
                },
                data: {
                    isVerified: true,
                },
            });
            return kyc;
        });
    }
    /**
     * Reject KYC
     */
    async rejectKYC(kycId, reason, adminId) {
        return prisma_1.default.kYC.update({
            where: {
                id: kycId,
            },
            data: {
                status: "REJECTED",
                rejectionReason: reason,
                approvedBy: adminId,
            },
        });
    }
    /**
     * Update KYC
     */
    async updateKYC(kycId, data) {
        return prisma_1.default.kYC.update({
            where: {
                id: kycId,
            },
            data,
        });
    }
    /**
     * Get All KYC
     */
    async getAllKYC(filters) {
        const { page = 1, limit = 20, search, status, } = filters;
        const skip = (page - 1) * limit;
        const where = {};
        if (status) {
            where.status = status;
        }
        if (search) {
            where.OR = [
                {
                    fullName: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    panNumber: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
            ];
        }
        const [kycs, total] = await Promise.all([
            prisma_1.default.kYC.findMany({
                where,
                skip,
                take: limit,
                include: {
                    user: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.kYC.count({
                where,
            }),
        ]);
        return {
            kycs,
            total,
            page,
            pages: Math.ceil(total / limit),
        };
    }
    /**
     * Pending KYC
     */
    async getPendingKYC() {
        return prisma_1.default.kYC.findMany({
            where: {
                status: "PENDING",
            },
            include: {
                user: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    /**
     * KYC Dashboard Stats
     */
    async getKYCStats() {
        const [total, pending, approved, rejected,] = await Promise.all([
            prisma_1.default.kYC.count(),
            prisma_1.default.kYC.count({
                where: {
                    status: "PENDING",
                },
            }),
            prisma_1.default.kYC.count({
                where: {
                    status: "APPROVED",
                },
            }),
            prisma_1.default.kYC.count({
                where: {
                    status: "REJECTED",
                },
            }),
        ]);
        return {
            total,
            pending,
            approved,
            rejected,
        };
    }
    /**
     * Check User Eligibility
     */
    async isKYCCompleted(userId) {
        const kyc = await prisma_1.default.kYC.findFirst({
            where: {
                userId,
                status: "APPROVED",
            },
        });
        return {
            completed: !!kyc,
            kyc,
        };
    }
}
exports.default = new KYCService();
