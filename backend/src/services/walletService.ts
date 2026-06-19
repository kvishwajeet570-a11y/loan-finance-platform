import prisma
from "../prisma/prisma";


/* ========================================
   GET WALLET SERVICE
======================================== */

export const getWalletService =
  async (

    userId: string

  ) => {

    return await prisma.wallet.findUnique({

      where: {

        userId,

      },

      include: {

        transactions: true,

        walletHistory: true,

      },

    });

  };


/* ========================================
   ADD MONEY SERVICE
======================================== */

export const addMoneyService =
  async (

    userId: string,

    amount: number

  ) => {

    const wallet =
      await prisma.wallet.findUnique({

        where: {

          userId,

        },

      });

    if (!wallet) {

      throw new Error(
        "Wallet not found"
      );

    }

    const updatedWallet =
      await prisma.wallet.update({

        where: {

          userId,

        },

        data: {

          balance:
            wallet.balance + amount,

          totalEarnings:
            wallet.totalEarnings + amount,

        },

      });

    await prisma.transaction.create({

      data: {

        walletId: wallet.id,

        type: "credit",

        amount,

        description:
          "Money Added",

        status: "success",

      },

    });

    return updatedWallet;

  };