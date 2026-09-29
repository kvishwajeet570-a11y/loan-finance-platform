import { Request, Response } from "express";
import { LoanStatus } from "@prisma/client";
import prisma from "../../prisma/prisma";

export const getAnalytics = async (
  req: Request,
  res: Response
) => {
  try {
    const [
      totalUsers,
      totalLoans,
      approvedLoans,
      pendingLoans,
      rejectedLoans,
      recentUsers,
      recentLoans,
      topUsers,
      monthlyUsers,
      monthlyLoans,
    ] = await Promise.all([
      prisma.user.count(),

      prisma.loanApplication.count(),

      prisma.loanApplication.count({
        where: { status: LoanStatus.APPROVED },
      }),

      prisma.loanApplication.count({
        where: { status: LoanStatus.PENDING },
      }),

      prisma.loanApplication.count({
        where: { status: LoanStatus.REJECTED },
      }),

      prisma.user.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          email: true,
          phoneNo: true,
          createdAt: true,
        },
      }),

      prisma.loanApplication.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.user.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          email: true,
          phoneNo: true,
          createdAt: true,
        },
      }),

      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              1
            ),
          },
        },
      }),

      prisma.loanApplication.count({
        where: {
          createdAt: {
            gte: new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              1
            ),
          },
        },
      }),
    ]);

    const performance =
      totalLoans > 0
        ? Math.round((approvedLoans / totalLoans) * 100)
        : 0;

    let totalTransactions = 0;
    let totalWalletBalance = 0;
    let totalReferrals = 0;

    try {
      totalTransactions =
        await prisma.transaction.count();
    } catch {}

    try {
      const walletData =
        await prisma.wallet.aggregate({
          _sum: {
            balance: true,
          },
        });

      totalWalletBalance =
        Number(walletData._sum.balance || 0);
    } catch {}

    try {
      const referralData =
        await prisma.referral.count();

      totalReferrals = referralData;
    } catch {}

    return res.status(200).json({
      success: true,

      analytics: {
        totalUsers,
        totalLoans,
        approvedLoans,
        pendingLoans,
        rejectedLoans,

        totalTransactions,
        totalWalletBalance,
        totalReferrals,

        performance,
        monthlyUsers,
        monthlyLoans,
      },

      recentData: {
        recentUsers,
        recentLoans,
      },

      leaderboard: {
        topUsers,
      },
    });
  } catch (error) {
    console.error(
      "ANALYTICS ERROR => ",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });
  }
};

// =========================================
// OVERVIEW ANALYTICS
// =========================================
export const getOverviewAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const [
      totalUsers,
      totalLoans,
      totalTransactions,
      totalRevenue,
      approvedLoans,
      pendingLoans,
      rejectedLoans,
    ] = await Promise.all([
      prisma.user.count(),

      prisma.loanApplication.count(),

      prisma.transaction.count(),

      prisma.revenue.aggregate({
        _sum: {
          amount: true,
        },
      }),

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
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalLoans,
        totalTransactions,
        totalRevenue: totalRevenue._sum.amount ?? 0,
        approvedLoans,
        pendingLoans,
        rejectedLoans,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch overview analytics",
    });
  }
};

// =========================================
// LOAN AMOUNT ANALYTICS
// =========================================
export const getLoanAmountAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const analytics =
      await prisma.loanApplication.aggregate({
        _count: {
          id: true,
        },
        _sum: {
          amount: true,
        },
        _avg: {
          amount: true,
        },
        _min: {
          amount: true,
        },
        _max: {
          amount: true,
        },
      });

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch loan amount analytics",
    });
  }
};

// =========================================
// LOAN STATUS ANALYTICS
// =========================================
export const getLoanStatusAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const statusAnalytics =
      await prisma.loanApplication.groupBy({
        by: ["status"],
        _count: {
          status: true,
        },
        _sum: {
          amount: true,
        },
        orderBy: {
          _count: {
            status: "desc",
          },
        },
      });

    res.status(200).json({
      success: true,
      data: statusAnalytics,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch loan status analytics",
    });
  }
}; 

// =========================================
// USER ROLE ANALYTICS
// =========================================
export const getUserRoleAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const roleAnalytics = await prisma.user.groupBy({
      by: ["role"],
      _count: {
        role: true,
      },
      orderBy: {
        _count: {
          role: "desc",
        },
      },
    });

    res.status(200).json({
      success: true,
      data: roleAnalytics,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch user role analytics",
    });
  }
};

