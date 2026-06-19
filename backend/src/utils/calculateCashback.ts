import prisma
from "../prisma/prisma";


/* ========================================
   CALCULATE CASHBACK
======================================== */

const calculateCashback =
  async (

    userId: string,

    amount: number

  ) => {

    /* ========================================
       CASHBACK LOGIC
    ======================================== */

    let cashback = 0;

    if (amount >= 100) {

      cashback =
        amount * 0.05;

    }

    /* ========================================
       FIND WALLET
    ======================================== */

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

    /* ========================================
       UPDATE CASHBACK
    ======================================== */

    const updatedWallet =
      await prisma.wallet.update({

        where: {

          userId,

        },

        data: {

          cashback:
            wallet.cashback + cashback,

        },

      });

    return {

      cashback,

      wallet:
        updatedWallet,

    };

  };

export default
calculateCashback;