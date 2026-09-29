import prisma from "../../prisma/prisma";

export class KycRepository {
  /* ==========================
      CREATE KYC
  ========================== */

  static async createKyc(data: {
    userId: string;
    fullName: string;
    panNumber: string;
    dob: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    expiryDate?: Date;
  }) {
    return prisma.kYC.create({
      data,
    });
  }

  /* ==========================
      GET KYC BY ID
  ========================== */

  static async getById(kycId: string) {
    return prisma.kYC.findUnique({
      where: {
        id: kycId,
      },
      include: {
        user: true,
      },
    });
  }

  /* ==========================
      GET USER KYC
  ========================== */

  static async getUserKyc(userId: string) {
    return prisma.kYC.findUnique({
      where: {
        userId,
      },
      include: {
        user: true,
      },
    });
  }

  /* ==========================
      APPROVE KYC
  ========================== */

  static async approveKyc(
    userId: string,
    adminId: string
  ) {
    return prisma.kYC.update({
      where: {
        userId,
      },
      data: {
        status: "APPROVED",
        approvedBy: adminId,
        approvedAt: new Date(),
      },
    });
  }

  /* ==========================
      REJECT KYC
  ========================== */

  static async rejectKyc(
    userId: string,
    reason: string
  ) {
    return prisma.kYC.update({
      where: {
        userId,
      },
      data: {
        status: "REJECTED",
        rejectionReason: reason,
      },
    });
  }

  /* ==========================
      PENDING KYC
  ========================== */

  static async getPendingKyc() {
    return prisma.kYC.findMany({
      where: {
        status: "PENDING",
      },
      include: {
        user: true,
      },
    });
  }

  /* ==========================
      APPROVED KYC
  ========================== */

  static async getApprovedKyc() {
    return prisma.kYC.findMany({
      where: {
        status: "APPROVED",
      },
      include: {
        user: true,
      },
    });
  }

  /* ==========================
      REJECTED KYC
  ========================== */

  static async getRejectedKyc() {
    return prisma.kYC.findMany({
      where: {
        status: "REJECTED",
      },
      include: {
        user: true,
      },
    });
  }

  /* ==========================
      SEARCH KYC
  ========================== */

  static async searchKyc(
    keyword: string
  ) {
    return prisma.kYC.findMany({
      where: {
        OR: [
          {
            fullName: {
              contains: keyword,
              mode: "insensitive",
            },
          },
          {
            panNumber: {
              contains: keyword,
              mode: "insensitive",
            },
          },
        ],
      },
      include: {
        user: true,
      },
    });
  }

  /* ==========================
      ALL KYC
  ========================== */

  static async getAllKyc(
    page = 1,
    limit = 20
  ) {
    const skip = (page - 1) * limit;

    const [records, total] =
      await Promise.all([
        prisma.kYC.findMany({
          skip,
          take: limit,
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        }),

        prisma.kYC.count(),
      ]);

    return {
      total,
      page,
      limit,
      records,
    };
  }

  /* ==========================
      KYC ANALYTICS
  ========================== */

  static async getAnalytics() {
    const [
      totalKyc,
      approved,
      pending,
      rejected,
    ] = await Promise.all([
      prisma.kYC.count(),

      prisma.kYC.count({
        where: {
          status: "APPROVED",
        },
      }),

      prisma.kYC.count({
        where: {
          status: "PENDING",
        },
      }),

      prisma.kYC.count({
        where: {
          status: "REJECTED",
        },
      }),
    ]);

    return {
      totalKyc,
      approved,
      pending,
      rejected,
    };
  }

  /* ==========================
      DELETE KYC
  ========================== */

  static async deleteKyc(id: string) {
    return prisma.kYC.delete({
      where: {
        id,
      },
    });
  }
}