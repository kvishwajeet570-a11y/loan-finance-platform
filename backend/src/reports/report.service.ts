import { prisma } from "../../prisma/prisma";

export class ReporterService {

  static async getDashboardReport() {

    const [
      totalUsers,
      totalLoans,
      approvedLoans,
      rejectedLoans,
      pendingLoans,
      totalDisbursed
    ] = await Promise.all([

      prisma.user.count(),

      prisma.loanApplication.count(),

      prisma.loanApplication.count({
        where: {
          status: "APPROVED"
        }
      }),

      prisma.loanApplication.count({
        where: {
          status: "REJECTED"
        }
      }),

      prisma.loanApplication.count({
        where: {
          status: "PENDING"
        }
      }),

      prisma.loanApplication.aggregate({
        _sum: {
          amount: true
        }
      })
    ]);

    return {
      totalUsers,
      totalLoans,
      approvedLoans,
      rejectedLoans,
      pendingLoans,
      totalDisbursed:
        totalDisbursed._sum.amount || 0
    };
  }

  static async getLoanReport() {

    return prisma.loanApplication.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  static async getKycReport() {

    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        isVerified: true
      }
    });
  }

  static async getRevenueReport() {

    const revenue =
      await prisma.transaction.aggregate({

        _sum: {
          amount: true
        }
      });

    return {
      totalRevenue:
        revenue._sum.amount || 0
    };
  }
}