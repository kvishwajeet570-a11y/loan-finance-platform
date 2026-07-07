import { prisma } from "../../prisma/prisma";

export class LoanRepository {

  /* ==========================
     GET ALL LOANS
  ========================== */

  static async getAllLoans(
    page = 1,
    limit = 20,
    search = "",
    status?: string
  ) {
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        {
          fullName: {
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
          phone: {
            contains: search,
          },
        },
      ];
    }

    const [loans, total] =
      await Promise.all([

        prisma.loanApplication.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
          include: {
            user: true,
          },
        }),

        prisma.loanApplication.count({
          where,
        }),
      ]);

    return {
      loans,
      total,
      page,
      limit,
      totalPages:
        Math.ceil(total / limit),
    };
  }

  /* ==========================
     GET LOAN BY ID
  ========================== */

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

  /* ==========================
     APPROVE LOAN
  ========================== */

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

  /* ==========================
     REJECT LOAN
  ========================== */

  static async rejectLoan(
    loanId: string,
    reason?: string
  ) {
    return prisma.loanApplication.update({
      where: {
        id: loanId,
      },
      data: {
        status: "REJECTED",
        rejectionReason:
          reason || "Rejected",
      },
    });
  }

  /* ==========================
     PENDING LOANS
  ========================== */

  static async getPendingLoans() {
    return prisma.loanApplication.findMany({
      where: {
        status: "PENDING",
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /* ==========================
     APPROVED LOANS
  ========================== */

  static async getApprovedLoans() {
    return prisma.loanApplication.findMany({
      where: {
        status: "APPROVED",
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /* ==========================
     REJECTED LOANS
  ========================== */

  static async getRejectedLoans() {
    return prisma.loanApplication.findMany({
      where: {
        status: "REJECTED",
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /* ==========================
     RECENT LOANS
  ========================== */

  static async getRecentLoans(
    limit = 10
  ) {
    return prisma.loanApplication.findMany({
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
      },
    });
  }

  /* ==========================
     LOAN ANALYTICS
  ========================== */

  static async getLoanAnalytics() {

    const [
      totalLoans,
      approvedLoans,
      pendingLoans,
      rejectedLoans,
      totalAmount,
    ] = await Promise.all([

      prisma.loanApplication.count(),

      prisma.loanApplication.count({
        where: {
          status: "APPROVED",
        },
      }),

      prisma.loanApplication.count({
        where: {
          status: "PENDING",
        },
      }),

      prisma.loanApplication.count({
        where: {
          status: "REJECTED",
        },
      }),

      prisma.loanApplication.aggregate({
        _sum: {
          amount: true,
        },
      }),
    ]);

    return {
      totalLoans,
      approvedLoans,
      pendingLoans,
      rejectedLoans,
      totalAmount:
        totalAmount._sum.amount || 0,
    };
  }

  /* ==========================
     LOAN TYPE ANALYTICS
  ========================== */

  static async getLoanTypeAnalytics() {
    return prisma.loanApplication.groupBy({
      by: ["loanType"],

      _count: {
        id: true,
      },

      _sum: {
        amount: true,
      },
    });
  }

  /* ==========================
     USER LOANS
  ========================== */

  static async getUserLoans(
    userId: string
  ) {
    return prisma.loanApplication.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}