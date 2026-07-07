import { prisma } from "../../prisma/prisma";

export class LoanRepository {

  /* =========================
      CREATE LOAN
  ========================= */

  static async createLoan(data: {
    userId: string;
    fullName: string;
    email: string;
    phone: string;
    loanType: string;
    amount: number;
  }) {

    return prisma.loanApplication.create({
      data
    });
  }

  /* =========================
      GET LOAN BY ID
  ========================= */

  static async getLoanById(
    id: string
  ) {

    return prisma.loanApplication.findUnique({
      where: { id },
      include: {
        user: true
      }
    });
  }

  /* =========================
      GET USER LOANS
  ========================= */

  static async getUserLoans(
    userId: string
  ) {

    return prisma.loanApplication.findMany({

      where: {
        userId
      },

      orderBy: {
        createdAt: "desc"
      }
    });
  }

  /* =========================
      GET ALL LOANS
  ========================= */

  static async getAllLoans(
    page = 1,
    limit = 20
  ) {

    const skip =
      (page - 1) * limit;

    const [loans, total] =
      await Promise.all([

        prisma.loanApplication.findMany({

          skip,
          take: limit,

          include: {
            user: true
          },

          orderBy: {
            createdAt: "desc"
          }
        }),

        prisma.loanApplication.count()
      ]);

    return {
      total,
      page,
      limit,
      loans
    };
  }

  /* =========================
      UPDATE LOAN
  ========================= */

  static async updateLoan(
    id: string,
    data: Partial<{
      fullName: string;
      email: string;
      phone: string;
      loanType: string;
      amount: number;
    }>
  ) {

    return prisma.loanApplication.update({

      where: {
        id
      },

      data
    });
  }

  /* =========================
      APPROVE LOAN
  ========================= */

  static async approveLoan(
    id: string
  ) {

    return prisma.loanApplication.update({

      where: {
        id
      },

      data: {
        status: "APPROVED",
        rejectionReason: null
      }
    });
  }

  /* =========================
      REJECT LOAN
  ========================= */

  static async rejectLoan(
    id: string,
    reason: string
  ) {

    return prisma.loanApplication.update({

      where: {
        id
      },

      data: {
        status: "REJECTED",
        rejectionReason: reason
      }
    });
  }

  /* =========================
      DISBURSE LOAN
  ========================= */

  static async disburseLoan(
    id: string
  ) {

    return prisma.loanApplication.update({

      where: {
        id
      },

      data: {
        status: "DISBURSED"
      }
    });
  }

  /* =========================
      DELETE LOAN
  ========================= */

  static async deleteLoan(
    id: string
  ) {

    return prisma.loanApplication.delete({
      where: { id }
    });
  }

  /* =========================
      SEARCH LOANS
  ========================= */

  static async searchLoans(
    keyword: string
  ) {

    return prisma.loanApplication.findMany({

      where: {

        OR: [

          {
            fullName: {
              contains: keyword,
              mode: "insensitive"
            }
          },

          {
            email: {
              contains: keyword,
              mode: "insensitive"
            }
          },

          {
            phone: {
              contains: keyword
            }
          },

          {
            loanType: {
              contains: keyword,
              mode: "insensitive"
            }
          }
        ]
      },

      include: {
        user: true
      }
    });
  }

  /* =========================
      LOANS BY STATUS
  ========================= */

  static async getLoansByStatus(
    status: string
  ) {

    return prisma.loanApplication.findMany({

      where: {
        status
      },

      include: {
        user: true
      },

      orderBy: {
        createdAt: "desc"
      }
    });
  }

  /* =========================
      PENDING LOANS
  ========================= */

  static async getPendingLoans() {

    return prisma.loanApplication.findMany({

      where: {
        status: "PENDING"
      },

      include: {
        user: true
      }
    });
  }

  /* =========================
      APPROVED LOANS
  ========================= */

  static async getApprovedLoans() {

    return prisma.loanApplication.findMany({

      where: {
        status: "APPROVED"
      },

      include: {
        user: true
      }
    });
  }

  /* =========================
      LOAN ANALYTICS
  ========================= */

  static async getLoanAnalytics() {

    const [
      totalLoans,
      pendingLoans,
      approvedLoans,
      rejectedLoans,
      disbursedLoans,
      totalAmount
    ] = await Promise.all([

      prisma.loanApplication.count(),

      prisma.loanApplication.count({
        where: { status: "PENDING" }
      }),

      prisma.loanApplication.count({
        where: { status: "APPROVED" }
      }),

      prisma.loanApplication.count({
        where: { status: "REJECTED" }
      }),

      prisma.loanApplication.count({
        where: { status: "DISBURSED" }
      }),

      prisma.loanApplication.aggregate({
        _sum: {
          amount: true
        }
      })
    ]);

    return {

      totalLoans,

      pendingLoans,

      approvedLoans,

      rejectedLoans,

      disbursedLoans,

      totalAmount:
        totalAmount._sum.amount || 0
    };
  }

  /* =========================
      MONTHLY REPORT
  ========================= */

  static async getMonthlyReport(
    month: number,
    year: number
  ) {

    const start =
      new Date(year, month - 1, 1);

    const end =
      new Date(year, month, 1);

    return prisma.loanApplication.findMany({

      where: {

        createdAt: {
          gte: start,
          lt: end
        }
      },

      include: {
        user: true
      }
    });
  }
}