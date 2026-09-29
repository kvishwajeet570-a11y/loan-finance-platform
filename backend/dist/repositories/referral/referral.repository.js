"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferralRepository = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class ReferralRepository {
    /* =========================================
       CREATE REFERRAL
    ========================================= */
    async createReferral(data) {
        return prisma_1.default.referral.create({
            data,
            include: {
                user: true,
                referrer: true,
                referredUser: true,
            },
        });
    }
    /* =========================================
       FIND BY ID
    ========================================= */
    async findById(id) {
        return prisma_1.default.referral.findUnique({
            where: { id },
            include: {
                user: true,
                referrer: true,
                referredUser: true,
                referralHistory: {
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
        });
    }
    /* =========================================
       FIND BY USER ID
    ========================================= */
    async findByUserId(userId) {
        return prisma_1.default.referral.findUnique({
            where: {
                userId,
            },
            include: {
                user: true,
                referrer: true,
                referredUser: true,
                referralHistory: true,
            },
        });
    }
    /* =========================================
       FIND BY REFERRAL CODE
    ========================================= */
    async findByReferralCode(referralCode) {
        return prisma_1.default.referral.findUnique({
            where: {
                referralCode,
            },
            include: {
                user: true,
                referrer: true,
                referredUser: true,
            },
        });
    }
    /* =========================================
       CHECK REFERRAL EXISTS
    ========================================= */
    async exists(userId) {
        const referral = await prisma_1.default.referral.findUnique({
            where: {
                userId,
            },
            select: {
                id: true,
            },
        });
        return !!referral;
    }
    /* =========================================
       GET ALL REFERRALS
    ========================================= */
    async getAllReferrals({ page = 1, limit = 20, search, status, source, campaign, isFraud, }) {
        const skip = (page - 1) * limit;
        const where = {
            ...(status && { status }),
            ...(source && { source }),
            ...(campaign && { campaign }),
            ...(typeof isFraud === "boolean" && { isFraud }),
            ...(search && {
                OR: [
                    {
                        referralCode: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        user: {
                            name: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    },
                    {
                        user: {
                            email: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    },
                ],
            }),
        };
        const [data, total] = await prisma_1.default.$transaction([
            prisma_1.default.referral.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
                include: {
                    user: true,
                    referrer: true,
                    referredUser: true,
                },
            }),
            prisma_1.default.referral.count({
                where,
            }),
        ]);
        return {
            data,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNext: page * limit < total,
                hasPrevious: page > 1,
            },
        };
    }
    /* =========================================
       UPDATE REFERRAL
    ========================================= */
    async updateReferral(id, data) {
        return prisma_1.default.referral.update({
            where: { id },
            data,
            include: {
                user: true,
                referrer: true,
                referredUser: true,
                referralHistory: true,
            },
        });
    }
    /* =========================================
       APPROVE REFERRAL
    ========================================= */
    async approveReferral(referralId, approvedBy, rewardAmount) {
        return prisma_1.default.referral.update({
            where: {
                id: referralId,
            },
            data: {
                status: client_1.ReferralStatus.APPROVED,
                approvedBy,
                approvedAt: new Date(),
                rewardAmount,
            },
        });
    }
    /* =========================================
       REJECT REFERRAL
    ========================================= */
    async rejectReferral(referralId, rejectedBy, rejectionReason) {
        return prisma_1.default.referral.update({
            where: {
                id: referralId,
            },
            data: {
                status: client_1.ReferralStatus.REJECTED,
                rejectedBy,
                rejectedAt: new Date(),
                rejectionReason,
            },
        });
    }
    /* =========================================
       MARK AS FRAUD
    ========================================= */
    async markAsFraud(referralId, fraudReason, updatedBy) {
        return prisma_1.default.referral.update({
            where: {
                id: referralId,
            },
            data: {
                status: client_1.ReferralStatus.FRAUD,
                isFraud: true,
                fraudReason,
                updatedBy,
            },
        });
    }
    /* =========================================
       MARK AS PAID
    ========================================= */
    async markAsPaid(referralId, rewardAmount, rewardTransactionId) {
        return prisma_1.default.referral.update({
            where: {
                id: referralId,
            },
            data: {
                status: client_1.ReferralStatus.PAID,
                rewardTransactionId,
                rewardPaidAmount: {
                    increment: rewardAmount,
                },
                paidAt: new Date(),
            },
        });
    }
    /* =========================================
       APPLY REWARD
    ========================================= */
    async applyReward(referralId, rewardAmount, rewardTransactionId) {
        return prisma_1.default.referral.update({
            where: {
                id: referralId,
            },
            data: {
                status: client_1.ReferralStatus.REWARDED,
                rewardAmount: {
                    increment: rewardAmount,
                },
                rewardPaidAmount: {
                    increment: rewardAmount,
                },
                totalEarnings: {
                    increment: rewardAmount,
                },
                successfulReferrals: {
                    increment: 1,
                },
                pendingReferrals: {
                    decrement: 1,
                },
                rewardTransactionId,
                paidAt: new Date(),
            },
            include: {
                user: true,
                referrer: true,
                referredUser: true,
            },
        });
    }
    /* =========================================
       EXPIRE REFERRAL
    ========================================= */
    async expireReferral(referralId) {
        return prisma_1.default.referral.update({
            where: {
                id: referralId,
            },
            data: {
                status: client_1.ReferralStatus.EXPIRED,
                expiresAt: new Date(),
            },
        });
    }
    /* =========================================
       REFERRAL ANALYTICS
    ========================================= */
    async getAnalytics() {
        const [totalReferrals, pendingReferrals, approvedReferrals, rewardedReferrals, paidReferrals, rejectedReferrals, fraudReferrals, expiredReferrals, totalReward, totalPaidReward, totalEarnings,] = await prisma_1.default.$transaction([
            prisma_1.default.referral.count(),
            prisma_1.default.referral.count({
                where: {
                    status: client_1.ReferralStatus.PENDING,
                },
            }),
            prisma_1.default.referral.count({
                where: {
                    status: client_1.ReferralStatus.APPROVED,
                },
            }),
            prisma_1.default.referral.count({
                where: {
                    status: client_1.ReferralStatus.REWARDED,
                },
            }),
            prisma_1.default.referral.count({
                where: {
                    status: client_1.ReferralStatus.PAID,
                },
            }),
            prisma_1.default.referral.count({
                where: {
                    status: client_1.ReferralStatus.REJECTED,
                },
            }),
            prisma_1.default.referral.count({
                where: {
                    status: client_1.ReferralStatus.FRAUD,
                },
            }),
            prisma_1.default.referral.count({
                where: {
                    status: client_1.ReferralStatus.EXPIRED,
                },
            }),
            prisma_1.default.referral.aggregate({
                _sum: {
                    rewardAmount: true,
                },
            }),
            prisma_1.default.referral.aggregate({
                _sum: {
                    rewardPaidAmount: true,
                },
            }),
            prisma_1.default.referral.aggregate({
                _sum: {
                    totalEarnings: true,
                },
            }),
        ]);
        return {
            totalReferrals,
            pendingReferrals,
            approvedReferrals,
            rewardedReferrals,
            paidReferrals,
            rejectedReferrals,
            fraudReferrals,
            expiredReferrals,
            totalReward: totalReward._sum.rewardAmount ?? 0,
            totalPaidReward: totalPaidReward._sum.rewardPaidAmount ?? 0,
            totalEarnings: totalEarnings._sum.totalEarnings ?? 0,
        };
    }
    /* =========================================
       LEADERBOARD
    ========================================= */
    async getLeaderboard(limit = 10) {
        return prisma_1.default.referral.findMany({
            take: limit,
            where: {
                status: {
                    in: [
                        client_1.ReferralStatus.REWARDED,
                        client_1.ReferralStatus.PAID,
                    ],
                },
            },
            orderBy: [
                {
                    totalEarnings: "desc",
                },
                {
                    successfulReferrals: "desc",
                },
            ],
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phoneNo: true,
                        profileImage: true,
                    },
                },
            },
        });
    }
    /* =========================================
       DELETE REFERRAL
    ========================================= */
    async deleteReferral(id) {
        return prisma_1.default.referral.delete({
            where: {
                id,
            },
        });
    }
    /* =========================================
       SOFT DELETE (OPTIONAL)
    ========================================= */
    async cancelReferral(id, updatedBy) {
        return prisma_1.default.referral.update({
            where: {
                id,
            },
            data: {
                status: client_1.ReferralStatus.CANCELLED,
                updatedBy,
            },
        });
    }
}
exports.ReferralRepository = ReferralRepository;
/* =========================================
   EXPORT INSTANCE
========================================= */
const referralRepository = new ReferralRepository();
exports.default = referralRepository;
