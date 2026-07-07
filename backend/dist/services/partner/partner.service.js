"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class PartnerService {
    /**
     * Create Partner
     */
    async createPartner(data) {
        const existingPartner = await prisma_1.default.partner.findFirst({
            where: {
                OR: [
                    { email: data.email },
                    { phone: data.phone },
                ],
            },
        });
        if (existingPartner) {
            throw new Error("Partner already exists");
        }
        return prisma_1.default.partner.create({
            data: {
                ...data,
                status: "pending",
            },
        });
    }
    /**
     * Get Partner By Id
     */
    async getPartnerById(partnerId) {
        return prisma_1.default.partner.findUnique({
            where: {
                id: partnerId,
            },
            include: {
                leads: true,
                commissions: true,
            },
        });
    }
    /**
     * Get All Partners
     */
    async getAllPartners(page = 1, limit = 20, search = "") {
        const skip = (page - 1) * limit;
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
                        phone: {
                            contains: search,
                        },
                    },
                ],
            }
            : {};
        const [partners, total] = await Promise.all([
            prisma_1.default.partner.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.partner.count({
                where,
            }),
        ]);
        return {
            partners,
            total,
            page,
            pages: Math.ceil(total / limit),
        };
    }
    /**
     * Approve Partner
     */
    async approvePartner(partnerId) {
        return prisma_1.default.partner.update({
            where: {
                id: partnerId,
            },
            data: {
                status: "approved",
                approvedAt: new Date(),
            },
        });
    }
    /**
     * Reject Partner
     */
    async rejectPartner(partnerId, reason) {
        return prisma_1.default.partner.update({
            where: {
                id: partnerId,
            },
            data: {
                status: "rejected",
                rejectionReason: reason,
            },
        });
    }
    /**
     * Assign Lead
     */
    async assignLead(partnerId, leadId) {
        return prisma_1.default.loanApplication.update({
            where: {
                id: leadId,
            },
            data: {
                partnerId,
            },
        });
    }
    /**
     * Partner Leads
     */
    async getPartnerLeads(partnerId) {
        return prisma_1.default.loanApplication.findMany({
            where: {
                partnerId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    /**
     * Partner Earnings
     */
    async getPartnerEarnings(partnerId) {
        const earnings = await prisma_1.default.commission.aggregate({
            where: {
                partnerId,
                status: "APPROVED",
            },
            _sum: {
                commissionAmount: true,
            },
        });
        return {
            totalEarnings: earnings._sum
                .commissionAmount || 0,
        };
    }
    /**
     * Partner Dashboard
     */
    async getPartnerDashboard(partnerId) {
        const [totalLeads, approvedLoans, earnings,] = await Promise.all([
            prisma_1.default.loanApplication.count({
                where: {
                    partnerId,
                },
            }),
            prisma_1.default.loanApplication.count({
                where: {
                    partnerId,
                    status: "approved",
                },
            }),
            prisma_1.default.commission.aggregate({
                where: {
                    partnerId,
                },
                _sum: {
                    commissionAmount: true,
                },
            }),
        ]);
        return {
            totalLeads,
            approvedLoans,
            earnings: earnings._sum
                .commissionAmount || 0,
        };
    }
    /**
     * Top Partners
     */
    async getTopPartners() {
        return prisma_1.default.commission.groupBy({
            by: ["partnerId"],
            _sum: {
                commissionAmount: true,
            },
            orderBy: {
                _sum: {
                    commissionAmount: "desc",
                },
            },
            take: 10,
        });
    }
    /**
     * Block Partner
     */
    async blockPartner(partnerId) {
        return prisma_1.default.partner.update({
            where: {
                id: partnerId,
            },
            data: {
                isBlocked: true,
            },
        });
    }
    /**
     * Unblock Partner
     */
    async unblockPartner(partnerId) {
        return prisma_1.default.partner.update({
            where: {
                id: partnerId,
            },
            data: {
                isBlocked: false,
            },
        });
    }
    /**
     * Delete Partner
     */
    async deletePartner(partnerId) {
        return prisma_1.default.partner.delete({
            where: {
                id: partnerId,
            },
        });
    }
    /**
     * Partner Analytics
     */
    async getPartnerStats() {
        const [totalPartners, activePartners, blockedPartners, totalLeads,] = await Promise.all([
            prisma_1.default.partner.count(),
            prisma_1.default.partner.count({
                where: {
                    status: "approved",
                },
            }),
            prisma_1.default.partner.count({
                where: {
                    isBlocked: true,
                },
            }),
            prisma_1.default.loanApplication.count(),
        ]);
        return {
            totalPartners,
            activePartners,
            blockedPartners,
            totalLeads,
        };
    }
}
exports.default = new PartnerService();
