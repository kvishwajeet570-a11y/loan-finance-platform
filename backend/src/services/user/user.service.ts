import prisma from "../../prisma/prisma";

class UserService {

  /**
   * Get User By ID
   */
  async getUserById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },

      include: {
        wallet: true,
        loans: true,
      },
    });
  }

  /**
   * Get User Profile
   */
  async getProfile(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },

      select: {
        id: true,
        name: true,
        email: true,
        phoneNo: true,
        role: true,
        profileImage: true,
        isVerified: true,
        isBlocked: true,
        address: true,
        city: true,
        state: true,
        pincode: true,
        dob: true,
        createdAt: true,
      },
    });
  }

  /**
   * Update Profile
   */
  async updateProfile(
    userId: string,
    data: any
  ) {

    return prisma.user.update({
      where: { id: userId },

      data: {
        name: data.name,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        dob: data.dob,
      },
    });
  }

  /**
   * User Listing
   */
  async getUsers(
    page = 1,
    limit = 20,
    search = ""
  ) {

    const skip =
      (page - 1) * limit;

    const where: any = search
      ? {
          OR: [
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
          ],
        }
      : {};

    const [users, total] =
      await Promise.all([
        prisma.user.findMany({
          where,

          skip,
          take: limit,

          orderBy: {
            createdAt: "desc",
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
      pages: Math.ceil(
        total / limit
      ),
    };
  }

  /**
   * Block User
   */
  async blockUser(
    userId: string
  ) {
    return prisma.user.update({
      where: { id: userId },

      data: {
        isBlocked: true,
      },
    });
  }

  /**
   * Unblock User
   */
  async unblockUser(
    userId: string
  ) {
    return prisma.user.update({
      where: { id: userId },

      data: {
        isBlocked: false,
      },
    });
  }

  /**
   * Activate User
   */
  async activateUser(
    userId: string
  ) {
    return prisma.user.update({
      where: { id: userId },

      data: {
        isActive: true,
      },
    });
  }

  /**
   * Deactivate User
   */
  async deactivateUser(
    userId: string
  ) {
    return prisma.user.update({
      where: { id: userId },

      data: {
        isActive: false,
      },
    });
  }

  /**
   * Change Role
   */
  async changeRole(
    userId: string,
    role: string
  ) {
    return prisma.user.update({
      where: { id: userId },

      data: { role },
    });
  }

  /**
   * User Dashboard
   */
  async userDashboard(
    userId: string
  ) {

    const [
      user,
      loanCount,
      wallet,
      referrals,
      commissions,
    ] = await Promise.all([

      prisma.user.findUnique({
        where: {
          id: userId,
        },
      }),

      prisma.loanApplication.count({
        where: {
          userId,
        },
      }),

      prisma.wallet.findUnique({
        where: {
          userId,
        },
      }),

      prisma.referral.count({
        where: {
          referrerId:
            userId,
        },
      }),

      prisma.commission.aggregate({
        where: {
          userId,
        },

        _sum: {
          amount: true,
        },
      }),
    ]);

    return {
      user,
      loanCount,

      walletBalance:
        wallet?.balance || 0,

      totalReferrals:
        referrals,

      totalCommission:
        commissions._sum
          .amount || 0,
    };
  }

  /**
   * Profile Completion
   */
  async profileCompletion(
    userId: string
  ) {

    const user =
      await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

    if (!user) {
      throw new Error(
        "User not found"
      );
    }

    let score = 0;

    if (user.name) score += 15;
    if (user.email) score += 15;
    if (user.phoneNo) score += 15;
    if (user.profileImage)
      score += 15;
    if (user.address)
      score += 10;
    if (user.city)
      score += 10;
    if (user.state)
      score += 10;
    if (user.pincode)
      score += 5;
    if (user.dob)
      score += 5;

    return {
      completion:
        Math.min(score, 100),
    };
  }

  /**
   * User Statistics
   */
  async userStats() {

    const [
      totalUsers,
      verifiedUsers,
      blockedUsers,
      activeUsers,
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
          isActive: true,
        },
      }),
    ]);

    return {
      totalUsers,
      verifiedUsers,
      blockedUsers,
      activeUsers,
    };
  }

  /**
   * User Growth Report
   */
  async monthlyGrowth() {

    const year =
      new Date().getFullYear();

    return prisma.$queryRaw`
      SELECT
      EXTRACT(MONTH FROM "createdAt") as month,
      COUNT(*) as total_users
      FROM "User"
      WHERE EXTRACT(YEAR FROM "createdAt") = ${year}
      GROUP BY month
      ORDER BY month ASC
    `;
  }

  /**
   * Delete User
   */
  async deleteUser(
    userId: string
  ) {

    return prisma.$transaction(
      async (tx) => {

        await tx.loanApplication.deleteMany({
          where: {
            userId,
          },
        });

        await tx.transaction.deleteMany({
          where: {
            userId,
          },
        });

        await tx.notification.deleteMany({
          where: {
            userId,
          },
        });

        return tx.user.delete({
          where: {
            id: userId,
          },
        });
      }
    );
  }

  /**
   * Recent Users
   */
  async recentUsers() {
    return prisma.user.findMany({
      take: 20,

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
}

export default new UserService();