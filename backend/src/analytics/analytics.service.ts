// src/services/analytics/analytics.service.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class AnalyticsService {
  async getDashboardAnalytics() {
    const [
      totalUsers,
      totalLoans,
      approvedLoans,
      rejectedLoans,
      pendingLoans,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.loanApplication.count(),
      prisma.loanApplication.count({
        where: { status: "approved" },
      }),
      prisma.loanApplication.count({
        where: { status: "rejected" },
      }),
      prisma.loanApplication.count({
        where: { status: "pending" },
      }),
    ]);

    const approvalRate =
      totalLoans > 0
        ? ((approvedLoans / totalLoans) * 100).toFixed(2)
        : "0";

    return {
      totalUsers,
      totalLoans,
      approvedLoans,
      rejectedLoans,
      pendingLoans,
      approvalRate,
    };
  }

  async getLoanTypeAnalytics() {
    return prisma.loanApplication.groupBy({
      by: ["loanType"],
      _count: {
        loanType: true,
      },
    });
  }

  async getMonthlyLoanTrend() {
    const loans = await prisma.loanApplication.findMany({
      select: {
        amount: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return loans;
  }

  async getRevenueAnalytics() {
    const approvedLoans =
      await prisma.loanApplication.findMany({
        where: {
          status: "approved",
        },
        select: {
          amount: true,
        },
      });

    const totalDisbursed =
      approvedLoans.reduce(
        (sum, loan) => sum + Number(loan.amount),
        0
      );

    const estimatedRevenue =
      totalDisbursed * 0.015;

    return {
      totalDisbursed,
      estimatedRevenue,
    };
  }

  async getRecentApplications() {
    return prisma.loanApplication.findMany({
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        fullName: true,
        loanType: true,
        amount: true,
        status: true,
        createdAt: true,
      },
    });
  }
}

export default new AnalyticsService();