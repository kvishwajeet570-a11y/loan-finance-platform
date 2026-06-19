import { Request, Response } from "express";

import prisma from "../prisma/prisma";

import crypto from "crypto";


/* ========================================
   GENERATE REFERRAL CODE
======================================== */

const generateReferralCode = () => {

  return (

    "LP" +

    crypto
      .randomBytes(3)
      .toString("hex")
      .toUpperCase()

  );

};


/* ========================================
   CREATE REFERRAL
======================================== */

export const createReferral = async (

  req: Request,

  res: Response

) => {

  try {

    const {

      userId,

    } = req.body;


    /* VALIDATION */

    if (!userId) {

      return res.status(400).json({

        success: false,

        message:
          "User ID is required",

      });

    }


    /* CHECK USER */

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


    /* CHECK EXISTING REFERRAL */

    const existingReferral =
      await prisma.referral.findUnique({

        where: {

          userId,

        },

      });


    if (existingReferral) {

      return res.status(400).json({

        success: false,

        message:
          "Referral already exists",

      });

    }


    /* GENERATE REFERRAL CODE */

    const referralCode =
      generateReferralCode();


    /* CREATE REFERRAL */

    const referral =
      await prisma.referral.create({

        data: {

          userId,

          referralCode,

          rewardAmount: 0,

          totalReferrals: 0,

        },

      });


    /* CREATE NOTIFICATION */

    await prisma.notification.create({

      data: {

        userId,

        title:
          "Referral Activated",

        message:
          "Your referral account has been created successfully.",

        type:
          "referral",

      },

    });


    return res.status(201).json({

      success: true,

      message:
        "Referral created successfully",

      referral,

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
        "Failed to create referral",

    });

  }

};


/* ========================================
   GET REFERRAL
======================================== */

export const getReferral = async (

  req: Request,

  res: Response

) => {

  try {

    const userId =
      req.params.userId as string;


    if (!userId) {

      return res.status(400).json({

        success: false,

        message:
          "User ID is required",

      });

    }


    const referral =
      await prisma.referral.findUnique({

        where: {

          userId,

        },

        include: {

          referralHistory: {

            orderBy: {

              createdAt: "desc",

            },

          },

        },

      });


    if (!referral) {

      return res.status(404).json({

        success: false,

        message:
          "Referral not found",

      });

    }


    return res.status(200).json({

      success: true,

      referral,

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch referral",

    });

  }

};


/* ========================================
   APPLY REFERRAL CODE
======================================== */

export const applyReferralCode =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      const {

        userId,
        referralCode,

      } = req.body;


      /* VALIDATION */

      if (

        !userId ||

        !referralCode

      ) {

        return res.status(400).json({

          success: false,

          message:
            "User ID and referral code are required",

        });

      }


      /* FIND REFERRAL */

      const referral =
        await prisma.referral.findUnique({

          where: {

            referralCode,

          },

        });


      if (!referral) {

        return res.status(404).json({

          success: false,

          message:
            "Invalid referral code",

        });

      }


      /* UPDATE REFERRAL */

      await prisma.referral.update({

        where: {

          id: referral.id,

        },

        data: {

          totalReferrals: {

            increment: 1,

          },

          rewardAmount: {

            increment: 100,

          },

        },

      });


      /* CREATE REFERRAL HISTORY */

      await prisma.referralHistory.create({

        data: {

          referralId:
            referral.id,

          referredUserId:
            userId,

          rewardAmount:
            100,

        },

      });


      /* UPDATE WALLET */

      const wallet =
        await prisma.wallet.findUnique({

          where: {

            userId:
              referral.userId,

          },

        });


      if (wallet) {

        await prisma.wallet.update({

          where: {

            id: wallet.id,

          },

          data: {

            balance: {

              increment: 100,

            },

          },

        });

      }


      /* CREATE TRANSACTION */

      if (wallet) {

        await prisma.transaction.create({

          data: {

            walletId:
              wallet.id,

            type:
              "credit",

            amount:
              100,

            description:
              "Referral Bonus",

            paymentMethod:
              "Referral",

            status:
              "success",

            transactionId:
              `REF${Date.now()}`,

          },

        });

      }


      /* CREATE NOTIFICATION */

      await prisma.notification.create({

        data: {

          userId:
            referral.userId,

          title:
            "Referral Reward Earned",

          message:
            "You earned ₹100 referral reward.",

          type:
            "referral",

        },

      });


      return res.status(200).json({

        success: true,

        message:
          "Referral code applied successfully",

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to apply referral code",

      });

    }

  };