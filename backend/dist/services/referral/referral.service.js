"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferralService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class ReferralService {
    /* ========================================
       HELPERS
    ======================================== */
    static generateCode() {
        return "DSA" + crypto_1.default.randomBytes(4).toString("hex").toUpperCase();
    }
    /* ========================================
       CORE CRUD & CODE ACTIONS
    ======================================== */
    static async createReferralProgram(dto) {
        const user = await prisma_1.default.user.findUnique({ where: { id: dto.userId } });
        if (!user)
            throw new Error("User not found");
        const existing = await prisma_1.default.referral.findUnique({ where: { userId: dto.userId } });
        if (existing)
            return { alreadyExists: true, referral: existing };
        let referralCode = this.generateCode();
        while (await prisma_1.default.referral.findUnique({ where: { referralCode } })) {
            referralCode = this.generateCode();
        }
        const referral = await prisma_1.default.referral.create({
            data: {
                userId: dto.userId,
                referralCode,
                referralLink: `https://dsafincorp.com/ref/${referralCode}`,
                status: "PENDING",
                source: dto.source ?? null,
                campaign: dto.campaign ?? null,
                ipAddress: dto.ipAddress ?? null,
                deviceInfo: dto.deviceInfo ?? null,
                createdBy: dto.userId
            },
            include: { user: { select: { id: true, name: true, email: true, phoneNo: true } } }
        });
        // Create a welcome notification
        await prisma_1.default.notification.create({
            data: {
                userId: dto.userId,
                title: "Referral Account Created",
                message: "Your referral account has been activated successfully.",
                type: "referral",
                priority: "medium",
                channel: "app"
            }
        });
        return { alreadyExists: false, referral };
    }
    static async applyReferralCode(dto) {
        const user = await prisma_1.default.user.findUnique({ where: { id: dto.userId } });
        if (!user)
            throw new Error("User not found");
        const referral = await prisma_1.default.referral.findUnique({ where: { referralCode: dto.referralCode } });
        if (!referral)
            throw new Error("Invalid referral code");
        if (referral.userId === dto.userId)
            throw new Error("You cannot use your own referral code");
        const existingApplication = await prisma_1.default.referral.findFirst({ where: { referredUserId: dto.userId } });
        if (existingApplication)
            throw new Error("Referral already applied");
        const reward = 100;
        return await prisma_1.default.$transaction(async (tx) => {
            // 1. Update Referrer's metrics
            const updatedReferral = await tx.referral.update({
                where: { id: referral.id },
                data: {
                    referredUserId: dto.userId,
                    totalReferrals: { increment: 1 },
                    successfulReferrals: { increment: 1 },
                    rewardAmount: { increment: reward },
                    totalEarnings: { increment: reward },
                    status: "REWARDED",
                    paidAt: new Date(),
                    updatedBy: referral.userId,
                },
            });
            // 2. Log History
            await tx.referralHistory.create({
                data: { referralId: referral.id, referredUserId: dto.userId, rewardAmount: reward },
            });
            // 3. Update Wallet & Create Transaction Ledger
            const wallet = await tx.wallet.findUnique({ where: { userId: referral.userId } });
            if (wallet) {
                await tx.wallet.update({
                    where: { id: wallet.id },
                    data: {
                        balance: { increment: reward },
                        rewardBalance: { increment: reward },
                        totalEarnings: { increment: reward },
                    },
                });
                await tx.transaction.create({
                    data: {
                        walletId: wallet.id,
                        userId: referral.userId,
                        type: "CREDIT",
                        amount: reward,
                        status: "success",
                        description: "Referral Reward",
                        paymentMethod: "Referral",
                        category: "Referral",
                        remark: `Referral reward credited for user ${dto.userId}`,
                        referenceId: referral.id,
                        transactionId: `REF-${Date.now()}`
                    },
                });
            }
            // 4. Push High Priority Alert
            await tx.notification.create({
                data: {
                    userId: referral.userId,
                    title: "Referral Reward Earned",
                    message: `₹${reward} referral reward has been credited to your wallet.`,
                    type: "referral",
                    priority: "high",
                    channel: "app",
                },
            });
            return updatedReferral;
        });
    }
    static async getAll(skip, limit) {
        return prisma_1.default.referral.findMany({ skip, take: limit, orderBy: { createdAt: "desc" } });
    }
    static async getById(id) {
        return prisma_1.default.referral.findUnique({ where: { id } });
    }
    static async update(id, data) {
        return prisma_1.default.referral.update({ where: { id }, data });
    }
    static async delete(id) {
        return prisma_1.default.referral.delete({ where: { id } });
    }
    /* ========================================
       METRICS & ANALYTICS ENTITIES
    ======================================== */
    static async getDashboardMetrics() {
        return prisma_1.default.referral.aggregate({
            _sum: { totalReferrals: true, totalEarnings: true, successfulReferrals: true },
            _count: { id: true }
        });
    }
    static async getAggregationAnalytics() {
        return prisma_1.default.referral.groupBy({
            by: ['status'],
            _count: { id: true },
            _sum: { totalEarnings: true }
        });
    }
    static async getLiveActivityLogs() {
        return prisma_1.default.referralHistory.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: { referredUser: true }
        });
    }
    static async getLeaderboardData() {
        return prisma_1.default.referral.findMany({
            orderBy: { totalReferrals: "desc" },
            take: 10,
            include: { user: { select: { name: true, email: true } } }
        });
    }
    /* ========================================
       FILTERS & SEGMENTATIONS
    ======================================== */
    static async getByTimeframe(days) {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        return prisma_1.default.referral.findMany({ where: { createdAt: { gte: cutoff } } });
    }
    static async getByCampaign(vertical) {
        return prisma_1.default.referral.findMany({ where: { campaign: vertical } });
    }
    static async getByStatus(statusName) {
        return prisma_1.default.referral.findMany({ where: { status: statusName } });
    }
    static async getByUserScope(field, value) {
        return prisma_1.default.referral.findMany({
            where: field === 'userId' ? { userId: value } : { source: value }
        });
    }
    /* ========================================
       BULK OPERATIONS
    ======================================== */
    static async updateBulkStatus(ids, newStatus) {
        return prisma_1.default.referral.updateMany({
            where: { id: { in: ids } },
            data: { status: newStatus }
        });
    }
    static async deleteBulk(ids) {
        return prisma_1.default.referral.deleteMany({
            where: { id: { in: ids } }
        });
    }
}
exports.ReferralService = ReferralService;
