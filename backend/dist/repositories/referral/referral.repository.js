"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferralRepository = void 0;
const prisma_1 = require("../../prisma");
class ReferralRepository {
    /* =========================
        CREATE REFERRAL
    ========================= */
    static async createReferral(data) {
        return prisma_1.prisma.referral.create({
            data
        });
    }
    /* =========================
        GET BY ID
    ========================= */
    static async getById(id) {
        return prisma_1.prisma.referral.findUnique({
            where: { id },
            include: {
                referrer: true,
                referredUser: true
            }
        });
    }
    /* =========================
        GET REFERRAL CODE
    ========================= */
    static async getByCode(referralCode) {
        return prisma_1.prisma.referral.findFirst({
            where: {
                referralCode
            },
            include: {
                referrer: true
            }
        });
    }
    /* =========================
        COMPLETE REFERRAL
    ========================= */
    static async completeReferral(referralId, referredUserId, rewardAmount = 0, commissionAmount = 0) {
        return prisma_1.prisma.referral.update({
            where: {
                id: referralId
            },
            data: {
                referredUserId,
                rewardAmount,
                commissionAmount,
                status: "COMPLETED",
                completedAt: new Date()
            }
        });
    }
    /* =========================
        MARK JOINED
    ========================= */
    static async markJoined(referralId, referredUserId) {
        return prisma_1.prisma.referral.update({
            where: {
                id: referralId
            },
            data: {
                referredUserId,
                status: "JOINED",
                joinedAt: new Date()
            }
        });
    }
    /* =========================
        REJECT REFERRAL
    ========================= */
    static async rejectReferral(referralId, remarks) {
        return prisma_1.prisma.referral.update({
            where: {
                id: referralId
            },
            data: {
                status: "REJECTED",
                remarks
            }
        });
    }
    /* =========================
        REFERRER REFERRALS
    ========================= */
    static async getReferralsByUser(referrerId) {
        return prisma_1.prisma.referral.findMany({
            where: {
                referrerId
            },
            include: {
                referredUser: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    }
    /* =========================
        PENDING REFERRALS
    ========================= */
    static async getPendingReferrals() {
        return prisma_1.prisma.referral.findMany({
            where: {
                status: "PENDING"
            },
            include: {
                referrer: true
            }
        });
    }
    /* =========================
        COMPLETED REFERRALS
    ========================= */
    static async getCompletedReferrals() {
        return prisma_1.prisma.referral.findMany({
            where: {
                status: "COMPLETED"
            },
            include: {
                referrer: true,
                referredUser: true
            }
        });
    }
    /* =========================
        SEARCH REFERRALS
    ========================= */
    static async searchReferrals(keyword) {
        return prisma_1.prisma.referral.findMany({
            where: {
                OR: [
                    {
                        referralCode: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    },
                    {
                        status: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    }
                ]
            },
            include: {
                referrer: true,
                referredUser: true
            }
        });
    }
    /* =========================
        TOP REFERRERS
    ========================= */
    static async getTopReferrers(limit = 10) {
        return prisma_1.prisma.referral.groupBy({
            by: ["referrerId"],
            where: {
                status: "COMPLETED"
            },
            _count: {
                referrerId: true
            },
            _sum: {
                rewardAmount: true,
                commissionAmount: true
            },
            orderBy: {
                _count: {
                    referrerId: "desc"
                }
            },
            take: limit
        });
    }
    /* =========================
        REFERRAL EARNINGS
    ========================= */
    static async getReferralEarnings(referrerId) {
        return prisma_1.prisma.referral.aggregate({
            where: {
                referrerId,
                status: "COMPLETED"
            },
            _sum: {
                rewardAmount: true,
                commissionAmount: true
            },
            _count: true
        });
    }
    /* =========================
        ALL REFERRALS
    ========================= */
    static async getAllReferrals(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [referrals, total] = await Promise.all([
            prisma_1.prisma.referral.findMany({
                skip,
                take: limit,
                include: {
                    referrer: true,
                    referredUser: true
                },
                orderBy: {
                    createdAt: "desc"
                }
            }),
            prisma_1.prisma.referral.count()
        ]);
        return {
            referrals,
            total,
            page,
            limit
        };
    }
    /* =========================
        REFERRAL ANALYTICS
    ========================= */
    static async getAnalytics() {
        const [totalReferrals, completedReferrals, pendingReferrals, totalRewards, totalCommission] = await Promise.all([
            prisma_1.prisma.referral.count(),
            prisma_1.prisma.referral.count({
                where: {
                    status: "COMPLETED"
                }
            }),
            prisma_1.prisma.referral.count({
                where: {
                    status: "PENDING"
                }
            }),
            prisma_1.prisma.referral.aggregate({
                _sum: {
                    rewardAmount: true
                }
            }),
            prisma_1.prisma.referral.aggregate({
                _sum: {
                    commissionAmount: true
                }
            })
        ]);
        return {
            totalReferrals,
            completedReferrals,
            pendingReferrals,
            totalRewards: totalRewards._sum.rewardAmount || 0,
            totalCommission: totalCommission._sum.commissionAmount || 0
        };
    }
    /* =========================
        USER REFERRAL DASHBOARD
    ========================= */
    static async getReferralDashboard(referrerId) {
        const [referrals, earnings] = await Promise.all([
            prisma_1.prisma.referral.count({
                where: {
                    referrerId
                }
            }),
            this.getReferralEarnings(referrerId)
        ]);
        return {
            totalReferrals: referrals,
            totalRewards: earnings._sum.rewardAmount || 0,
            totalCommission: earnings._sum.commissionAmount || 0,
            totalCompleted: earnings._count
        };
    }
}
exports.ReferralRepository = ReferralRepository;