// =========================================
// MONTHLY USER ANALYTICS
// =========================================
export const getMonthlyUserAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const monthlyMap = new Map<
      string,
      {
        month: string;
        users: number;
      }
    >();

    users.forEach((user) => {
      const date = new Date(user.createdAt);

      const key = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!monthlyMap.has(key)) {
        monthlyMap.set(key, {
          month: key,
          users: 0,
        });
      }

      monthlyMap.get(key)!.users++;
    });

    res.status(200).json({
      success: true,
      data: Array.from(monthlyMap.values()),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch monthly user analytics",
    });
  }
};

// =========================================
// TOP CUSTOMERS
// =========================================
export const getTopCustomers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const limit = Number(req.query.limit ?? 10);

    const customers = await prisma.user.findMany({
      take: limit,
      include: {
        loans: {
          select: {
            id: true,
            amount: true,
            status: true,
          },
        },
      },
    });

    const result = customers
      .map((user) => {
        const totalLoanAmount = user.loans.reduce(
          (sum, loan) => sum + Number(loan.amount),
          0
        );

        const approvedLoans = user.loans.filter(
          (loan) => loan.status === "APPROVED"
        ).length;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          phoneNo: user.phoneNo,
          totalLoans: user.loans.length,
          approvedLoans,
          totalLoanAmount,
        };
      })
      .sort(
        (a, b) => b.totalLoanAmount - a.totalLoanAmount
      );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch top customers",
    });
  }
};

// =========================================
// RECENT ACTIVITIES
// =========================================
export const getRecentActivities = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const limit = Number(req.query.limit ?? 20);

    const activities =
      await prisma.userActivity.findMany({
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phoneNo: true,
            },
          },
        },
      });

    res.status(200).json({
      success: true,
      data: activities,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch recent activities",
    });
  }
};
// =========================================
// DASHBOARD ANALYTICS
// =========================================
export const getDashboardAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const [
      totalUsers,
      totalLoans,
      totalTransactions,
      totalRevenue,
      approvedLoans,
      pendingLoans,
      rejectedLoans,
      recentLoans,
      recentUsers,
    ] = await Promise.all([
      prisma.user.count(),

      prisma.loanApplication.count(),

      prisma.transaction.count(),

      prisma.revenue.aggregate({
        _sum: {
          amount: true,
        },
      }),

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

      prisma.loanApplication.findMany({
        take: 5,
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
      }),

      prisma.user.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          email: true,
          phoneNo: true,
          createdAt: true,
        },
      }),
    ]);

    const approvalRate =
      totalLoans === 0
        ? 0
        : Number(((approvedLoans / totalLoans) * 100).toFixed(2));

    res.status(200).json({
      success: true,
      data: {
        statistics: {
          totalUsers,
          totalLoans,
          totalTransactions,
          totalRevenue: totalRevenue._sum.amount ?? 0,
          approvedLoans,
          pendingLoans,
          rejectedLoans,
          approvalRate,
        },
        recentLoans,
        recentUsers,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard analytics",
    });
  }
};
// =========================================
// LOAN TYPE ANALYTICS
// =========================================
export const getLoanTypeAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const analytics = await prisma.loanApplication.groupBy({
      by: ["loanType"],
      _count: {
        loanType: true,
      },
      _sum: {
        amount: true,
      },
      _avg: {
        amount: true,
      },
      orderBy: {
        _count: {
          loanType: "desc",
        },
      },
    });

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch loan type analytics",
    });
  }
};

// =========================================
// MONTHLY LOAN ANALYTICS
// =========================================
export const getMonthlyLoanAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const loans = await prisma.loanApplication.findMany({
      select: {
        id: true,
        amount: true,
        status: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const monthlyMap = new Map<
      string,
      {
        month: string;
        totalLoans: number;
        approvedLoans: number;
        pendingLoans: number;
        rejectedLoans: number;
        totalAmount: number;
      }
    >();

    for (const loan of loans) {
      const date = new Date(loan.createdAt);

      const key = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!monthlyMap.has(key)) {
        monthlyMap.set(key, {
          month: key,
          totalLoans: 0,
          approvedLoans: 0,
          pendingLoans: 0,
          rejectedLoans: 0,
          totalAmount: 0,
        });
      }

      const current = monthlyMap.get(key)!;

      current.totalLoans++;
      current.totalAmount += Number(loan.amount);

      if (loan.status === LoanStatus.APPROVED) {
        current.approvedLoans++;
      } else if (loan.status === LoanStatus.PENDING) {
        current.pendingLoans++;
      } else if (loan.status === LoanStatus.REJECTED) {
        current.rejectedLoans++;
      }
    }

    res.status(200).json({
      success: true,
      data: Array.from(monthlyMap.values()),
    });

    return;
  } catch (error) {
    console.error("MONTHLY LOAN ANALYTICS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch monthly loan analytics",
    });

    return;
  }
};




