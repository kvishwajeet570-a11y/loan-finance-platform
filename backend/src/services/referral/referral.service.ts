import prisma from "../../prisma/prisma";
import crypto from "crypto";

class ReferralService {
  /**
   * Generate Referral Code
   */
  async generateReferralCode(
    userId: string
  ) {
    const code =
      "ILF" +
      crypto
        .randomBytes(4)
        .toString("hex")
        .toUpperCase();

    return prisma.user.update({
      where: { id: userId },

      data: {
        referralCode: code,
      },
    });
  }

  /**
   * Apply Referral Code
   */
  async applyReferralCode(
    userId: string,
    referralCode: string
  ) {
    const referrer =
      await prisma.user.findFirst({
        where: {
          referralCode,
        },
      });

    if (!referrer) {
      throw new Error(
        "Invalid referral code"
      );
    }

    if (referrer.id === userId) {
      throw new Error(
        "Self referral not allowed"
      );
    }

    const existing =
      await prisma.referral.findFirst({
        where: {
          referredUserId:
            userId,
        },
      });

    if (existing) {
      throw new Error(
        "Referral already applied"
      );
    }

    return prisma.referral.create({
      data: {
        referrerId:
          referrer.id,

        referredUserId:
          userId,

        referralCode,

        status:
          "PENDING",
      },
    });
  }

  /**
   * Approve Referral
   */
  async approveReferral(
    referralId: string
  ) {
    const referral =
      await prisma.referral.findUnique({
        where: {
          id: referralId,
        },
      });

    if (!referral) {
      throw new Error(
        "Referral not found"
      );
    }

    await prisma.referral.update({
      where: {
        id: referralId,
      },

      data: {
        status:
          "APPROVED",
      },
    });

    const reward = 500;

    await prisma.commission.create({
      data: {
        userId:
          referral.referrerId,

        commissionAmount:
          reward,

        source:
          "REFERRAL",

        status:
          "APPROVED",
      },
    });

    await prisma.wallet.update({
      where: {
        userId:
          referral.referrerId,
      },

      data: {
        balance: {
          increment:
            reward,
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
  async rejectReferral(
    referralId: string,
    reason: string
  ) {
    return prisma.referral.update({
      where: {
        id: referralId,
      },

      data: {
        status:
          "REJECTED",

        rejectionReason:
          reason,
      },
    });
  }

  /**
   * User Referrals
   */
  async getUserReferrals(
    userId: string
  ) {
    return prisma.referral.findMany({
      where: {
        referrerId:
          userId,
      },

      include: {
        referredUser:
          true,
      },

      orderBy: {
        createdAt:
          "desc",
      },
    });
  }

  /**
   * Referral Earnings
   */
  async getReferralEarnings(
    userId: string
  ) {
    const earnings =
      await prisma.commission.aggregate({
        where: {
          userId,

          source:
            "REFERRAL",
        },

        _sum: {
          commissionAmount:
            true,
        },
      });

    return {
      totalReferralIncome:
        earnings._sum
          .commissionAmount || 0,
    };
  }

  /**
   * Referral Dashboard
   */
  async referralDashboard(
    userId: string
  ) {
    const [
      referrals,
      earnings,
      approved,
    ] = await Promise.all([
      prisma.referral.count({
        where: {
          referrerId:
            userId,
        },
      }),

      prisma.commission.aggregate({
        where: {
          userId,

          source:
            "REFERRAL",
        },

        _sum: {
          commissionAmount:
            true,
        },
      }),

      prisma.referral.count({
        where: {
          referrerId:
            userId,

          status:
            "APPROVED",
        },
      }),
    ]);

    return {
      totalReferrals:
        referrals,

      approvedReferrals:
        approved,

      earnings:
        earnings._sum
          .commissionAmount || 0,
    };
  }

  /**
   * Top Referrers
   */
  async topReferrers() {
    return prisma.referral.groupBy({
      by: ["referrerId"],

      _count: {
        id: true,
      },

      orderBy: {
        _count: {
          id:
            "desc",
        },
      },

      take: 10,
    });
  }

  /**
   * Multi-Level Referral Bonus
   */
  async distributeLevelBonus(
    userId: string,
    amount: number
  ) {
    const referral =
      await prisma.referral.findFirst({
        where: {
          referredUserId:
            userId,
        },
      });

    if (!referral)
      return null;

    const level1 =
      amount * 0.1;

    await prisma.wallet.update({
      where: {
        userId:
          referral.referrerId,
      },

      data: {
        balance: {
          increment:
            level1,
        },
      },
    });

    return {
      level1Bonus:
        level1,
    };
  }

  /**
   * Referral Analytics
   */
  async getReferralStats() {
    const [
      totalReferrals,
      approved,
      pending,
      rejected,
    ] = await Promise.all([
      prisma.referral.count(),

      prisma.referral.count({
        where: {
          status:
            "APPROVED",
        },
      }),

      prisma.referral.count({
        where: {
          status:
            "PENDING",
        },
      }),

      prisma.referral.count({
        where: {
          status:
            "REJECTED",
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
    const year =
      new Date().getFullYear();

    return prisma.$queryRaw`
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

export default new ReferralService();