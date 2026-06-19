import prisma
from "../prisma/prisma";


/* ========================================
   CREATE RECHARGE SERVICE
======================================== */

export const createRechargeService =
  async (

    data: {

      userId: string;

      mobileNumber: string;

      operator: string;

      amount: number;

      rechargeType: string;

    }

  ) => {

    return await prisma.recharge.create({

      data: {

        userId:
          data.userId,

        mobileNumber:
          data.mobileNumber,

        operator:
          data.operator,

        amount:
          data.amount,

        rechargeType:
          data.rechargeType,

        status: "success",

      },

    });

  };


/* ========================================
   GET USER RECHARGES
======================================== */

export const getUserRechargeService =
  async (

    userId: string

  ) => {

    return await prisma.recharge.findMany({

      where: {

        userId,

      },

      orderBy: {

        createdAt: "desc",

      },

    });

  };