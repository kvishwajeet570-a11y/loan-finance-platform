import prisma from "../../prisma/prisma";

export class UserRepository {

  /* ==========================
     GET ALL USERS
  ========================== */

  static async getAllUsers(
    page = 1,
    limit = 20,
    search = "",
    role?: string
  ) {

    const skip = (page - 1) * limit;

    const where: any = {};

    if (role) {
      where.role = role;
    }

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          phoneNo: {
            contains: search,
          },
        },
      ];
    }

    const [users, total] =
      await Promise.all([

        prisma.user.findMany({
          where,
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
            role: true,
            isVerified: true,
            isBlocked: true,
            createdAt: true,
          },
        }),

        prisma.user.count({
          where,
        }),
      ]);

    return {
      users,
      total,
      page,
      limit,
      totalPages:
        Math.ceil(total / limit),
    };
  }

  /* ==========================
     GET USER BY ID
  ========================== */

  static async getUserById(
    userId: string
  ) {

    return prisma.user.findUnique({

      where: {
        id: userId,
      },

      include: {
        loans: true,
      },
    });
  }

  /* ==========================
     BLOCK USER
  ========================== */

  static async blockUser(
    userId: string
  ) {

    return prisma.user.update({

      where: {
        id: userId,
      },

      data: {
        isBlocked: true,
      },
    });
  }

  /* ==========================
     UNBLOCK USER
  ========================== */

  static async unblockUser(
    userId: string
  ) {

    return prisma.user.update({

      where: {
        id: userId,
      },

      data: {
        isBlocked: false,
      },
    });
  }

  /* ==========================
     VERIFY USER
  ========================== */

  static async verifyUser(
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
     UNVERIFY USER
  ========================== */

  static async unverifyUser(
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
     DELETE USER
  ========================== */

  static async deleteUser(
    userId: string
  ) {

    return prisma.user.delete({

      where: {
        id: userId,
      },
    });
  }

  /* ==========================
     RECENT USERS
  ========================== */

  static async getRecentUsers(
    limit = 10
  ) {

    return prisma.user.findMany({

      take: limit,

      orderBy: {
        createdAt: "desc",
      },

      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  /* ==========================
     USER ANALYTICS
  ========================== */

  static async getUserAnalytics() {

    const [
      totalUsers,
      verifiedUsers,
      blockedUsers,
      customers,
      dsas,
      partners,
      admins,
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

      prisma.user.count({
        where: {
          role: "CUSTOMER",
        },
      }),

      prisma.user.count({
        where: {
          role: "DSA",
        },
      }),

      prisma.user.count({
        where: {
          role: "PARTNER",
        },
      }),

      prisma.user.count({
        where: {
          role: "ADMIN",
        },
      }),
    ]);

    return {
      totalUsers,
      verifiedUsers,
      blockedUsers,
      customers,
      dsas,
      partners,
      admins,
    };
  }

  /* ==========================
     ROLE WISE USERS
  ========================== */

  static async getUsersByRole(
    role: string
  ) {

    return prisma.user.findMany({

      where: {
        role,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }
}