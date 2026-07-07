"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartnerRepository = void 0;
const prisma_1 = require("../../prisma/prisma");
class PartnerRepository {
    /* =========================
        CREATE PARTNER
    ========================= */
    static async createPartner(data) {
        return prisma_1.prisma.partnerProfile.create({
            data
        });
    }
    /* =========================
        GET BY ID
    ========================= */
    static async getPartnerById(id) {
        return prisma_1.prisma.partnerProfile.findUnique({
            where: { id },
            include: {
                user: true
            }
        });
    }
    /* =========================
        GET BY USER ID
    ========================= */
    static async getPartnerByUserId(userId) {
        return prisma_1.prisma.partnerProfile.findUnique({
            where: {
                userId
            },
            include: {
                user: true
            }
        });
    }
    /* =========================
        GET BY CODE
    ========================= */
    static async getPartnerByCode(partnerCode) {
        return prisma_1.prisma.partnerProfile.findUnique({
            where: {
                partnerCode
            },
            include: {
                user: true
            }
        });
    }
    /* =========================
        UPDATE PARTNER
    ========================= */
    static async updatePartner(id, data) {
        return prisma_1.prisma.partnerProfile.update({
            where: {
                id
            },
            data
        });
    }
    /* =========================
        ACTIVATE PARTNER
    ========================= */
    static async activatePartner(id) {
        return prisma_1.prisma.partnerProfile.update({
            where: {
                id
            },
            data: {
                status: "ACTIVE"
            }
        });
    }
    /* =========================
        BLOCK PARTNER
    ========================= */
    static async blockPartner(id) {
        return prisma_1.prisma.partnerProfile.update({
            where: {
                id
            },
            data: {
                status: "BLOCKED"
            }
        });
    }
    /* =========================
        ADD LEAD
    ========================= */
    static async addLead(userId) {
        return prisma_1.prisma.partnerProfile.update({
            where: {
                userId
            },
            data: {
                totalLeads: {
                    increment: 1
                }
            }
        });
    }
    /* =========================
        ADD CUSTOMER
    ========================= */
    static async addCustomer(userId) {
        return prisma_1.prisma.partnerProfile.update({
            where: {
                userId
            },
            data: {
                totalCustomers: {
                    increment: 1
                }
            }
        });
    }
    /* =========================
        ADD LOAN
    ========================= */
    static async addLoan(userId) {
        return prisma_1.prisma.partnerProfile.update({
            where: {
                userId
            },
            data: {
                totalLoans: {
                    increment: 1
                }
            }
        });
    }
    /* =========================
        ADD BUSINESS
    ========================= */
    static async addBusinessVolume(userId, amount) {
        return prisma_1.prisma.partnerProfile.update({
            where: {
                userId
            },
            data: {
                totalBusiness: {
                    increment: amount
                }
            }
        });
    }
    /* =========================
        ADD COMMISSION
    ========================= */
    static async addCommission(userId, amount) {
        return prisma_1.prisma.partnerProfile.update({
            where: {
                userId
            },
            data: {
                totalCommission: {
                    increment: amount
                }
            }
        });
    }
    /* =========================
        TOP PARTNERS
    ========================= */
    static async getTopPartners(limit = 10) {
        return prisma_1.prisma.partnerProfile.findMany({
            take: limit,
            include: {
                user: true
            },
            orderBy: {
                totalBusiness: "desc"
            }
        });
    }
    /* =========================
        SEARCH PARTNERS
    ========================= */
    static async searchPartners(keyword) {
        return prisma_1.prisma.partnerProfile.findMany({
            where: {
                OR: [
                    {
                        partnerCode: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    },
                    {
                        companyName: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    }
                ]
            },
            include: {
                user: true
            }
        });
    }
    /* =========================
        ALL PARTNERS
    ========================= */
    static async getAllPartners(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [partners, total] = await Promise.all([
            prisma_1.prisma.partnerProfile.findMany({
                skip,
                take: limit,
                include: {
                    user: true
                },
                orderBy: {
                    createdAt: "desc"
                }
            }),
            prisma_1.prisma.partnerProfile.count()
        ]);
        return {
            partners,
            total,
            page,
            limit
        };
    }
    /* =========================
        DELETE PARTNER
    ========================= */
    static async deletePartner(id) {
        return prisma_1.prisma.partnerProfile.delete({
            where: { id }
        });
    }
    /* =========================
        PARTNER ANALYTICS
    ========================= */
    static async getAnalytics() {
        const [totalPartners, activePartners, totalBusiness, totalCommission] = await Promise.all([
            prisma_1.prisma.partnerProfile.count(),
            prisma_1.prisma.partnerProfile.count({
                where: {
                    status: "ACTIVE"
                }
            }),
            prisma_1.prisma.partnerProfile.aggregate({
                _sum: {
                    totalBusiness: true
                }
            }),
            prisma_1.prisma.partnerProfile.aggregate({
                _sum: {
                    totalCommission: true
                }
            })
        ]);
        return {
            totalPartners,
            activePartners,
            totalBusiness: totalBusiness._sum.totalBusiness || 0,
            totalCommission: totalCommission._sum.totalCommission || 0
        };
    }
    /* =========================
        DASHBOARD
    ========================= */
    static async getPartnerDashboard(userId) {
        const partner = await prisma_1.prisma.partnerProfile.findUnique({
            where: {
                userId
            }
        });
        if (!partner) {
            return null;
        }
        return {
            totalLeads: partner.totalLeads,
            totalCustomers: partner.totalCustomers,
            totalLoans: partner.totalLoans,
            totalBusiness: partner.totalBusiness,
            totalCommission: partner.totalCommission
        };
    }
}
exports.PartnerRepository = PartnerRepository;
