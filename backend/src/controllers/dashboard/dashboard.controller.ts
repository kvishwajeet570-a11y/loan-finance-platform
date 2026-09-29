import {
  Request,
  Response,
} from "express";

import prisma from "../../config/database/prisma";

export const getDashboardStats = async (
  req: Request,
  res: Response
) => {
  try {
    const [
      totalLeads,
      approvedLoans,
      pendingLoans,
      rejectedLoans,
      totalUsers,
      totalRecharges,
      totalTransactions,
      walletBalance,
      revenue,
      recentLoans,
      recentTransactions,
      recentUsers,
    ] = await Promise.all([
      prisma.loanApplication.count(),

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

      prisma.user.count(),

      prisma.recharge.count(),

      prisma.transaction.count(),

      prisma.wallet.aggregate({
        _sum: {
          balance: true,
        },
      }),

      prisma.transaction.aggregate({
        _sum: {
          amount: true,
        },
      }),

      prisma.loanApplication.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.transaction.findMany({
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
          createdAt: true,
        },
      }),
    ]);

    const monthlyTransactions =
      await prisma.transaction.findMany({
        where: {
          createdAt: {
            gte: new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              1
            ),
          },
        },
      });

    const monthlyRevenue =
      monthlyTransactions.reduce(
        (
          total: number,
          transaction: any
        ) =>
          total +
          Number(
            transaction.amount || 0
          ),
        0
      );

    const performance =
      totalLeads > 0
        ? Math.round(
            (approvedLoans /
              totalLeads) *
              100
          )
        : 0;

    return res.status(200).json({
      success: true,

      dashboard: {
        totalLeads,
        approvedLoans,
        pendingLoans,
        rejectedLoans,
        totalUsers,
        totalRecharges,
        totalTransactions,

        totalWalletBalance:
          walletBalance?._sum?.balance ??
          0,

        totalRevenue:
          revenue?._sum?.amount ?? 0,

        monthlyRevenue,
        performance,
      },

      recentData: {
        recentLoans,
        recentTransactions,
        recentUsers,
      },
    });
  } catch (error) {
    console.log(
      "DASHBOARD ERROR =>",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch dashboard stats",
    });
  }
};

/* =====================================
   ROUTE COMPATIBILITY EXPORTS
===================================== */

export const getDashboardOverview =
  getDashboardStats;

export const getAdminDashboard =
  getDashboardStats;

export const getSuperAdminDashboard =
  getDashboardStats;

export const getCustomerDashboard =
  getDashboardStats;

export const getDsaDashboard =
  getDashboardStats;

export const getPartnerDashboard =
  getDashboardStats;

export const getLoanDashboard =
  getDashboardStats;

export const getCommissionDashboard =
  getDashboardStats;

export const getWalletDashboard =
  getDashboardStats;

export const getRevenueDashboard =
  getDashboardStats;

export const getAnalyticsDashboard =
  getDashboardStats;

export const getLeaderboardDashboard =
  getDashboardStats;

export const getRecentActivities =
  getDashboardStats;

export const getRecentLoans =
  getDashboardStats;

export const getRecentUsers =
  getDashboardStats;

export const getRecentTransactions =
  getDashboardStats;

export const getNotifications =
  getDashboardStats;

export const getMonthlyStats =
  getDashboardStats;

export const getTodayStats =
  getDashboardStats;

export const getTopCustomers =
  getDashboardStats;

export const getTopDsa =
  getDashboardStats;

export const getTopPartners =
  getDashboardStats;

export const getPendingApprovals =
  getDashboardStats;

export const getPendingKyc =
  getDashboardStats;

export const getPendingLoans =
  getDashboardStats;

export const getSystemHealth =
  getDashboardStats;