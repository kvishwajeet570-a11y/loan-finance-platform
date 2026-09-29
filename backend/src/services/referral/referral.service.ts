import crypto from "crypto";
import { ReferralStatus } from "@prisma/client";
import prisma from "../../prisma/prisma";

/* ========================================
   TYPES & INTERFACES
======================================== */
export interface CreateReferralDTO {
  userId: string;
  source?: string;
  campaign?: string;
  ipAddress?: string;
  deviceInfo?: string;
}

export interface ApplyCodeDTO {
  userId: string;
  referralCode: string;
}

export class ReferralService {
  
  /* ========================================
     HELPERS
  ======================================== */
  private static generateCode(): string {
    return "DSA" + crypto.randomBytes(4).toString("hex").toUpperCase();
  }

  /* ========================================
     CORE CRUD & CODE ACTIONS
  ======================================== */
  
  static async createReferralProgram(dto: CreateReferralDTO) {
    const user = await prisma.user.findUnique({ where: { id: dto.userId } });
    if (!user) throw new Error("User not found");

    const existing = await prisma.referral.findUnique({ where: { userId: dto.userId } });
    if (existing) return { alreadyExists: true, referral: existing };

    let referralCode = this.generateCode();
    while (await prisma.referral.findUnique({ where: { referralCode } })) {
      referralCode = this.generateCode();
    }

    const referral = await prisma.referral.create({
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
    await prisma.notification.create({
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

  static async applyReferralCode(dto: ApplyCodeDTO) {
    const user = await prisma.user.findUnique({ where: { id: dto.userId } });
    if (!user) throw new Error("User not found");

    const referral = await prisma.referral.findUnique({ where: { referralCode: dto.referralCode } });
    if (!referral) throw new Error("Invalid referral code");
    if (referral.userId === dto.userId) throw new Error("You cannot use your own referral code");

    const existingApplication = await prisma.referral.findFirst({ where: { referredUserId: dto.userId } });
    if (existingApplication) throw new Error("Referral already applied");

    const reward = 100;

    return await prisma.$transaction(async (tx) => {
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

  static async getAll(skip: number, limit: number) {
    return prisma.referral.findMany({ skip, take: limit, orderBy: { createdAt: "desc" } });
  }

  static async getById(id: string) {
    return prisma.referral.findUnique({ where: { id } });
  }

  static async update(id: string, data: any) {
    return prisma.referral.update({ where: { id }, data });
  }

  static async delete(id: string) {
    return prisma.referral.delete({ where: { id } });
  }

  /* ========================================
     METRICS & ANALYTICS ENTITIES
  ======================================== */
  
  static async getDashboardMetrics() {
    return prisma.referral.aggregate({
      _sum: { totalReferrals: true, totalEarnings: true, successfulReferrals: true },
      _count: { id: true }
    });
  }

  static async getAggregationAnalytics() {
    return prisma.referral.groupBy({
      by: ['status'],
      _count: { id: true },
      _sum: { totalEarnings: true }
    });
  }

  static async getLiveActivityLogs() {
    return prisma.referralHistory.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { referredUser: true }
    });
  }

  static async getLeaderboardData() {
    return prisma.referral.findMany({
      orderBy: { totalReferrals: "desc" },
      take: 10,
      include: { user: { select: { name: true, email: true } } }
    });
  }

  /* ========================================
     FILTERS & SEGMENTATIONS
  ======================================== */
  
  static async getByTimeframe(days: number) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return prisma.referral.findMany({ where: { createdAt: { gte: cutoff } } });
  }

  static async getByCampaign(vertical: string) {
    return prisma.referral.findMany({ where: { campaign: vertical } });
  }

  static async getByStatus(statusName: ReferralStatus) {
    return prisma.referral.findMany({ where: { status: statusName } });
  }

  static async getByUserScope(field: 'userId' | 'source', value: string) {
    return prisma.referral.findMany({
      where: field === 'userId' ? { userId: value } : { source: value }
    });
  }

  /* ========================================
     BULK OPERATIONS
  ======================================== */
  
  static async updateBulkStatus(ids: string[], newStatus: ReferralStatus) {
    return prisma.referral.updateMany({
      where: { id: { in: ids } },
      data: { status: newStatus }
    });
  }

  static async deleteBulk(ids: string[]) {
    return prisma.referral.deleteMany({
      where: { id: { in: ids } }
    });
  }
}