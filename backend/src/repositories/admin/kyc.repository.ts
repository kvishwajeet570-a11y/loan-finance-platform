import { prisma } from "../../prisma/prisma";

export class KycRepository {

  /* ==========================
     GET ALL KYC RECORDS
  ========================== */

  static async getAllKyc(
    page = 1,
    limit = 20
  ) {

    const skip =
      (page - 1) * limit;

    const [records, total] =
      await Promise.all([

        prisma.user.findMany({
          skip,
          take: limit,

          orderBy: {
            createdAt: "desc",
          },

          select: {
            id: true,
            name: true,
            email: true,
            phoneNo: true,
            isVerified: true,
            createdAt: true,
          },
        }),

        prisma.user.count(),
      ]);

    return {
      records,
      total,
      page,
      limit,
      totalPages:
        Math.ceil(total / limit),
    };
  }

  /* ==========================
     PENDING KYC
  ========================== */

  static async getPendingKyc() {

    return prisma.user.findMany({

      where: {
        isVerified: false,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /* ==========================
     VERIFIED USERS
  ========================== */

  static async getVerifiedUsers() {

    return prisma.user.findMany({

      where: {
        isVerified: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /* ==========================
     USER KYC DETAILS
  ========================== */

  static async getUserKyc(
    userId: string
  ) {

    return prisma.user.findUnique({

      where: {
        id: userId,
      },

      select: {
        id: true,
        name: true,
        email: true,
        phoneNo: true,
        isVerified: true,
        createdAt: true,
      },
    });
  }

  /* ==========================
     VERIFY USER
  ========================== */

  static async verifyKyc(
    userId: string
  ) {

    return prisma.user.update({

      where: {
        id: userId,
      },

      data: {
        isVerified: true,
      },
    });
  }

  /* ==========================
     REJECT KYC
  ========================== */

  static async rejectKyc(
    userId: string
  ) {

    return prisma.user.update({

      where: {
        id: userId,
      },

      data: {
        isVerified: false,
      },
    });
  }

  /* ==========================
     KYC ANALYTICS
  ========================== */

  static async getKycStats() {

    const [
      totalUsers,
      verifiedUsers,
      pendingUsers,
    ] = await Promise.all([

      prisma.user.count(),

      prisma.user.count({
        where: {
          isVerified: true,
        },
      }),

      prisma.user.count({
        where: {
          isVerified: false,
        },
      }),
    ]);

    return {
      totalUsers,
      verifiedUsers,
      pendingUsers,
      verificationRate:
        totalUsers > 0
          ? (
              (verifiedUsers /
                totalUsers) *
              100
            ).toFixed(2)
          : 0,
    };
  }

  /* ==========================
     SEARCH KYC USERS
  ========================== */

  static async searchUsers(
    keyword: string
  ) {

    return prisma.user.findMany({

      where: {
        OR: [
          {
            name: {
              contains: keyword,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: keyword,
              mode: "insensitive",
            },
          },
          {
            phoneNo: {
              contains: keyword,
            },
          },
        ],
      },

      take: 20,
    });
  }
}