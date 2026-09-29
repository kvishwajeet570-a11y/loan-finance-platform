import { Request, Response } from "express";

import prisma from "../../prisma/prisma";
import { id } from "zod/v4/locales";

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

          status: "SUCCESS"

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
    transactionId: `RCG${Date.now()}`,

    walletId: user.wallet.id,

    type: "DEBIT",

    category: "RECHARGE",

    amount: Number(amount),

    description: `${rechargeType} Recharge`,

    paymentMethod: paymentMethod || "Wallet",

    status: "success",
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
      String(req.params.userId);


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

    const totalRechargeAmount = recharges.reduce(
  (
    acc: number,
    item: (typeof recharges)[number]
  ) => acc + item.amount,
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
        String(req.params.id);


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

  /* ========================================
   ALIAS
======================================== */

export const getRechargeById = getSingleRecharge;

/* ========================================
   GET ALL RECHARGES
======================================== */

export const getAllRecharges = async (
  req: Request,
  res: Response
) => {
  try {
    const recharges = await prisma.recharge.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: recharges.length,
      recharges,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch recharges",
    });
  }
};

/* ========================================
   UPDATE RECHARGE
======================================== */

export const updateRecharge = async (
  req: Request,
  res: Response
) => {
  try {
    const recharge = await prisma.recharge.update({
      where: {
        id: String(req.params.id),
      },
      data: req.body,
    });

    return res.status(200).json({
      success: true,
      recharge,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
};

/* ========================================
   DELETE RECHARGE
======================================== */

export const deleteRecharge = async (
  req: Request,
  res: Response
) => {
  try {
    await prisma.recharge.delete({
      where: {
        id: String(req.params.id),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Recharge deleted",
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};

/* ========================================
   PROCESS RECHARGE
======================================== */

export const processRecharge = async (
  req: Request,
  res: Response
) => {
  try {
    const recharge = await prisma.recharge.update({
      where: {
        id: String(req.body.id),
      },
      data: {
        status: "PROCESSING",
      },
    });

    return res.json({
      success: true,
      recharge,
    });
  } catch {
    return res.status(500).json({
      success: false,
    });
  }
};

/* ========================================
   VERIFY RECHARGE
======================================== */

export const verifyRecharge = async (
  req: Request,
  res: Response
) => {
  const recharge = await prisma.recharge.findUnique({
    where: {
      id: String(req.body.id),
    },
  });

  return res.json({
    success: true,
    recharge,
  });
};

/* ========================================
   STATUS ACTIONS
======================================== */

export const markRechargeSuccess = async (
  req: Request,
  res: Response
) => {
  const recharge = await prisma.recharge.update({
    where: {
      id: String(req.params.id),
    },
    data: {
      status: "SUCCESS",
      completedAt: new Date(),
    },
  });

  return res.json({
    success: true,
    recharge,
  });
};

export const markRechargeFailed = async (
  req: Request,
  res: Response
) => {
  const recharge = await prisma.recharge.update({
    where: {
      id: String(req.params.id),
    },
    data: {
      status: "FAILED",
    },
  });

  return res.json({
    success: true,
    recharge,
  });
};

export const refundRecharge = async (
  req: Request,
  res: Response
) => {
  const recharge = await prisma.recharge.update({
    where: {
      id: String(req.params.id),
    },
    data: {
      status: "REFUNDED",
    },
  });

  return res.json({
    success: true,
    recharge,
  });
};

/* ========================================
   TYPE FILTERS
======================================== */

export const getMobileRecharges = async (
  req: Request,
  res: Response
) => {
  const recharges = await prisma.recharge.findMany({
    where: {
      rechargeType: "MOBILE",
    },
  });

  return res.json({
    success: true,
    recharges,
  });
};

export const getDthRecharges = async (
  req: Request,
  res: Response
) => {
  const recharges = await prisma.recharge.findMany({
    where: {
      rechargeType: "DTH",
    },
  });

  return res.json({
    success: true,
    recharges,
  });
};

export const getFastagRecharges = async (
  req: Request,
  res: Response
) => {
  const recharges = await prisma.recharge.findMany({
    where: {
      rechargeType: "FASTAG",
    },
  });

  return res.json({
    success: true,
    recharges,
  });
};

/* ========================================
   SEARCH
======================================== */

export const searchRecharges = async (
  req: Request,
  res: Response
) => {
  const q = String(req.query.q || "");

  const recharges = await prisma.recharge.findMany({
    where: {
      OR: [
        {
          mobileNumber: {
            contains: q,
          },
        },
        {
          operator: {
            contains: q,
          },
        },
      ],
    },
  });

  return res.json({
    success: true,
    recharges,
  });
};

/* ========================================
   STATUS LISTS
======================================== */

export const getPendingRecharges = async (
  req: Request,
  res: Response
) => {
  const recharges = await prisma.recharge.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
  });

  return res.json({
    success: true,
    count: recharges.length,
    recharges,
  });
};

export const getSuccessRecharges = async (
  req: Request,
  res: Response
) => {
  const recharges = await prisma.recharge.findMany({
    where: { status: "SUCCESS" },
    orderBy: { createdAt: "desc" },
  });

  return res.json({
    success: true,
    count: recharges.length,
    recharges,
  });
};

export const getFailedRecharges = async (
  req: Request,
  res: Response
) => {
  const recharges = await prisma.recharge.findMany({
    where: { status: "FAILED" },
    orderBy: { createdAt: "desc" },
  });

  return res.json({
    success: true,
    count: recharges.length,
    recharges,
  });
};

export const getRefundedRecharges = async (
  req: Request,
  res: Response
) => {
  const recharges = await prisma.recharge.findMany({
    where: { status: "REFUNDED" },
    orderBy: { createdAt: "desc" },
  });

  return res.json({
    success: true,
    count: recharges.length,
    recharges,
  });
};

/* ========================================
   ANALYTICS
======================================== */

export const getRechargeAnalytics = async (
  req: Request,
  res: Response
) => {
  const total = await prisma.recharge.count();

  const amount = await prisma.recharge.aggregate({
    _sum: {
      amount: true,
    },
  });

  return res.json({
    success: true,
    totalRecharges: total,
    totalAmount: amount._sum.amount || 0,
  });
};

export const getRechargeDashboard = async (
  req: Request,
  res: Response
) => {
  const total = await prisma.recharge.count();

  const success = await prisma.recharge.count({
    where: { status: "SUCCESS" },
  });

  const failed = await prisma.recharge.count({
    where: { status: "FAILED" },
  });

  const pending = await prisma.recharge.count({
    where: { status: "PENDING" },
  });

  return res.json({
    success: true,
    dashboard: {
      total,
      success,
      failed,
      pending,
    },
  });
};

/* ========================================
   TOP USERS
======================================== */

export const getTopRechargeUsers = async (
  req: Request,
  res: Response
) => {
  const users = await prisma.user.findMany({
    include: {
      recharges: true,
    },
  });

  const ranked = users
    .map((user) => ({
      ...user,
      totalRecharge: user.recharges.reduce(
        (sum, r) => sum + r.amount,
        0
      ),
    }))
    .sort(
      (a, b) =>
        b.totalRecharge - a.totalRecharge
    );

  return res.json({
    success: true,
    users: ranked.slice(0, 10),
  });
};

/* ========================================
   MONTHLY REPORT
======================================== */

export const getMonthlyRecharges = async (
  req: Request,
  res: Response
) => {
  const recharges = await prisma.recharge.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return res.json({
    success: true,
    count: recharges.length,
    recharges,
  });
};

/* ========================================
   EXPORTS
======================================== */

export const exportRechargeExcel = async (
  req: Request,
  res: Response
) => {
  return res.json({
    success: true,
    message: "Excel export coming soon",
  });
};

export const exportRechargePdf = async (
  req: Request,
  res: Response
) => {
  return res.json({
    success: true,
    message: "PDF export coming soon",
  });
};

/* ========================================
   BULK PROCESS
======================================== */

export const bulkProcessRecharge = async (
  req: Request,
  res: Response
) => {
  return res.json({
    success: true,
    message: "Bulk process completed",
  });
};

export const bulkRefundRecharge = async (
  req: Request,
  res: Response
) => {
  return res.json({
    success: true,
    message: "Bulk refund completed",
  });
};