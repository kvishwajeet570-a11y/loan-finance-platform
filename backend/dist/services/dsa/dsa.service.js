"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class DSAService {
    async registerDSA(data) {
        const existingUser = await prisma_1.default.user.findFirst({
            where: {
                OR: [
                    { email: data.email },
                    { phoneNo: data.phoneNo },
                ],
            },
        });
        if (existingUser) {
            throw new Error("DSA already exists");
        }
        return prisma_1.default.user.create({
            data: {
                ...data,
                role: "dsa",
                isVerified: false,
            },
        });
    }
    async verifyDSA(dsaId) {
        return prisma_1.default.user.update({
            where: { id: dsaId },
            data: {
                isVerified: true,
            },
        });
    }
    async getDSAProfile(dsaId) {
        return prisma_1.default.user.findUnique({
            where: { id: dsaId },
        });
    }
    async updateDSA(dsaId, data) {
        return prisma_1.default.user.update({
            where: { id: dsaId },
            data,
        });
    }
    async getDSAList(filters) {
        const { page = 1, limit = 20, search, } = filters;
        const skip = (page - 1) * limit;
        const where = {
            role: "dsa",
        };
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
        const [dsas, total] = await Promise.all([
            prisma_1.default.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.user.count({
                where,
            }),
        ]);
        return {
            dsas,
            total,
            page,
            pages: Math.ceil(total / limit),
        };
    }
    async assignLead(dsaId, loanId) {
        return prisma_1.default.loanApplication.update({
            where: { id: loanId },
            data: {
                assignedTo: dsaId,
            },
        });
    }
    async getDSALoans(dsaId) {
        return prisma_1.default.loanApplication.findMany({
            where: {
                assignedTo: dsaId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async getDSADashboard(dsaId) {
        const [totalLeads, approvedLoans, pendingLoans, rejectedLoans,] = await Promise.all([
            prisma_1.default.loanApplication.count({
                where: {
                    assignedTo: dsaId,
                },
            }),
            prisma_1.default.loanApplication.count({
                where: {
                    assignedTo: dsaId,
                    status: "APPROVED",
                },
            }),
            prisma_1.default.loanApplication.count({
                where: {
                    assignedTo: dsaId,
                    status: "PENDING",
                },
            }),
            prisma_1.default.loanApplication.count({
                where: {
                    assignedTo: dsaId,
                    status: "REJECTED",
                },
            }),
        ]);
        const earnings = await prisma_1.default.commission.aggregate({
            where: {
                userId: dsaId,
                status: "APPROVED",
            },
            _sum: {
                commissionAmount: true,
            },
        });
        return {
            totalLeads,
            approvedLoans,
            pendingLoans,
            rejectedLoans,
            totalEarnings: earnings._sum
                .commissionAmount || 0,
        };
    }
    async getPerformanceReport(dsaId) {
        const total = await prisma_1.default.loanApplication.count({
            where: {
                assignedTo: dsaId,
            },
        });
        const approved = await prisma_1.default.loanApplication.count({
            where: {
                assignedTo: dsaId,
                status: "APPROVED",
            },
        });
        return {
            totalLeads: total,
            approvedLeads: approved,
            conversionRate: total > 0
                ? ((approved / total) * 100).toFixed(2)
                : "0.00",
        };
    }
    async getTopDSA(limit = 10) {
        return prisma_1.default.commission.groupBy({
            by: ["userId"],
            _sum: {
                commissionAmount: true,
            },
            orderBy: {
                _sum: {
                    commissionAmount: "desc",
                },
            },
            take: limit,
        });
    }
    async blockDSA(dsaId) {
        return prisma_1.default.user.update({
            where: {
                id: dsaId,
            },
            data: {
                isBlocked: true,
            },
        });
    }
    async unblockDSA(dsaId) {
        return prisma_1.default.user.update({
            where: {
                id: dsaId,
            },
            data: {
                isBlocked: false,
            },
        });
    }
}
exports.default = new DSAService();
