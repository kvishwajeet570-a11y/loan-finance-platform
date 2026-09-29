"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class KYCService {
    /* ========================================
       SUBMIT KYC
    ======================================== */
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
    /* ========================================
       GET KYC BY USER
    ======================================== */
    async getUserKYC(userId) {
        return prisma_1.default.kYC.findFirst({
            where: {
                userId,
            },
            include: {
                user: true,
            },
        });
    }
    /* ========================================
       GET KYC BY ID
    ======================================== */
    async getKYCById(id) {
        return prisma_1.default.kYC.findUnique({
            where: {
                id,
            },
            include: {
                user: true,
            },
        });
    }
    /* ========================================
       APPROVE KYC
    ======================================== */
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
    /* ========================================
       REJECT KYC
    ======================================== */
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
    /* ========================================
       UPDATE KYC
    ======================================== */
    async updateKYC(kycId, data) {
        return prisma_1.default.kYC.update({
            where: {
                id: kycId,
            },
            data,
        });
    }
    /* ========================================
       DELETE KYC
    ======================================== */
    async deleteKYC(id) {
        return prisma_1.default.kYC.delete({
            where: {
                id,
            },
        });
    }
    /* ========================================
       GET ALL KYC
    ======================================== */
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
    /* ========================================
       APPROVED KYC
    ======================================== */
    async getApprovedKYC() {
        return prisma_1.default.kYC.findMany({
            where: {
                status: "APPROVED",
            },
            include: {
                user: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    /* ========================================
       REJECTED KYC
    ======================================== */
    async getRejectedKYC() {
        return prisma_1.default.kYC.findMany({
            where: {
                status: "REJECTED",
            },
            include: {
                user: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    /* ========================================
       UNDER REVIEW KYC
    ======================================== */
    async getUnderReviewKYC() {
        return prisma_1.default.kYC.findMany({
            where: {
                status: "UNDER_REVIEW",
            },
            include: {
                user: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    /* ========================================
       PENDING KYC
    ======================================== */
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
    /* ========================================
       DASHBOARD STATS
    ======================================== */
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
    /* ========================================
       ANALYTICS
    ======================================== */
    async getAnalytics() {
        return this.getKYCStats();
    }
    /* ========================================
       CHECK KYC STATUS
    ======================================== */
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
