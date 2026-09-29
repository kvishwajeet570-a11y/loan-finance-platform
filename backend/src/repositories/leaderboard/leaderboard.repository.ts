import prisma from "../../prisma/prisma";

export class LeaderboardRepository {
  /* ==========================
      CREATE ENTRY
  ========================== */

  static async createEntry(data: {
    userName: string;
    totalPoints?: number;
    totalSales?: number;
  }) {
    return prisma.leaderboard.create({
      data: {
        userName: data.userName,
        totalPoints: data.totalPoints ?? 0,
        totalSales: data.totalSales ?? 0,
      },
    });
  }

  /* ==========================
      GET BY ID
  ========================== */

  static async getById(id: string) {
    return prisma.leaderboard.findUnique({
      where: { id },
    });
  }

  /* ==========================
      GET TOP USERS
  ========================== */

  static async getTopUsers(limit = 10) {
    return prisma.leaderboard.findMany({
      orderBy: {
        totalPoints: "desc",
      },
      take: limit,
    });
  }

  /* ==========================
      UPDATE POINTS
  ========================== */

  static async updatePoints(
    id: string,
    totalPoints: number
  ) {
    return prisma.leaderboard.update({
      where: { id },
      data: {
        totalPoints,
      },
    });
  }

  /* ==========================
      UPDATE SALES
  ========================== */

  static async updateSales(
    id: string,
    totalSales: number
  ) {
    return prisma.leaderboard.update({
      where: { id },
      data: {
        totalSales,
      },
    });
  }

  /* ==========================
      DELETE ENTRY
  ========================== */

  static async deleteEntry(id: string) {
    return prisma.leaderboard.delete({
      where: { id },
    });
  }

  /* ==========================
      GET ALL
  ========================== */

  static async getAll(
    page = 1,
    limit = 20
  ) {
    const skip = (page - 1) * limit;

    const [records, total] =
      await Promise.all([
        prisma.leaderboard.findMany({
          skip,
          take: limit,
          orderBy: {
            totalPoints: "desc",
          },
        }),

        prisma.leaderboard.count(),
      ]);

    return {
      total,
      page,
      limit,
      records,
    };
  }

  /* ==========================
      ANALYTICS
  ========================== */

  static async getAnalytics() {
    const [
      totalEntries,
      totalPoints,
      totalSales,
    ] = await Promise.all([
      prisma.leaderboard.count(),

      prisma.leaderboard.aggregate({
        _sum: {
          totalPoints: true,
        },
      }),

      prisma.leaderboard.aggregate({
        _sum: {
          totalSales: true,
        },
      }),
    ]);

    return {
      totalEntries,

      totalPoints:
        totalPoints._sum.totalPoints ?? 0,

      totalSales:
        totalSales._sum.totalSales ?? 0,
    };
  }
}

export default LeaderboardRepository;