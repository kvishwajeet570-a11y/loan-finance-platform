import prisma
from "../prisma/prisma";


/* ========================================
   GET REFERRAL
======================================== */

export const getReferralService =
  async (

    userId: string

  ) => {

    return await prisma.referral.findUnique({

      where: {

        userId,

      },

      include: {

        referralHistory: true,

      },

    });

  };


/* ========================================
   UPDATE REFERRAL REWARD
======================================== */

export const updateReferralReward =
  async (

    userId: string,

    amount: number

  ) => {

    return await prisma.referral.update({

      where: {

        userId,

      },

      data: {

        rewardAmount: {

          increment: amount,

        },

        totalEarnings: {

          increment: amount,

        },

      },

    });

  };