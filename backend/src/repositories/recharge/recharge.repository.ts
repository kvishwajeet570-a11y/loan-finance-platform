import { Prisma, RechargeStatus, RechargeType } from "@prisma/client";
import prisma from "../../prisma/prisma";

/* ===========================================
   CREATE
=========================================== */

export const createRechargeRepo = (
  data: Prisma.RechargeCreateInput
) => {
  return prisma.recharge.create({
    data,
    include: {
      user: true,
    },
  });
};

/* ===========================================
   FIND
=========================================== */

export const findRechargeByIdRepo = (
  id: string
) => {
  return prisma.recharge.findUnique({
    where: { id },
    include: {
      user: true,
    },
  });
};

export const findRechargeByTxnRefRepo = (
  transactionRef: string
) => {
  return prisma.recharge.findUnique({
    where: {
      transactionRef,
    },
  });
};

export const getAllRechargeRepo = () => {
  return prisma.recharge.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

/* ===========================================
   UPDATE
=========================================== */

export const updateRechargeRepo = (
  id: string,
  data: Prisma.RechargeUpdateInput
) => {
  return prisma.recharge.update({
    where: { id },
    data,
  });
};

export const deleteRechargeRepo = (
  id: string
) => {
  return prisma.recharge.delete({
    where: { id },
  });
};

/* ===========================================
   STATUS
=========================================== */

export const updateRechargeStatusRepo = (
  id: string,
  status: RechargeStatus,
  failureReason?: string
) => {
  return prisma.recharge.update({
    where: { id },
    data: {
      status,
      failureReason,
      processedAt: new Date(),
      completedAt:
        status === RechargeStatus.SUCCESS
          ? new Date()
          : undefined,
    },
  });
};

export const refundRechargeRepo = (
  id: string,
  refundedBy: string
) => {
  return prisma.recharge.update({
    where: { id },
    data: {
      status: RechargeStatus.REFUNDED,
      refundedAt: new Date(),
      refundedBy,
    },
  });
};

/* ===========================================
   USER
=========================================== */

export const getUserRechargeRepo = (
  userId: string
) => {
  return prisma.recharge.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

/* ===========================================
   MOBILE
=========================================== */

export const getMobileRechargeRepo = () => {
  return prisma.recharge.findMany({
    where: {
      rechargeType: RechargeType.MOBILE,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getDthRechargeRepo = () => {
  return prisma.recharge.findMany({
    where: {
      rechargeType: RechargeType.DTH,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getFastagRechargeRepo = () => {
  return prisma.recharge.findMany({
    where: {
      rechargeType: RechargeType.FASTAG,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

/* ===========================================
   STATUS FILTER
=========================================== */

export const getRechargeByStatusRepo = (
  status: RechargeStatus
) => {
  return prisma.recharge.findMany({
    where: {
      status,
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

/* ===========================================
   SEARCH
=========================================== */

export const searchRechargeRepo = (
  keyword: string
) => {
  return prisma.recharge.findMany({
    where: {
      OR: [
        {
          mobileNumber: {
            contains: keyword,
            mode: "insensitive",
          },
        },
        {
          operator: {
            contains: keyword,
            mode: "insensitive",
          },
        },
        {
          transactionRef: {
            contains: keyword,
            mode: "insensitive",
          },
        },
      ],
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

/* ===========================================
   ANALYTICS
=========================================== */

export const rechargeAnalyticsRepo =
  async () => {
    const [
      total,
      pending,
      success,
      failed,
      refunded,
      totalAmount,
      totalCommission,
    ] = await Promise.all([
      prisma.recharge.count(),

      prisma.recharge.count({
        where: {
          status: RechargeStatus.PENDING,
        },
      }),

      prisma.recharge.count({
        where: {
          status: RechargeStatus.SUCCESS,
        },
      }),

      prisma.recharge.count({
        where: {
          status: RechargeStatus.FAILED,
        },
      }),

      prisma.recharge.count({
        where: {
          status: RechargeStatus.REFUNDED,
        },
      }),

      prisma.recharge.aggregate({
        _sum: {
          amount: true,
        },
      }),

      prisma.recharge.aggregate({
        _sum: {
          commissionAmount: true,
        },
      }),
    ]);

    return {
      total,
      pending,
      success,
      failed,
      refunded,
      totalAmount:
        totalAmount._sum.amount ?? 0,
      totalCommission:
        totalCommission._sum
          .commissionAmount ?? 0,
    };
  };

/* ===========================================
   TOP USERS
=========================================== */

export const topRechargeUsersRepo =
  () => {
    return prisma.recharge.groupBy({
      by: ["userId"],
      _count: {
        id: true,
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        _sum: {
          amount: "desc",
        },
      },
      take: 10,
    });
  };

/* ===========================================
   MONTHLY
=========================================== */

export const monthlyRechargeRepo =
  () => {
    return prisma.recharge.groupBy({
      by: ["createdAt"],
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  };

/* ===========================================
   BULK
=========================================== */

export const bulkProcessRechargeRepo =
  (
    ids: string[],
    status: RechargeStatus
  ) => {
    return prisma.recharge.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        status,
        processedAt: new Date(),
      },
    });
  };

export const bulkRefundRechargeRepo =
  (ids: string[]) => {
    return prisma.recharge.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        status: RechargeStatus.REFUNDED,
        refundedAt: new Date(),
      },
    });
  };

/* ===========================================
   EXPORT
=========================================== */

export const exportRechargeRepo =
  () => {
    return prisma.recharge.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  };