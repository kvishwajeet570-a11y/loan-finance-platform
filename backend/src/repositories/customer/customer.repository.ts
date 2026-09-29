import prisma from "../../prisma/prisma";
export class CustomerRepository {

  /* ==========================
      CUSTOMER PROFILE
  ========================== */

  static async getCustomerProfile(
    userId: string
  ) {

    return prisma.user.findUnique({
      where: {
        id: userId
      },
      include: {
        loans: true
      }
    });
  }

  /* ==========================
      UPDATE PROFILE
  ========================== */

  static async updateProfile(
    userId: string,
    data: Partial<{
      name: string;
      email: string;
      phoneNo: string;
      profileImage: string;
    }>
  ) {

    return prisma.user.update({
      where: {
        id: userId
      },
      data
    });
  }

  /* ==========================
      CUSTOMER LOANS
  ========================== */

  static async getCustomerLoans(
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

  /* ==========================
      LOAN DETAILS
  ========================== */

  static async getLoanDetails(
    loanId: string
  ) {

    return prisma.loanApplication.findUnique({
      where: {
        id: loanId
      }
    });
  }

  /* ==========================
      CUSTOMER BANK ACCOUNTS
  ========================== */

  static async getBankAccounts(
    userId: string
  ) {

    return prisma.bankAccount.findMany({
      where: {
        userId
      }
    });
  }

  /* ==========================
      CUSTOMER CREDIT SCORES
  ========================== */

  static async getCreditHistory(
    userId: string
  ) {

    return prisma.creditScoreHistory.findMany({
      where: {
        userId
      },
      orderBy: {
        enquiryDate: "desc"
      }
    });
  }

  /* ==========================
      LATEST CREDIT SCORE
  ========================== */

  static async getLatestCreditScore(
    userId: string
  ) {

    return prisma.creditScoreHistory.findFirst({
      where: {
        userId
      },
      orderBy: {
        enquiryDate: "desc"
      }
    });
  }

  /* ==========================
      CUSTOMER DASHBOARD
  ========================== */

  static async getDashboard(
    userId: string
  ) {

    const [
      profile,
      totalLoans,
      approvedLoans,
      pendingLoans,
      latestCreditScore
    ] = await Promise.all([

      prisma.user.findUnique({
        where: {
          id: userId
        }
      }),

      prisma.loanApplication.count({
        where: {
          userId
        }
      }),

      prisma.loanApplication.count({
        where: {
          userId,
          status: "APPROVED"
        }
      }),

      prisma.loanApplication.count({
        where: {
          userId,
          status: "PENDING"
        }
      }),

      prisma.creditScoreHistory.findFirst({
        where: {
          userId
        },
        orderBy: {
          enquiryDate: "desc"
        }
      })
    ]);

    return {
      profile,
      totalLoans,
      approvedLoans,
      pendingLoans,
      latestCreditScore
    };
  }

  /* ==========================
      LOAN ANALYTICS
  ========================== */

  static async getLoanAnalytics(
    userId: string
  ) {

    const totalAmount =
      await prisma.loanApplication.aggregate({
        where: {
          userId
        },
        _sum: {
          amount: true
        }
      });

    return {
      totalLoanAmount:
        totalAmount._sum.amount || 0
    };
  }

  /* ==========================
      DELETE CUSTOMER
  ========================== */

  static async deleteCustomer(
    userId: string
  ) {

    return prisma.user.delete({
      where: {
        id: userId
      }
    });
  }

  /* ==========================
      CUSTOMER NOTIFICATIONS
  ========================== */

  static async getNotifications(
    userId: string
  ) {

    return prisma.notification.findMany({
      where: {
        userId
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  /* ==========================
      CUSTOMER SUPPORT TICKETS
  ========================== */

  static async getSupportTickets(
    userId: string
  ) {

    return prisma.supportTicket.findMany({
      where: {
        userId
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  /* ==========================
      CUSTOMER COMMISSIONS
  ========================== */

  static async getCustomerReferralIncome(
    userId: string
  ) {

    return prisma.commission.findMany({
      where: {
        userId,
        status: "PAID"
      }
    });
  }
}