import {

  Request,
  Response,

} from "express";

import prisma
from "../prisma/prisma";


/* ========================================
   GET WALLET
======================================== */

export const getWallet =
  async (

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


      const wallet =
        await prisma.wallet.findUnique({

          where: {

            userId,

          },

          include: {

            transactions: {

              orderBy: {

                createdAt: "desc",

              },

            },

          },

        });


      if (!wallet) {

        return res.status(404).json({

          success: false,

          message:
            "Wallet not found",

        });

      }


      return res.status(200).json({

        success: true,

        wallet,

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch wallet",

      });

    }

  };


/* ========================================
   ADD MONEY
======================================== */

export const addMoney =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      const {

        userId,
        amount,

      } = req.body;


      if (

        !userId ||

        !amount

      ) {

        return res.status(400).json({

          success: false,

          message:
            "User ID and amount are required",

        });

      }


      const wallet =
        await prisma.wallet.findUnique({

          where: {

            userId,

          },

        });


      if (!wallet) {

        return res.status(404).json({

          success: false,

          message:
            "Wallet not found",

        });

      }


      const updatedWallet =
        await prisma.wallet.update({

          where: {

            userId,

          },

          data: {

            balance: {

              increment:
                Number(amount),

            },

          },

        });


      await prisma.transaction.create({

        data: {

          walletId:
            wallet.id,

          type:
            "credit",

          amount:
            Number(amount),

          description:
            "Money Added",

          status:
            "success",

        },

      });


      return res.status(200).json({

        success: true,

        message:
          "Money added successfully",

        wallet:
          updatedWallet,

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to add money",

      });

    }

  };


/* ========================================
   WITHDRAW MONEY
======================================== */

export const withdrawMoney =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      const {

        userId,
        amount,

      } = req.body;


      if (

        !userId ||

        !amount

      ) {

        return res.status(400).json({

          success: false,

          message:
            "User ID and amount are required",

        });

      }


      const wallet =
        await prisma.wallet.findUnique({

          where: {

            userId,

          },

        });


      if (!wallet) {

        return res.status(404).json({

          success: false,

          message:
            "Wallet not found",

        });

      }


      if (

        wallet.balance <
        Number(amount)

      ) {

        return res.status(400).json({

          success: false,

          message:
            "Insufficient balance",

        });

      }


      const updatedWallet =
        await prisma.wallet.update({

          where: {

            userId,

          },

          data: {

            balance: {

              decrement:
                Number(amount),

            },

          },

        });


      await prisma.transaction.create({

        data: {

          walletId:
            wallet.id,

          type:
            "debit",

          amount:
            Number(amount),

          description:
            "Money Withdrawn",

          status:
            "success",

        },

      });


      return res.status(200).json({

        success: true,

        message:
          "Money withdrawn successfully",

        wallet:
          updatedWallet,

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to withdraw money",

      });

    }

  };


/* ========================================
   GET WALLET HISTORY
======================================== */

export const getWalletHistory =
  async (

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


      const wallet =
        await prisma.wallet.findUnique({

          where: {

            userId,

          },

          include: {

            transactions: {

              orderBy: {

                createdAt: "desc",

              },

            },

          },

        });


      if (!wallet) {

        return res.status(404).json({

          success: false,

          message:
            "Wallet not found",

        });

      }


      return res.status(200).json({

        success: true,

        transactions:
          wallet.transactions,

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch wallet history",

      });

    }

  };