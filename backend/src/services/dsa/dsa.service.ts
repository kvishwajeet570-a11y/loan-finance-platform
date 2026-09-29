import prisma from "../../prisma/prisma";
import { Prisma } from "@prisma/client";

interface DSAFilter {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

class DSAService {
  async registerDSA(data: {
    name: string;
    email: string;
    phoneNo: string;
    password: string;
    referralCode?: string;
  }) {
    const existingUser =
      await prisma.user.findFirst({
        where: {
          OR: [
            { email: data.email },
            { phoneNo: data.phoneNo },
          ],
        },
      });

    if (existingUser) {
      throw new Error("DSA already exists");
    }

    return prisma.user.create({
      data: {
        ...data,
        role: "DSA",
        isVerified: false,
      },
    });
  }

  async verifyDSA(dsaId: string) {
    return prisma.user.update({
      where: { id: dsaId },
      data: {
        isVerified: true,
      },
    });
  }

  async getDSAProfile(dsaId: string) {
    return prisma.user.findUnique({
      where: { id: dsaId },
    });
  }

  async updateDSA(
    dsaId: string,
    data: any
  ) {
    return prisma.user.update({
      where: { id: dsaId },
      data,
    });
  }

  async getDSAList(filters: DSAFilter) {
    const {
      page = 1,
      limit = 20,
      search,
    } = filters;

    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      role: "DSA",
    };

    if (search) {
      where.OR = [
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
      ];
    }

    const [dsas, total] =
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
      dsas,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async assignLead(
    dsaId: string,
    loanId: string
  ) {
    return prisma.loanApplication.update({
      where: { id: loanId },
      data: {
        assignedTo: dsaId,
      },
    });
  }

