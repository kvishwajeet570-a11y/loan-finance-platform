import {

  Request,
  Response,

} from "express";

import prisma from "../prisma/prisma";


/* ========================================
   GET ALL USERS
======================================== */

export const getUsers =
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

            loans: true,

            recharges: true,

          },

          orderBy: {

            createdAt: "desc",

          },

        });


      return res.status(200).json({

        success: true,

        totalUsers:
          users.length,

        users,

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch users",

      });

    }

  };


/* ========================================
   GET SINGLE USER
======================================== */

export const getSingleUser =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      /* USER ID */

      const id =
        req.params.id as string;


      /* VALIDATION */

      if (!id) {

        return res.status(400).json({

          success: false,

          message:
            "User ID is required",

        });

      }


      /* FIND USER */

      const user =
        await prisma.user.findUnique({

          where: {

            id,

          },

          include: {

            wallet: {

              include: {

                transactions: true,

                walletHistory: true,

              },

            },

            loans: true,

            referral: {

              include: {

                referralHistory: true,

              },

            },

            recharges: true,

            fastagRecharges: true,

            electricityBills: true,

            supportTickets: true,

            activities: true,

            securityLogs: true,

          },

        });


      /* USER NOT FOUND */

      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",

        });

      }


      /* RESPONSE */

      return res.status(200).json({

        success: true,

        user,

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch user",

      });

    }

  };


/* ========================================
   BLOCK USER
======================================== */

export const blockUser =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      const { userId } =
        req.body;


      if (!userId) {

        return res.status(400).json({

          success: false,

          message:
            "User ID is required",

        });

      }


      const user =
        await prisma.user.update({

          where: {

            id: userId,

          },

          data: {

            isBlocked: true,

          },

        });


      /* NOTIFICATION */

      await prisma.notification.create({

        data: {

          userId,

          title:
            "Account Blocked",

          message:
            "Your account has been blocked by admin.",

          type:
            "security",

        },

      });


      return res.status(200).json({

        success: true,

        message:
          "User blocked successfully",

        user,

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to block user",

      });

    }

  };


/* ========================================
   UNBLOCK USER
======================================== */

export const unblockUser =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      const { userId } =
        req.body;


      if (!userId) {

        return res.status(400).json({

          success: false,

          message:
            "User ID is required",

        });

      }


      const user =
        await prisma.user.update({

          where: {

            id: userId,

          },

          data: {

            isBlocked: false,

          },

        });


      /* NOTIFICATION */

      await prisma.notification.create({

        data: {

          userId,

          title:
            "Account Activated",

          message:
            "Your account has been activated again.",

          type:
            "general",

        },

      });


      return res.status(200).json({

        success: true,

        message:
          "User unblocked successfully",

        user,

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to unblock user",

      });

    }

  };


/* ========================================
   DELETE USER
======================================== */

export const deleteUser =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      const { userId } =
        req.body;


      if (!userId) {

        return res.status(400).json({

          success: false,

          message:
            "User ID is required",

        });

      }


      await prisma.user.delete({

        where: {

          id: userId,

        },

      });


      return res.status(200).json({

        success: true,

        message:
          "User deleted successfully",

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to delete user",

      });

    }

  };


/* ========================================
   ADMIN ANALYTICS
======================================== */

export const adminAnalytics =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      const totalUsers =
        await prisma.user.count();

      const totalLoans =
        await prisma.loanApplication.count();

      const totalRecharges =
        await prisma.recharge.count();

      const totalTransactions =
        await prisma.transaction.count();

      const totalRevenue =
        await prisma.transaction.aggregate({

          _sum: {

            amount: true,

          },

        });


      const recentUsers =
        await prisma.user.findMany({

          take: 5,

          orderBy: {

            createdAt: "desc",

          },

        });


      return res.status(200).json({

        success: true,

        analytics: {

          totalUsers,

          totalLoans,

          totalRecharges,

          totalTransactions,

          totalRevenue:
            totalRevenue._sum.amount || 0,

        },

        recentUsers,

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch analytics",

      });

    }

  };