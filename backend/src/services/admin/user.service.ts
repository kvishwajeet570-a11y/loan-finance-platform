import prisma from "../../prisma/prisma";

class UserService {
  async getAllUsers() {
    return prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async blockUser(id: string) {
    return prisma.user.update({
      where: { id },
      data: {
        isBlocked: true,
      },
    });
  }

  async unblockUser(id: string) {
    return prisma.user.update({
      where: { id },
      data: {
        isBlocked: false,
      },
    });
  }

  async getUserStats() {
    const [
      totalUsers,
      verifiedUsers,
      blockedUsers,
    ] = await Promise.all([
      prisma.user.count(),

      prisma.user.count({
        where: {
          isVerified: true,
        },
      }),

      prisma.user.count({
        where: {
          isBlocked: true,
        },
      }),
    ]);

    return {
      totalUsers,
      verifiedUsers,
      blockedUsers,
    };
  }
}

export default new UserService();