  async getDSALoans(dsaId: string) {
    return prisma.loanApplication.findMany({
      where: {
        assignedTo: dsaId,
      },
      include: {
        commissions: {
          orderBy: {
            createdAt: "desc",
          },
        },
        documents: true,
        user: true,
        partner: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getDSADashboard(dsaId: string) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const sixMonthsStart = new Date(
      currentYear,
      currentMonth - 5,
      1
    );

    const currentMonthStart = new Date(
      currentYear,
      currentMonth,
      1
    );

    const previousMonthStart = new Date(
      currentYear,
      currentMonth - 1,
      1
    );

    const totalLeads = await prisma.loanApplication.count({
      where: { assignedTo: dsaId },
    });

    const approvedLoans = await prisma.loanApplication.count({
      where: {
        assignedTo: dsaId,
        status: "APPROVED",
      },
    });

    const pendingLoans = await prisma.loanApplication.count({
      where: {
        assignedTo: dsaId,
        status: "PENDING",
      },
    });

    const rejectedLoans = await prisma.loanApplication.count({
      where: {
        assignedTo: dsaId,
        status: "REJECTED",
      },
    });

    const applications = await prisma.loanApplication.findMany({
      where: { assignedTo: dsaId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        fullName: true,
        loanType: true,
        amount: true,
        status: true,
        createdAt: true,
        city: true,
        state: true,
        userId: true,
      },
    });

    const totalLoanAmount = applications.reduce(
      (sum, loan) => sum + Number(loan.amount || 0),
      0
    );

    const approvedLoanAmount = applications
      .filter((loan) => loan.status === "APPROVED")
      .reduce(
        (sum, loan) => sum + Number(loan.amount || 0),
        0
      );

    const recentApplications = applications
      .slice(0, 10)
      .map((loan) => ({
        id: loan.id,
        fullName: loan.fullName,
        loanType: loan.loanType,
        amount: loan.amount,
        status: loan.status,
        createdAt: loan.createdAt,
        city: loan.city,
        state: loan.state,
      }));

    const totalCustomers = new Set(
      applications
        .map((loan) => loan.userId)
        .filter(Boolean)
    ).size;

    const commissions = await prisma.commission.findMany({
      where: { userId: dsaId },
      select: {
        amount: true,
        commissionAmount: true,
        status: true,
        createdAt: true,
      },
    });

    const approvedCommissions = commissions.filter(
      (commission) => commission.status === "APPROVED"
    );

    const pendingCommissions = commissions.filter(
      (commission) => commission.status === "PENDING"
    );

    const totalEarnings = approvedCommissions.reduce(
      (sum, commission) =>
        sum + Number(
          commission.commissionAmount ??
          commission.amount ??
          0
        ),
      0
    );

    const pendingCommission = pendingCommissions.reduce(
      (sum, commission) =>
        sum + Number(
          commission.commissionAmount ??
          commission.amount ??
          0
        ),
      0
    );

    const wallet = await prisma.wallet.findUnique({
      where: { userId: dsaId },
      select: {
        balance: true,
        cashback: true,
        rewardBalance: true,
        totalEarnings: true,
        isFrozen: true,
        isBlocked: true,
      },
    });

    const notifications = await prisma.notification.findMany({
      where: {
        userId: dsaId,
        isArchived: false,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
      select: {
        id: true,
        title: true,
        message: true,
        type: true,
        priority: true,
        isRead: true,
        createdAt: true,
      },
    });

    const unreadNotifications =
      await prisma.notification.count({
        where: {
          userId: dsaId,
          isArchived: false,
          isRead: false,
        },
      });

    const transactions = await prisma.transaction.findMany({
      where: { dsaId },
      select: {
        amount: true,
        commission: true,
        cashback: true,
      },
    });

    const transactionTotalAmount = transactions.reduce(
      (sum, transaction) =>
        sum + Number(transaction.amount || 0),
      0
    );

    const transactionTotalCommission =
      transactions.reduce(
        (sum, transaction) =>
          sum + Number(transaction.commission || 0),
        0
      );

    const transactionTotalCashback =
      transactions.reduce(
        (sum, transaction) =>
          sum + Number(transaction.cashback || 0),
        0
      );

    const monthlyApplications =
      applications.filter(
        (loan) =>
          new Date(loan.createdAt) >= sixMonthsStart
      );

    const monthlyTrend = Array.from(
      { length: 6 },
      (_, index) => {
        const date = new Date(
          currentYear,
          currentMonth - (5 - index),
          1
        );

        const year = date.getFullYear();
        const month = date.getMonth();

        const monthLoans = monthlyApplications.filter(
          (loan) => {
            const created = new Date(loan.createdAt);

            return (
              created.getFullYear() === year &&
              created.getMonth() === month
            );
          }
        );

        return {
          month: date.toLocaleString("en-IN", {
            month: "short",
          }),
          applications: monthLoans.length,
          approved: monthLoans.filter(
            (loan) => loan.status === "APPROVED"
          ).length,
          pending: monthLoans.filter(
            (loan) => loan.status === "PENDING"
          ).length,
          rejected: monthLoans.filter(
            (loan) => loan.status === "REJECTED"
          ).length,
          loanAmount: monthLoans.reduce(
            (sum, loan) =>
              sum + Number(loan.amount || 0),
            0
          ),
        };
      }
    );

    const productMap: Record<
      string,
      { applications: number; amount: number }
    > = {};

    for (const loan of applications) {
      const name =
        String(loan.loanType || "Other").trim() ||
        "Other";

      if (!productMap[name]) {
        productMap[name] = {
          applications: 0,
          amount: 0,
        };
      }

      productMap[name].applications += 1;
      productMap[name].amount += Number(
        loan.amount || 0
      );
    }

    const loanProducts = Object.entries(
      productMap
    ).map(([name, data]) => ({
      name,
      value: data.applications,
      amount: data.amount,
    }));

    const commissionTrend = Array.from(
      { length: 6 },
      (_, index) => {
        const date = new Date(
          currentYear,
          currentMonth - (5 - index),
          1
        );

        const value = approvedCommissions
          .filter((commission) => {
            const created = new Date(
              commission.createdAt
            );

            return (
              created.getFullYear() ===
                date.getFullYear() &&
              created.getMonth() === date.getMonth()
            );
          })
          .reduce(
            (sum, commission) =>
              sum +
              Number(
                commission.commissionAmount ??
                commission.amount ??
                0
              ),
            0
          );

        return {
          month: date.toLocaleString("en-IN", {
            month: "short",
          }),
          commission: value,
        };
      }
    );

    const currentMonthApplications =
      applications.filter(
        (loan) =>
          new Date(loan.createdAt) >=
          currentMonthStart
      ).length;

    const previousMonthApplications =
      applications.filter((loan) => {
        const created = new Date(loan.createdAt);

        return (
          created >= previousMonthStart &&
          created < currentMonthStart
        );
      }).length;

    const monthlyGrowth =
      previousMonthApplications > 0
        ? Number(
            (
              ((currentMonthApplications -
                previousMonthApplications) /
                previousMonthApplications) *
              100
            ).toFixed(2)
          )
        : null;

    const approvalRate =
      totalLeads > 0
        ? Number(
            (
              (approvedLoans / totalLeads) *
              100
            ).toFixed(2)
          )
        : 0;

    const ranking = await prisma.commission.groupBy({
      by: ["userId"],
      where: {
        status: "APPROVED",
      },
      _sum: {
        commissionAmount: true,
      },
      orderBy: {
        _sum: {
          commissionAmount: "desc",
        },
      },
    });

    const rankIndex = ranking.findIndex(
      (item) => item.userId === dsaId
    );

    return {
      summary: {
        totalLeads,
        approvedLoans,
        pendingLoans,
        rejectedLoans,
        totalEarnings,
        pendingCommission,
        totalLoanAmount,
        approvedLoanAmount,
        approvalRate,
        totalCustomers,
      },

      monthlyTrend,

      commissionTrend,

      loanProducts,

      recentApplications,

      notifications,

      unreadNotifications,

      wallet,

      transactions: {
        totalAmount: transactionTotalAmount,
        totalCommission: transactionTotalCommission,
        totalCashback: transactionTotalCashback,
      },

      performance: {
        currentMonthApplications,
        previousMonthApplications,
        monthlyGrowth,
      },

      rank:
        rankIndex >= 0
          ? rankIndex + 1
          : null,

      currentMonthApplications,
    };
  }
  async getPerformanceReport(
    dsaId: string
  ) {
    const total =
      await prisma.loanApplication.count({
        where: {
          assignedTo: dsaId,
        },
      });

    const approved =
      await prisma.loanApplication.count({
        where: {
          assignedTo: dsaId,
          status: "APPROVED",
        },
      });

    return {
      totalLeads: total,
      approvedLeads: approved,
      conversionRate:
        total > 0
          ? ((approved / total) * 100).toFixed(2)
          : "0.00",
    };
  }

  async getTopDSA(limit = 10) {
    return prisma.commission.groupBy({
      by: ["userId"],
      _sum: {
        commissionAmount: true,
      },
      orderBy: {
        _sum: {
          commissionAmount: "desc",
        },
      },
      take: limit,
    });
  }

  async blockDSA(dsaId: string) {
    return prisma.user.update({
      where: {
        id: dsaId,
      },
      data: {
        isBlocked: true,
      },
    });
  }

  async unblockDSA(dsaId: string) {
    return prisma.user.update({
      where: {
        id: dsaId,
      },
      data: {
        isBlocked: false,
      },
    });
  }
}

export default new DSAService();





