"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
const crypto_1 = __importDefault(require("crypto"));
class ReferralService {
    /**
     * Generate Referral Code
     */
    async generateReferralCode(userId) {
        const code = "ILF" +
            crypto_1.default
                .randomBytes(4)
                .toString("hex")
                .toUpperCase();
        return prisma_1.default.user.update({
            where: { id: userId },
            data: {
                referralCode: code,
            },
        });
    }
    /**
     * Apply Referral Code
     */
    async applyReferralCode(userId, referralCode) {
        const referrer = await prisma_1.default.user.findFirst({
            where: {
                referralCode,
            },
        });
        if (!referrer) {
            throw new Error("Invalid referral code");
        }
        if (referrer.id === userId) {
            throw new Error("Self referral not allowed");
        }
        const existing = await prisma_1.default.referral.findFirst({
            where: {
                referredUserId: userId,
            },
        });
        if (existing) {
            throw new Error("Referral already applied");
        }
        return prisma_1.default.referral.create({
            data: {
                referrerId: referrer.id,
                referredUserId: userId,
                referralCode,
                status: "PENDING",
            },
        });
    }
    /**
     * Approve Referral
     */
    async approveReferral(referralId) {
        const referral = await prisma_1.default.referral.findUnique({
            where: {
                id: referralId,
            },
        });
        if (!referral) {
            throw new Error("Referral not found");
        }
        await prisma_1.default.referral.update({
            where: {
                id: referralId,
            },
            data: {
                status: "APPROVED",
            },
        });
        const reward = 500;
        await prisma_1.default.commission.create({
            data: {
                userId: referral.referrerId,
                commissionAmount: reward,
                source: "REFERRAL",
                status: "APPROVED",
            },
        });
        await prisma_1.default.wallet.update({
            where: {
                userId: referral.referrerId,
            },
            data: {
                balance: {
                    increment: reward,
                },
            },
        });
        return {
            success: true,
            reward,
        };
    }
    /**
     * Reject Referral
     */
    async rejectReferral(referralId, reason) {
        return prisma_1.default.referral.update({
            where: {
                id: referralId,
            },
            data: {
                status: "REJECTED",
                rejectionReason: reason,
            },
        });
    }
    /**
     * User Referrals
     */
    async getUserReferrals(userId) {
        return prisma_1.default.referral.findMany({
            where: {
                referrerId: userId,
            },
            include: {
                referredUser: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    /**
     * Referral Earnings
     */
    async getReferralEarnings(userId) {
        const earnings = await prisma_1.default.commission.aggregate({
            where: {
                userId,
                source: "REFERRAL",
            },
            _sum: {
                commissionAmount: true,
            },
        });
        return {
            totalReferralIncome: earnings._sum
                .commissionAmount || 0,
        };
    }
    /**
     * Referral Dashboard
     */
    async referralDashboard(userId) {
        const [referrals, earnings, approved,] = await Promise.all([
            prisma_1.default.referral.count({
                where: {
                    referrerId: userId,
                },
            }),
            prisma_1.default.commission.aggregate({
                where: {
                    userId,
                    source: "REFERRAL",
                },
                _sum: {
                    commissionAmount: true,
                },
            }),
            prisma_1.default.referral.count({
                where: {
                    referrerId: userId,
                    status: "APPROVED",
                },
            }),
        ]);
        return {
            totalReferrals: referrals,
            approvedReferrals: approved,
            earnings: earnings._sum
                .commissionAmount || 0,
        };
    }
    /**
     * Top Referrers
     */
    async topReferrers() {
        return prisma_1.default.referral.groupBy({
            by: ["referrerId"],
            _count: {
                id: true,
            },
            orderBy: {
                _count: {
                    id: "desc",
                },
            },
            take: 10,
        });
    }
    /**
     * Multi-Level Referral Bonus
     */
    async distributeLevelBonus(userId, amount) {
        const referral = await prisma_1.default.referral.findFirst({
            where: {
                referredUserId: userId,
            },
        });
        if (!referral)
            return null;
        const level1 = amount * 0.1;
        await prisma_1.default.wallet.update({
            where: {
                userId: referral.referrerId,
            },
            data: {
                balance: {
                    increment: level1,
                },
            },
        });
        return {
            level1Bonus: level1,
        };
    }
    /**
     * Referral Analytics
     */
    async getReferralStats() {
        const [totalReferrals, approved, pending, rejected,] = await Promise.all([
            prisma_1.default.referral.count(),
            prisma_1.default.referral.count({
                where: {
                    status: "APPROVED",
                },
            }),
            prisma_1.default.referral.count({
                where: {
                    status: "PENDING",
                },
            }),
            prisma_1.default.referral.count({
                where: {
                    status: "REJECTED",
                },
            }),
        ]);
        return {
            totalReferrals,
            approved,
            pending,
            rejected,
        };
    }
    /**
     * Monthly Referral Report
     */
    async monthlyReferralReport() {
        const year = new Date().getFullYear();
        return prisma_1.default.$queryRaw `
      SELECT
      EXTRACT(MONTH FROM "createdAt") as month,
      COUNT(*) as referrals
      FROM "Referral"
      WHERE EXTRACT(YEAR FROM "createdAt")=${year}
      GROUP BY month
      ORDER BY month ASC
    `;
    }
}
exports.default = new ReferralService();
