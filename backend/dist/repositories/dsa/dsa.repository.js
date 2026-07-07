"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DsaRepository = void 0;
const prisma_1 = require("../../prisma/prisma");
class DsaRepository {
    /* ==========================
        CREATE DSA PROFILE
    ========================== */
    static async createProfile(data) {
        return prisma_1.prisma.dsaProfile.create({
            data
        });
    }
    /* ==========================
        GET DSA PROFILE
    ========================== */
    static async getProfile(userId) {
        return prisma_1.prisma.dsaProfile.findUnique({
            where: {
                userId
            },
            include: {
                user: true
            }
        });
    }
    /* ==========================
        GET DSA BY REFERRAL
    ========================== */
    static async getByReferralCode(referralCode) {
        return prisma_1.prisma.dsaProfile.findUnique({
            where: {
                referralCode
            }
        });
    }
    /* ==========================
        UPDATE PROFILE
    ========================== */
    static async updateProfile(userId, data) {
        return prisma_1.prisma.dsaProfile.update({
            where: {
                userId
            },
            data
        });
    }
    /* ==========================
        DSA LOANS
    ========================== */
    static async getDsaLoans(userId) {
        return prisma_1.prisma.loanApplication.findMany({
            where: {
                dsaId: userId
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    }
    /* ==========================
        DSA CUSTOMERS
    ========================== */
    static async getDsaCustomers(userId) {
        return prisma_1.prisma.user.findMany({
            where: {
                referredBy: userId
            }
        });
    }
    /* ==========================
        DSA COMMISSIONS
    ========================== */
    static async getDsaCommissions(userId) {
        return prisma_1.prisma.commission.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    }
    /* ==========================
        INCREASE LEADS
    ========================== */
    static async increaseLeadCount(userId) {
        return prisma_1.prisma.dsaProfile.update({
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
    /* ==========================
        INCREASE LOANS
    ========================== */
    static async increaseLoanCount(userId) {
        return prisma_1.prisma.dsaProfile.update({
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
    /* ==========================
        UPDATE BUSINESS
    ========================== */
    static async addBusinessVolume(userId, amount) {
        return prisma_1.prisma.dsaProfile.update({
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
    /* ==========================
        UPDATE COMMISSION
    ========================== */
    static async addCommission(userId, amount) {
        return prisma_1.prisma.dsaProfile.update({
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
    /* ==========================
        TOP DSA
    ========================== */
    static async getTopDsa() {
        return prisma_1.prisma.dsaProfile.findMany({
            orderBy: {
                totalBusiness: "desc"
            },
            take: 10,
            include: {
                user: true
            }
        });
    }
    /* ==========================
        DSA ANALYTICS
    ========================== */
    static async getAnalytics() {
        const [totalDsa, activeDsa, totalBusiness, totalCommission] = await Promise.all([
            prisma_1.prisma.dsaProfile.count(),
            prisma_1.prisma.dsaProfile.count({
                where: {
                    status: "ACTIVE"
                }
            }),
            prisma_1.prisma.dsaProfile.aggregate({
                _sum: {
                    totalBusiness: true
                }
            }),
            prisma_1.prisma.dsaProfile.aggregate({
                _sum: {
                    totalCommission: true
                }
            })
        ]);
        return {
            totalDsa,
            activeDsa,
            totalBusiness: totalBusiness._sum.totalBusiness || 0,
            totalCommission: totalCommission._sum.totalCommission || 0
        };
    }
    /* ==========================
        ALL DSA LIST
    ========================== */
    static async getAllDsa(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            prisma_1.prisma.dsaProfile.findMany({
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc"
                },
                include: {
                    user: true
                }
            }),
            prisma_1.prisma.dsaProfile.count()
        ]);
        return {
            total,
            page,
            limit,
            data
        };
    }
    /* ==========================
        DELETE DSA
    ========================== */
    static async deleteDsa(userId) {
        return prisma_1.prisma.dsaProfile.delete({
            where: {
                userId
            }
        });
    }
}
exports.DsaRepository = DsaRepository;
