// src/services/ai/ai.service.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class AIService {
  async getDashboardInsights() {
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
      approvalRate: `${approvalRate}%`,
      insights: [
        approvedLoans > rejectedLoans
          ? "Loan approvals are performing well."
          : "High rejection ratio detected.",

        pendingLoans > 20
          ? "Large pending queue requires review."
          : "Pending applications under control.",
      ],
    };
  }

  async getTopLoanTypes() {
    const loans = await prisma.loanApplication.groupBy({
      by: ["loanType"],
      _count: true,
      orderBy: {
        _count: {
          loanType: "desc",
        },
      },
    });

    return loans;
  }

  async getRevenuePrediction() {
    const approved = await prisma.loanApplication.findMany({
      where: {
        status: "approved",
      },
      select: {
        amount: true,
      },
    });

    const totalAmount = approved.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );

    const estimatedRevenue = totalAmount * 0.015;

    return {
      totalDisbursed: totalAmount,
      estimatedRevenue,
      nextMonthForecast:
        estimatedRevenue * 1.12,
    };
  }
}

export default new AIService();