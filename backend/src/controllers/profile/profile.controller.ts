import {

  Request,
  Response,

} from "express";

import prisma
from "../prisma/prisma";


/* ========================================
   GET USER PROFILE
======================================== */

export const getUserProfile =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      const userId =
        req.params.userId as string;


      /* ========================================
         VALIDATION
      ======================================== */

      if (!userId) {

        return res.status(400).json({

          success: false,

          message:
            "User ID is required",

        });

      }


      /* ========================================
         FETCH USER
      ======================================== */

      const user =
        await prisma.user.findUnique({

          where: {

            id: userId,

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

            notifications: true,

            supportTickets: true,

            activities: true,

          },

        });


      /* ========================================
         CHECK USER
      ======================================== */

      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",

        });

      }


      /* ========================================
         RESPONSE
      ======================================== */

      return res.status(200).json({

        success: true,

        user,

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch profile",

      });

    }

  };


/* ========================================
   UPDATE PROFILE
======================================== */

export const updateProfile =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      const {

        userId,
        name,
        email,
        phoneNo,
        profileImage,

      } = req.body;


      /* ========================================
         VALIDATION
      ======================================== */

      if (!userId) {

        return res.status(400).json({

          success: false,

          message:
            "User ID is required",

        });

      }


      /* ========================================
         CHECK USER
      ======================================== */

      const existingUser =
        await prisma.user.findUnique({

          where: {

            id: userId,

          },

        });


      if (!existingUser) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",

        });

      }


      /* ========================================
         UPDATE USER
      ======================================== */

      const updatedUser =
        await prisma.user.update({

          where: {

            id: userId,

          },

          data: {

            name,

            email,

            phoneNo,

            profileImage,

          },

        });


      /* ========================================
         CREATE NOTIFICATION
      ======================================== */

      await prisma.notification.create({

        data: {

          userId,

          title:
            "Profile Updated",

          message:
            "Your profile has been updated successfully.",

          type:
            "profile",

        },

      });


      /* ========================================
         RESPONSE
      ======================================== */

      return res.status(200).json({

        success: true,

        message:
          "Profile updated successfully",

        user:
          updatedUser,

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to update profile",

      });

    }

  };


/* ========================================
   DELETE PROFILE
======================================== */

export const deleteProfile =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      const userId =
        req.params.userId as string;


      /* ========================================
         VALIDATION
      ======================================== */

      if (!userId) {

        return res.status(400).json({

          success: false,

          message:
            "User ID is required",

        });

      }


      /* ========================================
         CHECK USER
      ======================================== */

      const user =
        await prisma.user.findUnique({

          where: {

            id: userId,

          },

        });


      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",

        });

      }


      /* ========================================
         DELETE USER
      ======================================== */

      await prisma.user.delete({

        where: {

          id: userId,

        },

      });


      /* ========================================
         RESPONSE
      ======================================== */

      return res.status(200).json({

        success: true,

        message:
          "Profile deleted successfully",

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to delete profile",

      });

    }

  };


/* ========================================
   GET USER STATS
======================================== */

export const getUserStats =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      const userId =
        req.params.userId as string;


      const totalLoans =
        await prisma.loanApplication.count({

          where: {

            userId,

          },

        });


      const totalRecharges =
        await prisma.recharge.count({

          where: {

            userId,

          },

        });


      const totalTransactions =
        await prisma.transaction.count({

          where: {

            wallet: {

              userId,

            },

          },

        });


      const wallet =
        await prisma.wallet.findUnique({

          where: {

            userId,

          },

        });


      return res.status(200).json({

        success: true,

        stats: {

          totalLoans,

          totalRecharges,

          totalTransactions,

          walletBalance:
            wallet?.balance || 0,

        },

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch user stats",

      });

    }

  };