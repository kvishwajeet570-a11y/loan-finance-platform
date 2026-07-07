import { Request, Response } from "express";

import prisma from "../prisma/prisma";


/* ========================================
   GET DASHBOARD ANALYTICS
======================================== */

export const getAnalytics =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      /* ========================================
         FETCH ALL ANALYTICS
      ======================================== */

      const [

        totalUsers,

        totalLoans,

        approvedLoans,

        pendingLoans,

        rejectedLoans,

        totalTransactions,

        totalRecharges,

        totalWalletBalance,

        totalRevenue,

        totalReferrals,

        recentUsers,

        recentTransactions,

        recentLoans,

        topUsers,

      ] = await Promise.all([

        /* TOTAL USERS */

        prisma.user.count(),


        /* TOTAL LOANS */

        prisma.loanApplication.count(),


        /* APPROVED LOANS */

        prisma.loanApplication.count({

          where: {

            status: "approved",

          },

        }),


        /* PENDING LOANS */

        prisma.loanApplication.count({

          where: {

            status: "pending",

          },

        }),


        /* REJECTED LOANS */

        prisma.loanApplication.count({

          where: {

            status: "rejected",

          },

        }),


        /* TOTAL TRANSACTIONS */

        prisma.transaction.count(),


        /* TOTAL RECHARGES */

        prisma.recharge.aggregate({

          _sum: {

            amount: true,

          },

        }),


        /* TOTAL WALLET BALANCE */

        prisma.wallet.aggregate({

          _sum: {

            balance: true,

          },

        }),


        /* TOTAL REVENUE */

        prisma.transaction.aggregate({

          _sum: {

            amount: true,

          },

        }),


        /* TOTAL REFERRALS */

        prisma.referral.aggregate({

          _sum: {

            totalReferrals: true,

          },

        }),


        /* RECENT USERS */

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


        /* RECENT TRANSACTIONS */

        prisma.transaction.findMany({

          take: 5,

          orderBy: {

            createdAt: "desc",

          },

        }),


        /* RECENT LOANS */

        prisma.loanApplication.findMany({

          take: 5,

          orderBy: {

            createdAt: "desc",

          },

        }),


        /* TOP USERS */

        prisma.user.findMany({

          take: 5,

          orderBy: {

            createdAt: "desc",

          },

          include: {

            wallet: true,

            referral: true,

          },

        }),

      ]);


      /* ========================================
         PERFORMANCE %
      ======================================== */

      const performance =

        totalLoans > 0

          ? Math.round(

              (

                approvedLoans /

                totalLoans

              ) * 100

            )

          : 0;


      /* ========================================
         MONTHLY REVENUE
      ======================================== */

      const monthlyRevenue =
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

          select: {

            amount: true,

            createdAt: true,

          },

        });


      /* ========================================
         MONTHLY USERS
      ======================================== */

      const monthlyUsers =
        await prisma.user.count({

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


      /* ========================================
         MONTHLY LOANS
      ======================================== */

      const monthlyLoans =
        await prisma.loanApplication.count({

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


      /* ========================================
         RECENT RECHARGES
      ======================================== */

      const recentRecharges =
        await prisma.recharge.findMany({

          take: 5,

          orderBy: {

            createdAt: "desc",

          },

        });


      /* ========================================
         RECENT NOTIFICATIONS
      ======================================== */

      const recentNotifications =
        await prisma.notification.findMany({

          take: 5,

          orderBy: {

            createdAt: "desc",

          },

        });


      /* ========================================
         DASHBOARD RESPONSE
      ======================================== */

      return res.status(200).json({

        success: true,

        analytics: {

          totalUsers,

          totalLoans,

          approvedLoans,

          pendingLoans,

          rejectedLoans,

          totalTransactions,

          performance,

          monthlyUsers,

          monthlyLoans,

          totalRecharge:

            totalRecharges._sum.amount || 0,

          totalWalletBalance:

            totalWalletBalance._sum.balance || 0,

          totalRevenue:

            totalRevenue._sum.amount || 0,

          totalReferrals:

            totalReferrals._sum.totalReferrals || 0,

        },

        charts: {

          monthlyRevenue,

        },

        recentData: {

          recentUsers,

          recentTransactions,

          recentLoans,

          recentRecharges,

          recentNotifications,

        },

        leaderboard: {

          topUsers,

        },

      });

    } catch (error) {

      console.log(

        "ANALYTICS ERROR => ",

        error

      );

      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch analytics",

      });

    }

  };