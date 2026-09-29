import { Prisma, ReferralStatus } from "@prisma/client";
import prisma from "../../prisma/prisma";

export class ReferralRepository {
  /* =========================================
     CREATE REFERRAL
  ========================================= */

  async createReferral(data: Prisma.ReferralCreateInput) {
    return prisma.referral.create({
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

  async findById(id: string) {
    return prisma.referral.findUnique({
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

  async findByUserId(userId: string) {
    return prisma.referral.findUnique({
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

  async findByReferralCode(referralCode: string) {
    return prisma.referral.findUnique({
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

  async exists(userId: string) {
    const referral = await prisma.referral.findUnique({
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

  async getAllReferrals({
    page = 1,
    limit = 20,
    search,
    status,
    source,
    campaign,
    isFraud,
  }: {
    page?: number;
    limit?: number;
    search?: string;
    status?: ReferralStatus;
    source?: string;
    campaign?: string;
    isFraud?: boolean;
  }) {
    const skip = (page - 1) * limit;

    const where: Prisma.ReferralWhereInput = {
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

    const [data, total] = await prisma.$transaction([
      prisma.referral.findMany({
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

      prisma.referral.count({
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

  async updateReferral(
    id: string,
    data: Prisma.ReferralUpdateInput
  ) {
    return prisma.referral.update({
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

  async approveReferral(
    referralId: string,
    approvedBy: string,
    rewardAmount: number
  ) {
    return prisma.referral.update({
      where: {
        id: referralId,
      },
      data: {
        status: ReferralStatus.APPROVED,
        approvedBy,
        approvedAt: new Date(),
        rewardAmount,
      },
    });
  }

  /* =========================================
     REJECT REFERRAL
  ========================================= */

  async rejectReferral(
    referralId: string,
    rejectedBy: string,
    rejectionReason: string
  ) {
    return prisma.referral.update({
      where: {
        id: referralId,
      },
      data: {
        status: ReferralStatus.REJECTED,
        rejectedBy,
        rejectedAt: new Date(),
        rejectionReason,
      },
    });
  }

  /* =========================================
     MARK AS FRAUD
  ========================================= */

  async markAsFraud(
    referralId: string,
    fraudReason: string,
    updatedBy: string
  ) {
    return prisma.referral.update({
      where: {
        id: referralId,
      },
      data: {
        status: ReferralStatus.FRAUD,
        isFraud: true,
        fraudReason,
        updatedBy,
      },
    });
  }

  /* =========================================
     MARK AS PAID
  ========================================= */

  async markAsPaid(
  referralId: string,
  rewardAmount: number,
  rewardTransactionId: string
) {
  return prisma.referral.update({
    where: {
      id: referralId,
    },
    data: {
      status: ReferralStatus.PAID,
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

  async applyReward(
    referralId: string,
    rewardAmount: number,
    rewardTransactionId?: string
  ) {
    return prisma.referral.update({
      where: {
        id: referralId,
      },
      data: {
        status: ReferralStatus.REWARDED,

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

  async expireReferral(referralId: string) {
    return prisma.referral.update({
      where: {
        id: referralId,
      },
      data: {
        status: ReferralStatus.EXPIRED,
        expiresAt: new Date(),
      },
    });
  }



  /* =========================================
     REFERRAL ANALYTICS
  ========================================= */

  async getAnalytics() {
    const [
      totalReferrals,
      pendingReferrals,
      approvedReferrals,
      rewardedReferrals,
      paidReferrals,
      rejectedReferrals,
      fraudReferrals,
      expiredReferrals,
      totalReward,
      totalPaidReward,
      totalEarnings,
    ] = await prisma.$transaction([
      prisma.referral.count(),

      prisma.referral.count({
        where: {
          status: ReferralStatus.PENDING,
        },
      }),

      prisma.referral.count({
        where: {
          status: ReferralStatus.APPROVED,
        },
      }),

      prisma.referral.count({
        where: {
          status: ReferralStatus.REWARDED,
        },
      }),

      prisma.referral.count({
        where: {
          status: ReferralStatus.PAID,
        },
      }),

      prisma.referral.count({
        where: {
          status: ReferralStatus.REJECTED,
        },
      }),

      prisma.referral.count({
        where: {
          status: ReferralStatus.FRAUD,
        },
      }),

      prisma.referral.count({
        where: {
          status: ReferralStatus.EXPIRED,
        },
      }),

      prisma.referral.aggregate({
        _sum: {
          rewardAmount: true,
        },
      }),

      prisma.referral.aggregate({
        _sum: {
          rewardPaidAmount: true,
        },
      }),

      prisma.referral.aggregate({
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

      totalReward:
        totalReward._sum.rewardAmount ?? 0,

      totalPaidReward:
        totalPaidReward._sum.rewardPaidAmount ?? 0,

      totalEarnings:
        totalEarnings._sum.totalEarnings ?? 0,
    };
  }

  /* =========================================
     LEADERBOARD
  ========================================= */

  async getLeaderboard(limit = 10) {
    return prisma.referral.findMany({
      take: limit,

      where: {
        status: {
          in: [
            ReferralStatus.REWARDED,
            ReferralStatus.PAID,
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

  async deleteReferral(id: string) {
    return prisma.referral.delete({
      where: {
        id,
      },
    });
  }

  /* =========================================
     SOFT DELETE (OPTIONAL)
  ========================================= */

  async cancelReferral(
    id: string,
    updatedBy?: string
  ) {
    return prisma.referral.update({
      where: {
        id,
      },
      data: {
        status: ReferralStatus.CANCELLED,
        updatedBy,
      },
    });
  }
}

/* =========================================
   EXPORT INSTANCE
========================================= */

const referralRepository =
  new ReferralRepository();

export default referralRepository;