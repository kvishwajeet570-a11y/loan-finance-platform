import { Request, Response } from "express";

import prisma from "../prisma/prisma";


/* ========================================
   GET ALL TRANSACTIONS
======================================== */

export const getTransactions = async (

  req: Request,

  res: Response

) => {

  try {

    /* ========================================
       GET WALLET ID
    ======================================== */

    const walletId =
      req.params.walletId as string;


    /* ========================================
       VALIDATION
    ======================================== */

    if (!walletId) {

      return res.status(400).json({

        success: false,

        message:
          "Wallet ID is required",

      });

    }


    /* ========================================
       CHECK WALLET
    ======================================== */

    const wallet =
      await prisma.wallet.findUnique({

        where: {

          id: walletId,

        },

      });


    if (!wallet) {

      return res.status(404).json({

        success: false,

        message:
          "Wallet not found",

      });

    }


    /* ========================================
       FETCH TRANSACTIONS
    ======================================== */

    const transactions =
      await prisma.transaction.findMany({

        where: {

          walletId,

        },

        orderBy: {

          createdAt: "desc",

        },

      });


    /* ========================================
       TRANSACTION STATS
    ======================================== */

    const totalCredit =
      transactions

        .filter(

          (item) =>
            item.type === "credit"

        )

        .reduce(

          (acc, item) =>
            acc + item.amount,

          0

        );


    const totalDebit =
      transactions

        .filter(

          (item) =>
            item.type === "debit"

        )

        .reduce(

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
        transactions.length,

      totalCredit,

      totalDebit,

      transactions,

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch transactions",

    });

  }

};


/* ========================================
   CREATE TRANSACTION
======================================== */

export const createTransaction = async (

  req: Request,

  res: Response

) => {

  try {

    /* ========================================
       GET DATA
    ======================================== */

    const {

      walletId,
      type,
      amount,
      description,
      paymentMethod,

    } = req.body;


    /* ========================================
       VALIDATION
    ======================================== */

    if (

      !walletId ||

      !type ||

      !amount

    ) {

      return res.status(400).json({

        success: false,

        message:
          "Required fields are missing",

      });

    }


    /* ========================================
       CHECK WALLET
    ======================================== */

    const wallet =
      await prisma.wallet.findUnique({

        where: {

          id: walletId,

        },

      });


    if (!wallet) {

      return res.status(404).json({

        success: false,

        message:
          "Wallet not found",

      });

    }


    /* ========================================
       CHECK INSUFFICIENT BALANCE
    ======================================== */

    if (

      type === "debit" &&

      wallet.balance <
        Number(amount)

    ) {

      return res.status(400).json({

        success: false,

        message:
          "Insufficient wallet balance",

      });

    }


    /* ========================================
       CREATE TRANSACTION
    ======================================== */

    const transaction =
      await prisma.transaction.create({

        data: {

          walletId,

          type,

          amount:
            Number(amount),

          description,

          paymentMethod:
            paymentMethod || "UPI",

          status: "success",

          transactionId:
            `TXN${Date.now()}`,

        },

      });


    /* ========================================
       UPDATE WALLET BALANCE
    ======================================== */

    if (type === "credit") {

      await prisma.wallet.update({

        where: {

          id: walletId,

        },

        data: {

          balance: {

            increment:
              Number(amount),

          },

        },

      });

    }


    if (type === "debit") {

      await prisma.wallet.update({

        where: {

          id: walletId,

        },

        data: {

          balance: {

            decrement:
              Number(amount),

          },

        },

      });

    }


    /* ========================================
       CREATE WALLET HISTORY
    ======================================== */

    const updatedWallet =
      await prisma.wallet.findUnique({

        where: {

          id: walletId,

        },

      });


    if (updatedWallet) {

      await prisma.walletHistory.create({

        data: {

          walletId,

          balance:
            updatedWallet.balance,

        },

      });

    }


    /* ========================================
       CREATE NOTIFICATION
    ======================================== */

    await prisma.notification.create({

      data: {

        userId:
          wallet.userId,

        title:
          "Transaction Successful",

        message:
          `₹${amount} ${type} transaction completed successfully`,

        type:
          "transaction",

      },

    });


    /* ========================================
       RESPONSE
    ======================================== */

    return res.status(201).json({

      success: true,

      message:
        "Transaction created successfully",

      transaction,

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
        "Failed to create transaction",

    });

  }

};


/* ========================================
   GET SINGLE TRANSACTION
======================================== */

export const getSingleTransaction =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      const id =
        req.params.id as string;


      const transaction =
        await prisma.transaction.findUnique({

          where: {

            id,

          },

        });


      if (!transaction) {

        return res.status(404).json({

          success: false,

          message:
            "Transaction not found",

        });

      }


      return res.status(200).json({

        success: true,

        transaction,

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch transaction",

      });

    }

  };


/* ========================================
   DELETE TRANSACTION
======================================== */

export const deleteTransaction =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      const id =
        req.params.id as string;


      const transaction =
        await prisma.transaction.findUnique({

          where: {

            id,

          },

        });


      if (!transaction) {

        return res.status(404).json({

          success: false,

          message:
            "Transaction not found",

        });

      }


      await prisma.transaction.delete({

        where: {

          id,

        },

      });


      return res.status(200).json({

        success: true,

        message:
          "Transaction deleted successfully",

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to delete transaction",

      });

    }

  };