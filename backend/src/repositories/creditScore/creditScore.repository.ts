import { prisma } from "../../prisma/prisma";

export class CreditScoreHistoryRepository {

  /* ==========================
      CREATE SCORE RECORD
  ========================== */

  static async createScoreHistory(data: {
    userId: string;
    bureauType: string;
    score: number;
    scoreBand?: string;
    reportNumber?: string;
    enquiryDate?: Date;
    remarks?: string;
    scoreChange?: number;
  }) {

    return prisma.creditScoreHistory.create({
      data: {
        ...data,
        enquiryDate:
          data.enquiryDate || new Date()
      }
    });
  }

  /* ==========================
      GET BY ID
  ========================== */

  static async getById(
    id: string
  ) {

    return prisma.creditScoreHistory.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNo: true
          }
        }
      }
    });
  }

  /* ==========================
      USER SCORE HISTORY
  ========================== */

  static async getUserScoreHistory(
    userId: string
  ) {

    return prisma.creditScoreHistory.findMany({
      where: { userId },
      orderBy: {
        enquiryDate: "desc"
      }
    });
  }

  /* ==========================
      LATEST SCORE
  ========================== */

  static async getLatestScore(
    userId: string
  ) {

    return prisma.creditScoreHistory.findFirst({
      where: { userId },
      orderBy: {
        enquiryDate: "desc"
      }
    });
  }

  /* ==========================
      SCORE TREND
  ========================== */

  static async getScoreTrend(
    userId: string
  ) {

    return prisma.creditScoreHistory.findMany({
      where: { userId },
      orderBy: {
        enquiryDate: "asc"
      },
      select: {
        score: true,
        enquiryDate: true,
        bureauType: true
      }
    });
  }

  /* ==========================
      SCORE RANGE FILTER
  ========================== */

  static async getScoresByRange(
    min: number,
    max: number
  ) {

    return prisma.creditScoreHistory.findMany({
      where: {
        score: {
          gte: min,
          lte: max
        }
      }
    });
  }

  /* ==========================
      BUREAU WISE SCORES
  ========================== */

  static async getBureauScores(
    bureauType: string
  ) {

    return prisma.creditScoreHistory.findMany({
      where: {
        bureauType
      },
      orderBy: {
        enquiryDate: "desc"
      }
    });
  }

  /* ==========================
      UPDATE RECORD
  ========================== */

  static async updateRecord(
    id: string,
    data: Partial<{
      score: number;
      scoreBand: string;
      remarks: string;
      scoreChange: number;
    }>
  ) {

    return prisma.creditScoreHistory.update({
      where: { id },
      data
    });
  }

  /* ==========================
      DELETE RECORD
  ========================== */

  static async deleteRecord(
    id: string
  ) {

    return prisma.creditScoreHistory.delete({
      where: { id }
    });
  }

  /* ==========================
      ADMIN ALL RECORDS
  ========================== */

  static async getAllRecords(
    page = 1,
    limit = 20
  ) {

    const skip =
      (page - 1) * limit;

    const [records, total] =
      await Promise.all([

        prisma.creditScoreHistory.findMany({
          skip,
          take: limit,
          orderBy: {
            enquiryDate: "desc"
          },
          include: {
            user: true
          }
        }),

        prisma.creditScoreHistory.count()
      ]);

    return {
      total,
      page,
      limit,
      records
    };
  }

  /* ==========================
      CREDIT SCORE ANALYTICS
  ========================== */

  static async getAnalytics() {

    const [
      totalRecords,
      avgScore,
      highestScore,
      lowestScore
    ] = await Promise.all([

      prisma.creditScoreHistory.count(),

      prisma.creditScoreHistory.aggregate({
        _avg: {
          score: true
        }
      }),

      prisma.creditScoreHistory.aggregate({
        _max: {
          score: true
        }
      }),

      prisma.creditScoreHistory.aggregate({
        _min: {
          score: true
        }
      })
    ]);

    return {
      totalRecords,

      averageScore:
        avgScore._avg.score || 0,

      highestScore:
        highestScore._max.score || 0,

      lowestScore:
        lowestScore._min.score || 0
    };
  }

  /* ==========================
      SCORE DISTRIBUTION
  ========================== */

  static async getScoreDistribution() {

    return {
      poor: await prisma.creditScoreHistory.count({
        where: {
          score: {
            lt: 600
          }
        }
      }),

      fair: await prisma.creditScoreHistory.count({
        where: {
          score: {
            gte: 600,
            lt: 700
          }
        }
      }),

      good: await prisma.creditScoreHistory.count({
        where: {
          score: {
            gte: 700,
            lt: 750
          }
        }
      }),

      excellent: await prisma.creditScoreHistory.count({
        where: {
          score: {
            gte: 750
          }
        }
      })
    };
  }

  /* ==========================
      TOP CREDIT USERS
  ========================== */

  static async getTopCreditUsers() {

    return prisma.creditScoreHistory.findMany({
      orderBy: {
        score: "desc"
      },
      take: 10,
      include: {
        user: true
      }
    });
  }
}