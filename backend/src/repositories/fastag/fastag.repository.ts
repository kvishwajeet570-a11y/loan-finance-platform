import { prisma } from "../../prisma/prisma";

export class FastagRepository {

  /* ==========================
      CREATE FASTAG
  ========================== */

  static async createFastag(data: {
    userId: string;
    vehicleNumber: string;
    chassisNumber?: string;
    fastagNumber: string;
    provider: string;
  }) {

    return prisma.fastag.create({
      data
    });
  }

  /* ==========================
      GET FASTAG BY ID
  ========================== */

  static async getById(
    fastagId: string
  ) {

    return prisma.fastag.findUnique({
      where: {
        id: fastagId
      },
      include: {
        user: true
      }
    });
  }

  /* ==========================
      GET BY VEHICLE NUMBER
  ========================== */

  static async getByVehicleNumber(
    vehicleNumber: string
  ) {

    return prisma.fastag.findUnique({
      where: {
        vehicleNumber
      }
    });
  }

  /* ==========================
      GET BY FASTAG NUMBER
  ========================== */

  static async getByFastagNumber(
    fastagNumber: string
  ) {

    return prisma.fastag.findUnique({
      where: {
        fastagNumber
      }
    });
  }

  /* ==========================
      USER FASTAGS
  ========================== */

  static async getUserFastags(
    userId: string
  ) {

    return prisma.fastag.findMany({
      where: {
        userId
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  /* ==========================
      UPDATE FASTAG
  ========================== */

  static async updateFastag(
    fastagId: string,
    data: Partial<{
      provider: string;
      status: string;
      walletBalance: number;
    }>
  ) {

    return prisma.fastag.update({
      where: {
        id: fastagId
      },
      data
    });
  }

  /* ==========================
      VERIFY KYC
  ========================== */

  static async verifyKyc(
    fastagId: string
  ) {

    return prisma.fastag.update({
      where: {
        id: fastagId
      },
      data: {
        kycVerified: true
      }
    });
  }

  /* ==========================
      CREDIT WALLET
  ========================== */

  static async creditWallet(
    fastagId: string,
    amount: number
  ) {

    return prisma.fastag.update({
      where: {
        id: fastagId
      },
      data: {
        walletBalance: {
          increment: amount
        }
      }
    });
  }

  /* ==========================
      DEBIT WALLET
  ========================== */

  static async debitWallet(
    fastagId: string,
    amount: number
  ) {

    return prisma.fastag.update({
      where: {
        id: fastagId
      },
      data: {
        walletBalance: {
          decrement: amount
        }
      }
    });
  }

  /* ==========================
      BLOCK FASTAG
  ========================== */

  static async blockFastag(
    fastagId: string
  ) {

    return prisma.fastag.update({
      where: {
        id: fastagId
      },
      data: {
        status: "BLOCKED"
      }
    });
  }

  /* ==========================
      ACTIVATE FASTAG
  ========================== */

  static async activateFastag(
    fastagId: string
  ) {

    return prisma.fastag.update({
      where: {
        id: fastagId
      },
      data: {
        status: "ACTIVE"
      }
    });
  }

  /* ==========================
      DELETE FASTAG
  ========================== */

  static async deleteFastag(
    fastagId: string
  ) {

    return prisma.fastag.delete({
      where: {
        id: fastagId
      }
    });
  }

  /* ==========================
      SEARCH FASTAGS
  ========================== */

  static async searchFastags(
    keyword: string
  ) {

    return prisma.fastag.findMany({
      where: {
        OR: [
          {
            vehicleNumber: {
              contains: keyword,
              mode: "insensitive"
            }
          },
          {
            fastagNumber: {
              contains: keyword,
              mode: "insensitive"
            }
          },
          {
            provider: {
              contains: keyword,
              mode: "insensitive"
            }
          }
        ]
      }
    });
  }

  /* ==========================
      GET ALL FASTAGS
  ========================== */

  static async getAllFastags(
    page = 1,
    limit = 20
  ) {

    const skip =
      (page - 1) * limit;

    const [records, total] =
      await Promise.all([

        prisma.fastag.findMany({
          skip,
          take: limit,
          orderBy: {
            createdAt: "desc"
          },
          include: {
            user: true
          }
        }),

        prisma.fastag.count()
      ]);

    return {
      total,
      page,
      limit,
      records
    };
  }

  /* ==========================
      FASTAG ANALYTICS
  ========================== */

  static async getAnalytics() {

    const [
      totalFastags,
      activeFastags,
      blockedFastags,
      kycVerified
    ] = await Promise.all([

      prisma.fastag.count(),

      prisma.fastag.count({
        where: {
          status: "ACTIVE"
        }
      }),

      prisma.fastag.count({
        where: {
          status: "BLOCKED"
        }
      }),

      prisma.fastag.count({
        where: {
          kycVerified: true
        }
      })
    ]);

    return {
      totalFastags,
      activeFastags,
      blockedFastags,
      kycVerified
    };
  }

  /* ==========================
      PROVIDER ANALYTICS
  ========================== */

  static async providerAnalytics() {

    return prisma.fastag.groupBy({
      by: ["provider"],
      _count: {
        provider: true
      }
    });
  }
}