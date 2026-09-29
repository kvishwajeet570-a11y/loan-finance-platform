import prisma from "../../prisma/prisma";
import {
  LoanStatus,
} from "@prisma/client";

class LeaderboardService {
  async getTopDSAByCommission(limit = 10) {
    return prisma.commission.groupBy({
      by: ["userId"],

      _sum: {
        commissionAmount: true,
      },

      _count: {
        id: true,
      },

      orderBy: {
        _sum: {
          commissionAmount: "desc",
        },
      },

      take: limit,
    });
  }

  async getTopLoanClosers(limit = 10) {
    return prisma.loanApplication.groupBy({
      by: ["assignedTo"],

      where: {
        status: LoanStatus.APPROVED,
      },

      _count: {
        id: true,
      },

      orderBy: {
        _count: {
          id: "desc",
        },
      },

      take: limit,
    });
  }

  async getTopReferralEarners(limit = 10) {
    return prisma.referral.groupBy({
      by: ["referrerId"],

      _sum: {
        rewardAmount: true,
      },

      orderBy: {
        _sum: {
          rewardAmount: "desc",
        },
      },

      take: limit,
    });
  }

  async getTopInsuranceAgents(limit = 10) {
    return prisma.insuranceApplication.groupBy({
      by: ["agentId"],

      where: {
        status: "APPROVED",
      },

      _count: {
        id: true,
      },

      orderBy: {
        _count: {
          id: "desc",
        },
      },

      take: limit,
    });
  }

  async getTopInvestors(limit = 10) {
    return prisma.userInvestment.groupBy({
      by: ["userId"],

      _sum: {
        amount: true,
      },

      orderBy: {
        _sum: {
          amount: "desc",
        },
      },

      take: limit,
    });
  }

  async getMonthlyLeaderboard() {
    const startDate = new Date();
    startDate.setDate(1);

    return prisma.commission.groupBy({
      by: ["userId"],

      where: {
        status: "APPROVED" ,

        createdAt: {
          gte: startDate,
        },
      },

      _sum: {
        commissionAmount: true,
      },

      orderBy: {
        _sum: {
          commissionAmount: "desc",
        },
      },

      take: 20,
    });
  }

  async getWeeklyLeaderboard() {
    const date = new Date();
    date.setDate(date.getDate() - 7);

    return prisma.commission.groupBy({
      by: ["userId"],

      where: {
        status: "APPROVED",

        createdAt: {
          gte: date,
        },
      },

      _sum: {
        commissionAmount: true,
      },

      orderBy: {
        _sum: {
          commissionAmount: "desc",
        },
      },

      take: 20,
    });
  }

  async getTodayLeaderboard() {
    const start = new Date();

    start.setHours(0, 0, 0, 0);

    return prisma.commission.groupBy({
      by: ["userId"],

      where: {
        status: "APPROVED",

        createdAt: {
          gte: start,
        },
      },

      _sum: {
        commissionAmount: true,
      },

      orderBy: {
        _sum: {
          commissionAmount: "desc",
        },
      },

      take: 20,
    });
  }

  async getUserRank(userId: string) {
    const leaderboard =
      await prisma.commission.groupBy({
        by: ["userId"],

        where: {
          status: "APPROVED",
        },

        _sum: {
          commissionAmount: true,
        },

        orderBy: {
          _sum: {
            commissionAmount: "desc",
          },
        },
      });

    const rank =
      leaderboard.findIndex(
        (item) => item.userId === userId
      ) + 1;

    return {
      rank,
      totalParticipants:
        leaderboard.length,
    };
  }

  async getLeaderboardStats() {
    const [
      totalDSA,
      totalCommission,
      totalReferrals,
      totalInvestments,
    ] = await Promise.all([
      prisma.user.count({
        where: {
          role: "DSA",
        },
      }),

      prisma.commission.aggregate({
        _sum: {
          commissionAmount: true,
        },
      }),

      prisma.referral.count(),

      prisma.userInvestment.aggregate({
        _sum: {
          amount: true,
        },
      }),
    ]);

    return {
      totalDSA,

      totalCommission:
        totalCommission._sum
          .commissionAmount || 0,

      totalReferrals,

      totalInvestment:
        totalInvestments._sum
          .amount || 0,
    };
  }

  async getCompleteLeaderboard() {
    const [
      topDSA,
      topReferral,
      topInvestors,
      monthly,
    ] = await Promise.all([
      this.getTopDSAByCommission(),
      this.getTopReferralEarners(),
      this.getTopInvestors(),
      this.getMonthlyLeaderboard(),
    ]);

    return {
      topDSA,
      topReferral,
      topInvestors,
      monthly,
    };
  }
}

export default new LeaderboardService();