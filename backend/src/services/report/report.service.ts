import prisma from "../../config/database/prisma";

class ReportService {
  /**
   * Dashboard Summary Report
   */
  async dashboardReport() {
    const [
      totalUsers,
      totalLoans,
      totalPartners,
      totalDSA,
      totalPayments,
      totalReferrals,
    ] = await Promise.all([
      prisma.user.count(),

      prisma.loanApplication.count(),

      prisma.partner.count(),

      prisma.user.count({
        where: {
          role: "dsa",
        },
      }),

      prisma.payment.count(),

      prisma.referral.count(),
    ]);

    return {
      totalUsers,
      totalLoans,
      totalPartners,
      totalDSA,
      totalPayments,
      totalReferrals,
    };
  }

  /**
   * Loan Report
   */
  async loanReport() {
    const [
      totalLoans,
      approvedLoans,
      rejectedLoans,
      pendingLoans,
      amount,
    ] = await Promise.all([
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

      prisma.loanApplication.aggregate({
        _sum: {
          amount: true,
        },
      }),
    ]);

    return {
      totalLoans,
      approvedLoans,
      rejectedLoans,
      pendingLoans,

      totalLoanAmount:
        amount._sum.amount || 0,
    };
  }

  /**
   * Revenue Report
   */
  async revenueReport() {
    const revenue =
      await prisma.payment.aggregate({
        where: {
          status: "SUCCESS",
        },

        _sum: {
          amount: true,
        },
      });

    return {
      revenue:
        revenue._sum.amount || 0,
    };
  }

  /**
   * Commission Report
   */
  async commissionReport() {
    const commission =
      await prisma.commission.aggregate({
        where: {
          status: "APPROVED",
        },

        _sum: {
          commissionAmount: true,
        },
      });

    return {
      totalCommission:
        commission._sum
          .commissionAmount || 0,
    };
  }

  /**
   * DSA Performance Report
   */
  async dsaReport() {
    return prisma.loanApplication.groupBy({
      by: ["assignedTo"],

      where: {
        status: "APPROVED",
      },

      _count: {
        id: true,
      },

      _sum: {
        amount: true,
      },

      orderBy: {
        _count: {
          id: "desc",
        },
      },
    });
  }

  /**
   * Partner Performance Report
   */
  async partnerReport() {
    return prisma.loanApplication.groupBy({
      by: ["partnerId"],

      _count: {
        id: true,
      },

      _sum: {
        amount: true,
      },

      orderBy: {
        _sum: {
          amount: "desc",
        },
      },
    });
  }

  /**
   * Referral Report
   */
  async referralReport() {
    return prisma.referral.groupBy({
      by: ["referrerId"],

      _count: {
        id: true,
      },

      orderBy: {
        _count: {
          id: "desc",
        },
      },
    });
  }

  /**
   * Payment Report
   */
  async paymentReport() {
    const [
      success,
      failed,
      pending,
      amount,
    ] = await Promise.all([
      prisma.payment.count({
        where: {
          status: "SUCCESS",
        },
      }),

      prisma.payment.count({
        where: {
          status: "FAILED",
        },
      }),

      prisma.payment.count({
        where: {
          status: "PENDING",
        },
      }),

      prisma.payment.aggregate({
        where: {
          status: "SUCCESS",
        },

        _sum: {
          amount: true,
        },
      }),
    ]);

    return {
      success,
      failed,
      pending,

      totalAmount:
        amount._sum.amount || 0,
    };
  }

  /**
   * KYC Report
   */
  async kycReport() {
    const [
      approved,
      pending,
      rejected,
    ] = await Promise.all([
      prisma.kYC.count({
        where: {
          status: "APPROVED",
        },
      }),

      prisma.kYC.count({
        where: {
          status: "PENDING",
        },
      }),

      prisma.kYC.count({
        where: {
          status: "REJECTED",
        },
      }),
    ]);

    return {
      approved,
      pending,
      rejected,
    };
  }

  /**
   * User Report
   */
  async userReport() {
    const [
      totalUsers,
      verifiedUsers,
      blockedUsers,
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
    ]);

    return {
      totalUsers,
      verifiedUsers,
      blockedUsers,
    };
  }

  /**
   * Monthly Business Report
   */
  async monthlyBusinessReport() {
    const year =
      new Date().getFullYear();

    return prisma.$queryRaw`
      SELECT
      EXTRACT(MONTH FROM "createdAt") AS month,
      COUNT(*) AS total_loans,
      SUM(amount) AS total_amount
      FROM "LoanApplication"
      WHERE EXTRACT(YEAR FROM "createdAt") = ${year}
      GROUP BY month
      ORDER BY month ASC
    `;
  }

  /**
   * Monthly Revenue Report
   */
  async monthlyRevenueReport() {
    const year =
      new Date().getFullYear();

    return prisma.$queryRaw`
      SELECT
      EXTRACT(MONTH FROM "createdAt") AS month,
      SUM(amount) AS revenue
      FROM "Payment"
      WHERE status='SUCCESS'
      AND EXTRACT(YEAR FROM "createdAt") = ${year}
      GROUP BY month
      ORDER BY month ASC
    `;
  }

  /**
   * Top Performing Users
   */
  async topUsers() {
    return prisma.commission.groupBy({
      by: ["userId"],

      _sum: {
        commissionAmount: true,
      },

      orderBy: {
        _sum: {
          commissionAmount:
            "desc",
        },
      },

      take: 20,
    });
  }

  /**
   * Complete Admin Report
   */
  async completeAdminReport() {
    const [
      dashboard,
      loan,
      revenue,
      commission,
      payment,
      kyc,
      users,
    ] = await Promise.all([
      this.dashboardReport(),
      this.loanReport(),
      this.revenueReport(),
      this.commissionReport(),
      this.paymentReport(),
      this.kycReport(),
      this.userReport(),
    ]);

    return {
      dashboard,
      loan,
      revenue,
      commission,
      payment,
      kyc,
      users,
    };
  }
}

export default new ReportService();