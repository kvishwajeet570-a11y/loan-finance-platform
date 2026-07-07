import {
  Request,
  Response,
} from "express";

import prisma
from "../prisma/prisma";

/* ========================================
   GET REVENUE ANALYTICS
======================================== */

export const getRevenueAnalytics =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      /* TOTAL USERS */

      const totalUsers =
        await prisma.user.count();

      /* TOTAL LOANS */

      const totalLoans =
        await prisma.loanApplication.count();

      /* APPROVED LOANS */

      const approvedLoans =
        await prisma.loanApplication.count({

          where: {
            status: "approved",
          },

        });

      /* PENDING LOANS */

      const pendingLoans =
        await prisma.loanApplication.count({

          where: {
            status: "pending",
          },

        });

      /* TOTAL RECHARGES */

      const totalRecharges =
        await prisma.recharge.count();

      /* TOTAL TRANSACTIONS */

      const totalTransactions =
        await prisma.transaction.count();

      /* TOTAL REVENUE */

      const revenue =
        await prisma.transaction.aggregate({

          _sum: {
            amount: true,
          },

        });

      /* TOTAL COMMISSION */

      const commission =
        await prisma.commission.aggregate({

          _sum: {
            amount: true,
          },

        });

      /* TOTAL WALLET BALANCE */

      const walletBalance =
        await prisma.wallet.aggregate({

          _sum: {
            balance: true,
          },

        });

      /* MONTHLY REVENUE */

      const monthlyRevenue =
        await prisma.transaction.findMany({

          select: {
            amount: true,
            createdAt: true,
          },

          orderBy: {
            createdAt: "asc",
          },

        });

      /* RECENT TRANSACTIONS */

      const recentTransactions =
        await prisma.transaction.findMany({

          take: 10,

          orderBy: {
            createdAt: "desc",
          },

        });

      /* SAFE VALUES */

      const totalRevenue =
        revenue?._sum?.amount ?? 0;

      const totalCommission =
        commission?._sum?.amount ?? 0;

      const totalWalletBalance =
        walletBalance?._sum?.balance ?? 0;

      /* RESPONSE */

      return res.status(200).json({

        success: true,

        analytics: {

          totalUsers,

          totalLoans,

          approvedLoans,

          pendingLoans,

          totalRecharges,

          totalTransactions,

          totalRevenue,

          totalCommission,

          totalWalletBalance,

        },

        monthlyRevenue,

        recentTransactions,

      });

    } catch (error: any) {

      console.log(
        "REVENUE ERROR =>",
        error
      );

      return res.status(500).json({

        success: false,

        error: error.message,

        message:
          "Failed to fetch analytics",

      });

    }

  };

/* ========================================
   MONTHLY REVENUE
======================================== */

export const getMonthlyRevenue =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const monthlyRevenue =
        await prisma.transaction.findMany({

          orderBy: {
            createdAt: "asc",
          },

          select: {

            amount: true,

            createdAt: true,

            type: true,

            status: true,

          },

        });

      return res.status(200).json({

        success: true,

        total:
          monthlyRevenue.length,

        monthlyRevenue,

      });

    } catch (error: any) {

      console.log(
        "MONTHLY REVENUE ERROR =>",
        error
      );

      return res.status(500).json({

        success: false,

        error: error.message,

        message:
          "Failed to fetch monthly revenue",

      });

    }

  };

/* ========================================
   TOP USERS ANALYTICS
======================================== */

export const getTopUsers =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const users =
        await prisma.user.findMany({

          include: {

            wallet: true,

            referral: true,

          },

          take: 10,

          orderBy: {

            createdAt: "desc",

          },

        });

      return res.status(200).json({

        success: true,

        users,

      });

    } catch (error: any) {

      console.log(
        "TOP USERS ERROR =>",
        error
      );

      return res.status(500).json({

        success: false,

        error: error.message,

        message:
          "Failed to fetch top users",

      });

    }

  };