import { LoanStatus } from "@prisma/client";
import prisma from "../../prisma/prisma";

export class LoanRepository {

  static async createLoan(data: {
    userId: string;
    fullName: string;
    email: string;
    phone: string;
    loanType: string;
    amount: number;
  }) {
    return prisma.loanApplication.create({ data });
  }

  static async getLoanById(id: string) {
    return prisma.loanApplication.findUnique({
      where: { id },
      include: { user: true }
    });
  }

  static async getUserLoans(userId: string) {
    return prisma.loanApplication.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });
  }

  static async getAllLoans(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [loans, total] = await Promise.all([
      prisma.loanApplication.findMany({
        skip,
        take: limit,
        include: { user: true },
        orderBy: { createdAt: "desc" }
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
      where: { id },
      data
    });
  }

  static async approveLoan(id: string) {
    return prisma.loanApplication.update({
      where: { id },
      data: {
        status: LoanStatus.APPROVED,
        rejectionReason: null
      }
    });
  }

  static async rejectLoan(id: string, reason: string) {
    return prisma.loanApplication.update({
      where: { id },
      data: {
        status: LoanStatus.REJECTED,
        rejectionReason: reason
      }
    });
  }

  static async disburseLoan(id: string) {
    return prisma.loanApplication.update({
      where: { id },
      data: {
        status: LoanStatus.APPROVED
      }
    });
  }

  static async deleteLoan(id: string) {
    return prisma.loanApplication.delete({
      where: { id }
    });
  }

  static async searchLoans(keyword: string) {
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
      include: { user: true }
    });
  }

  static async getLoansByStatus(status: LoanStatus) {
    return prisma.loanApplication.findMany({
      where: { status },
      include: { user: true },
      orderBy: { createdAt: "desc" }
    });
  }

  static async getPendingLoans() {
    return prisma.loanApplication.findMany({
      where: {
        status: LoanStatus.PENDING
      },
      include: { user: true }
    });
  }

  static async getApprovedLoans() {
    return prisma.loanApplication.findMany({
      where: {
        status: LoanStatus.APPROVED
      },
      include: { user: true }
    });
  }

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
        where: {
          status: LoanStatus.PENDING
        }
      }),

      prisma.loanApplication.count({
        where: {
          status: LoanStatus.APPROVED
        }
      }),

      prisma.loanApplication.count({
        where: {
          status: LoanStatus.REJECTED
        }
      }),

      prisma.loanApplication.count({
        where: {
          status: LoanStatus.APPROVED
        }
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
      totalAmount: totalAmount._sum.amount ?? 0
    };
  }

  static async getMonthlyReport(
    month: number,
    year: number
  ) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

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