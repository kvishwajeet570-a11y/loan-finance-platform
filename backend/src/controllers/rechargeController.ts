import { Request, Response } from "express";

import prisma from "../prisma/prisma";


/* ========================================
   CREATE RECHARGE
======================================== */

export const createRecharge = async (

  req: Request,

  res: Response

) => {

  try {

    const {

      userId,
      mobileNumber,
      operator,
      amount,
      rechargeType,
      paymentMethod,

    } = req.body;


    /* ========================================
       VALIDATION
    ======================================== */

    if (

      !userId ||

      !mobileNumber ||

      !operator ||

      !amount ||

      !rechargeType

    ) {

      return res.status(400).json({

        success: false,

        message:
          "All fields are required",

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

        include: {

          wallet: true,

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
       CHECK WALLET
    ======================================== */

    if (!user.wallet) {

      return res.status(404).json({

        success: false,

        message:
          "Wallet not found",

      });

    }


    /* ========================================
       CHECK BALANCE
    ======================================== */

    if (

      user.wallet.balance <
      Number(amount)

    ) {

      return res.status(400).json({

        success: false,

        message:
          "Insufficient wallet balance",

      });

    }


    /* ========================================
       CREATE RECHARGE
    ======================================== */

    const recharge =
      await prisma.recharge.create({

        data: {

          userId,

          mobileNumber,

          operator,

          amount:
            Number(amount),

          rechargeType,

          status: "success",

        },

      });


    /* ========================================
       UPDATE WALLET
    ======================================== */

    await prisma.wallet.update({

      where: {

        id:
          user.wallet.id,

      },

      data: {

        balance: {

          decrement:
            Number(amount),

        },

      },

    });


    /* ========================================
       CREATE TRANSACTION
    ======================================== */

    await prisma.transaction.create({

      data: {

        walletId:
          user.wallet.id,

        type:
          "debit",

        amount:
          Number(amount),

        description:
          `${rechargeType} Recharge`,

        paymentMethod:
          paymentMethod || "Wallet",

        status:
          "success",

        transactionId:
          `RCG${Date.now()}`,

      },

    });


    /* ========================================
       CREATE NOTIFICATION
    ======================================== */

    await prisma.notification.create({

      data: {

        userId,

        title:
          "Recharge Successful",

        message:
          `₹${amount} recharge completed successfully for ${mobileNumber}`,

        type:
          "recharge",

      },

    });


    /* ========================================
       RESPONSE
    ======================================== */

    return res.status(201).json({

      success: true,

      message:
        "Recharge completed successfully",

      recharge,

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
        "Failed to create recharge",

    });

  }

};


/* ========================================
   GET USER RECHARGES
======================================== */

export const getUserRecharges = async (

  req: Request,

  res: Response

) => {

  try {

    /* ========================================
       GET USER ID
    ======================================== */

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
       FETCH RECHARGES
    ======================================== */

    const recharges =
      await prisma.recharge.findMany({

        where: {

          userId,

        },

        orderBy: {

          createdAt: "desc",

        },

      });


    /* ========================================
       TOTAL RECHARGE AMOUNT
    ======================================== */

    const totalRechargeAmount =
      recharges.reduce(

        (acc, item) =>

          acc + item.amount,

        0

      );


    /* ========================================
       RESPONSE
    ======================================== */

    return res.status(200).json({

      success: true,

      count:
        recharges.length,

      totalRechargeAmount,

      recharges,

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch recharges",

    });

  }

};


/* ========================================
   GET SINGLE RECHARGE
======================================== */

export const getSingleRecharge =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      const id =
        req.params.id as string;


      const recharge =
        await prisma.recharge.findUnique({

          where: {

            id,

          },

        });


      if (!recharge) {

        return res.status(404).json({

          success: false,

          message:
            "Recharge not found",

        });

      }


      return res.status(200).json({

        success: true,

        recharge,

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch recharge",

      });

    }

  };