// src/services/ai/ai.service.ts

import { LoanStatus } from "@prisma/client";
import prisma from "../prisma/prisma";

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
        where: {
          status: LoanStatus.APPROVED,
        },
      }),

      prisma.loanApplication.count({
        where: {
          status: LoanStatus.REJECTED,
        },
      }),

      prisma.loanApplication.count({
        where: {
          status: LoanStatus.PENDING,
        },
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

      _count: {
        loanType: true,
      },

      orderBy: {
        _count: {
          loanType: "desc",
        },
      },
    });

    return loans;
  }

  async getRevenuePrediction() {
    const approvedLoans = await prisma.loanApplication.findMany({
      where: {
        status: LoanStatus.APPROVED,
      },

      select: {
        amount: true,
      },
    });

    const totalAmount = approvedLoans.reduce(
      (sum, loan) => sum + Number(loan.amount),
      0
    );

    const estimatedRevenue = totalAmount * 0.015;

    const nextMonthForecast = estimatedRevenue * 1.12;

    return {
      totalDisbursed: totalAmount,
      estimatedRevenue,
      nextMonthForecast,
    };
  }
}

export default new AIService();




