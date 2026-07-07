import { prisma } from "../../prisma/prisma";

export class LeaderboardRepository {

  /* ==========================
      CREATE ENTRY
  ========================== */

  static async createEntry(data: {
    userId: string;
    leaderboardType: string;
    totalLeads?: number;
    totalLoans?: number;
    totalBusiness?: number;
    totalCommission?: number;
    score?: number;
    month?: number;
    year?: number;
  }) {

    return prisma.leaderboard.create({
      data
    });
  }

  /* ==========================
      GET ENTRY BY ID
  ========================== */

  static async getById(
    id: string
  ) {

    return prisma.leaderboard.findUnique({
      where: { id },
      include: {
        user: true
      }
    });
  }

  /* ==========================
      USER RANKINGS
  ========================== */

  static async getUserRankings(
    userId: string
  ) {

    return prisma.leaderboard.findMany({
      where: {
        userId
      },
      orderBy: {
        score: "desc"
      }
    });
  }

  /* ==========================
      TOP DSA
  ========================== */

  static async getTopDsa(
    limit = 10
  ) {

    return prisma.leaderboard.findMany({

      where: {
        leaderboardType: "DSA"
      },

      orderBy: {
        score: "desc"
      },

      take: limit,

      include: {
        user: true
      }
    });
  }

  /* ==========================
      TOP PARTNERS
  ========================== */

  static async getTopPartners(
    limit = 10
  ) {

    return prisma.leaderboard.findMany({

      where: {
        leaderboardType: "PARTNER"
      },

      orderBy: {
        score: "desc"
      },

      take: limit,

      include: {
        user: true
      }
    });
  }

  /* ==========================
      TOP REFERRERS
  ========================== */

  static async getTopReferrers(
    limit = 10
  ) {

    return prisma.leaderboard.findMany({

      orderBy: {
        totalLeads: "desc"
      },

      take: limit,

      include: {
        user: true
      }
    });
  }

  /* ==========================
      TOP COMMISSION EARNERS
  ========================== */

  static async getTopCommissionEarners(
    limit = 10
  ) {

    return prisma.leaderboard.findMany({

      orderBy: {
        totalCommission: "desc"
      },

      take: limit,

      include: {
        user: true
      }
    });
  }

  /* ==========================
      TOP BUSINESS GENERATORS
  ========================== */

  static async getTopBusinessGenerators(
    limit = 10
  ) {

    return prisma.leaderboard.findMany({

      orderBy: {
        totalBusiness: "desc"
      },

      take: limit,

      include: {
        user: true
      }
    });
  }

  /* ==========================
      MONTHLY LEADERBOARD
  ========================== */

  static async getMonthlyLeaderboard(
    month: number,
    year: number
  ) {

    return prisma.leaderboard.findMany({

      where: {
        month,
        year
      },

      orderBy: {
        score: "desc"
      },

      include: {
        user: true
      }
    });
  }

  /* ==========================
      UPDATE SCORE
  ========================== */

  static async updateScore(
    id: string,
    score: number
  ) {

    return prisma.leaderboard.update({
      where: {
        id
      },
      data: {
        score
      }
    });
  }

  /* ==========================
      UPDATE RANK
  ========================== */

  static async updateRank(
    id: string,
    rank: number
  ) {

    return prisma.leaderboard.update({
      where: {
        id
      },
      data: {
        rank
      }
    });
  }

  /* ==========================
      DELETE ENTRY
  ========================== */

  static async deleteEntry(
    id: string
  ) {

    return prisma.leaderboard.delete({
      where: {
        id
      }
    });
  }

  /* ==========================
      RECALCULATE RANKS
  ========================== */

  static async recalculateRanks() {

    const records =
      await prisma.leaderboard.findMany({

        orderBy: {
          score: "desc"
        }
      });

    const updates =
      records.map((item, index) => {

        return prisma.leaderboard.update({
          where: {
            id: item.id
          },
          data: {
            rank: index + 1
          }
        });
      });

    return prisma.$transaction(updates);
  }

  /* ==========================
      GET ALL LEADERBOARD
  ========================== */

  static async getAll(
    page = 1,
    limit = 20
  ) {

    const skip =
      (page - 1) * limit;

    const [records, total] =
      await Promise.all([

        prisma.leaderboard.findMany({
          skip,
          take: limit,
          include: {
            user: true
          },
          orderBy: {
            score: "desc"
          }
        }),

        prisma.leaderboard.count()
      ]);

    return {
      total,
      page,
      limit,
      records
    };
  }

  /* ==========================
      LEADERBOARD ANALYTICS
  ========================== */

  static async getAnalytics() {

    const [
      totalEntries,
      totalBusiness,
      totalCommission,
      totalLeads
    ] = await Promise.all([

      prisma.leaderboard.count(),

      prisma.leaderboard.aggregate({
        _sum: {
          totalBusiness: true
        }
      }),

      prisma.leaderboard.aggregate({
        _sum: {
          totalCommission: true
        }
      }),

      prisma.leaderboard.aggregate({
        _sum: {
          totalLeads: true
        }
      })
    ]);

    return {
      totalEntries,

      totalBusiness:
        totalBusiness._sum.totalBusiness || 0,

      totalCommission:
        totalCommission._sum.totalCommission || 0,

      totalLeads:
        totalLeads._sum.totalLeads || 0
    };
  }
}