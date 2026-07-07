import { prisma } from "../../prisma";

export class RechargeRepository {

  static async createRecharge(data: {
    userId: string;
    rechargeNumber: string;
    operatorName: string;
    rechargeType: string;
    amount: number;
  }) {

    return prisma.recharge.create({
      data
    });
  }

  static async getById(id: string) {

    return prisma.recharge.findUnique({
      where: { id },
      include: {
        user: true
      }
    });
  }

  static async getByTransactionId(
    transactionId: string
  ) {

    return prisma.recharge.findUnique({
      where: {
        transactionId
      }
    });
  }

  static async getUserRecharges(
    userId: string
  ) {

    return prisma.recharge.findMany({

      where: {
        userId
      },

      orderBy: {
        createdAt: "desc"
      }
    });
  }

  static async markSuccess(
    id: string,
    transactionId: string,
    commissionAmount = 0
  ) {

    return prisma.recharge.update({

      where: {
        id
      },

      data: {
        status: "SUCCESS",
        transactionId,
        commissionAmount
      }
    });
  }

  static async markFailed(
    id: string,
    remarks?: string
  ) {

    return prisma.recharge.update({

      where: {
        id
      },

      data: {
        status: "FAILED",
        remarks
      }
    });
  }

  static async markPending(
    id: string
  ) {

    return prisma.recharge.update({

      where: {
        id
      },

      data: {
        status: "PENDING"
      }
    });
  }

  static async processRefund(
    id: string
  ) {

    return prisma.recharge.update({

      where: {
        id
      },

      data: {
        refunded: true,
        refundedAt: new Date(),
        status: "REFUNDED"
      }
    });
  }

  static async searchRecharges(
    keyword: string
  ) {

    return prisma.recharge.findMany({

      where: {

        OR: [

          {
            rechargeNumber: {
              contains: keyword,
              mode: "insensitive"
            }
          },

          {
            operatorName: {
              contains: keyword,
              mode: "insensitive"
            }
          },

          {
            transactionId: {
              contains: keyword,
              mode: "insensitive"
            }
          }
        ]
      },

      include: {
        user: true
      }
    });
  }

  static async getByStatus(
    status: string
  ) {

    return prisma.recharge.findMany({

      where: {
        status
      },

      include: {
        user: true
      }
    });
  }

  static async getByType(
    rechargeType: string
  ) {

    return prisma.recharge.findMany({

      where: {
        rechargeType
      },

      include: {
        user: true
      }
    });
  }

  static async getAllRecharges(
    page = 1,
    limit = 20
  ) {

    const skip = (page - 1) * limit;

    const [recharges, total] =
      await Promise.all([

        prisma.recharge.findMany({
          skip,
          take: limit,
          include: {
            user: true
          },
          orderBy: {
            createdAt: "desc"
          }
        }),

        prisma.recharge.count()
      ]);

    return {
      recharges,
      total,
      page,
      limit
    };
  }

  static async getAnalytics() {

    const [
      totalRecharges,
      successRecharges,
      failedRecharges,
      pendingRecharges,
      totalAmount,
      totalCommission
    ] = await Promise.all([

      prisma.recharge.count(),

      prisma.recharge.count({
        where: {
          status: "SUCCESS"
        }
      }),

      prisma.recharge.count({
        where: {
          status: "FAILED"
        }
      }),

      prisma.recharge.count({
        where: {
          status: "PENDING"
        }
      }),

      prisma.recharge.aggregate({
        _sum: {
          amount: true
        }
      }),

      prisma.recharge.aggregate({
        _sum: {
          commissionAmount: true
        }
      })
    ]);

    return {
      totalRecharges,
      successRecharges,
      failedRecharges,
      pendingRecharges,
      totalAmount:
        totalAmount._sum.amount || 0,
      totalCommission:
        totalCommission._sum.commissionAmount || 0
    };
  }

  static async getOperatorAnalytics() {

    return prisma.recharge.groupBy({

      by: ["operatorName"],

      _count: true,

      _sum: {
        amount: true,
        commissionAmount: true
      }
    });
  }
}