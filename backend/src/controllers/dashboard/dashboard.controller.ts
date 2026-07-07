import {

  Request,
  Response,

} from "express";

import prisma from "../prisma/prisma";


/* ========================================
   GET DASHBOARD STATS
======================================== */

export const getDashboardStats =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      /* ========================================
         FETCH ANALYTICS
      ======================================== */

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

        /* TOTAL LEADS */

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


        /* TOTAL USERS */

        prisma.user.count(),


        /* TOTAL RECHARGES */

        prisma.recharge.count(),


        /* TOTAL TRANSACTIONS */

        prisma.transaction.count(),


        /* WALLET BALANCE */

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


        /* RECENT LOANS */

        prisma.loanApplication.findMany({

          take: 5,

          orderBy: {

            createdAt: "desc",

          },

        }),


        /* RECENT TRANSACTIONS */

        prisma.transaction.findMany({

          take: 5,

          orderBy: {

            createdAt: "desc",

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

            createdAt: true,

          },

        }),

      ]);


      /* ========================================
         MONTHLY REVENUE
      ======================================== */

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

            total,

            transaction

          ) =>

            total +

            transaction.amount,

          0

        );


      /* ========================================
         PERFORMANCE %
      ======================================== */

      const performance =

        totalLeads > 0

          ? Math.round(

              (

                approvedLoans /

                totalLeads

              ) * 100

            )

          : 0;


      /* ========================================
         RESPONSE
      ======================================== */

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

            walletBalance._sum.balance || 0,

          totalRevenue:

            revenue._sum.amount || 0,

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