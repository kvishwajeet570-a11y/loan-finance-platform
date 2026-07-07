import prisma from "../../prisma/prisma";

class KYCService {
  async getAllKYC() {
    return prisma.user.findMany({
      where: {
        isVerified: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getPendingKYC() {
    return prisma.user.findMany({
      where: {
        isVerified: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async verifyKYC(userId: string) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isVerified: true,
      },
    });
  }

  async rejectKYC(userId: string) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isVerified: false,
      },
    });
  }

  async getKYCStats() {
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
    };
  }
}

export default new KYCService();