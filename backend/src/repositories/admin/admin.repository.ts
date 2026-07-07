import { prisma } from "../../prisma/prisma";

export class AdminRepository {

  /* =========================
     DASHBOARD STATS
  ========================= */

  static async getDashboardStats() {
    const [
      totalUsers,
      totalLoans,
      totalApprovedLoans,
      totalRejectedLoans,
      totalPendingLoans,
      totalVerifiedUsers,
      totalBlockedUsers,
      totalDisbursedAmount,
    ] = await Promise.all([

      prisma.user.count(),

      prisma.loanApplication.count(),

      prisma.loanApplication.count({
        where: {
          status: "APPROVED",
        },
      }),

      prisma.loanApplication.count({
        where: {
          status: "REJECTED",
        },
      }),

      prisma.loanApplication.count({
        where: {
          status: "PENDING",
        },
      }),

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

      prisma.loanApplication.aggregate({
        _sum: {
          amount: true,
        },
      }),
    ]);

    return {
      totalUsers,
      totalLoans,
      totalApprovedLoans,
      totalRejectedLoans,
      totalPendingLoans,
      totalVerifiedUsers,
      totalBlockedUsers,
      totalDisbursedAmount:
        totalDisbursedAmount._sum.amount || 0,
    };
  }

  /* =========================
     USER MANAGEMENT
  ========================= */

  static async getUsers(
    page = 1,
    limit = 20,
    search = ""
  ) {

    const skip =
      (page - 1) * limit;

    const where = search
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
      limit,
      totalPages:
        Math.ceil(total / limit),
    };
  }

  /* =========================
     USER DETAILS
  ========================= */

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

  /* =========================
     BLOCK USER
  ========================= */

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

  /* =========================
     UNBLOCK USER
  ========================= */

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

  /* =========================
     VERIFY USER
  ========================= */

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

  /* =========================
     RECENT LOANS
  ========================= */

  static async getRecentLoans(
    limit = 10
  ) {

    return prisma.loanApplication.findMany({

      take: limit,

      orderBy: {
        createdAt: "desc",
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNo: true,
          },
        },
      },
    });
  }

  /* =========================
     LOAN DETAILS
  ========================= */

  static async getLoanById(
    loanId: string
  ) {

    return prisma.loanApplication.findUnique({

      where: {
        id: loanId,
      },

      include: {
        user: true,
      },
    });
  }

  /* =========================
     APPROVE LOAN
  ========================= */

  static async approveLoan(
    loanId: string
  ) {

    return prisma.loanApplication.update({

      where: {
        id: loanId,
      },

      data: {
        status: "APPROVED",
      },
    });
  }

  /* =========================
     REJECT LOAN
  ========================= */

  static async rejectLoan(
    loanId: string
  ) {

    return prisma.loanApplication.update({

      where: {
        id: loanId,
      },

      data: {
        status: "REJECTED",
      },
    });
  }
}