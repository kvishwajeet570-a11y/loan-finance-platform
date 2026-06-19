import prisma
from "../prisma/prisma";


/* ========================================
   CHECK BALANCE
======================================== */

export const checkWalletBalance =
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

    if (
      wallet.balance < amount
    ) {

      throw new Error(
        "Insufficient balance"
      );

    }

    return wallet;

  };


/* ========================================
   UPDATE BALANCE
======================================== */

export const updateWalletBalance =
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

    return await prisma.wallet.update({

      where: {

        userId,

      },

      data: {

        balance:
          wallet.balance + amount,

      },

    });

  };