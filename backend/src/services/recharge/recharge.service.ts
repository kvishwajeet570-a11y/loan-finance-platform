import prisma from "../../prisma/prisma";

interface RechargeDTO {
  userId: string;
  operator: string;
  number: string;
  amount: number;
  serviceType: string;
}

class RechargeService {
  /**
   * Create Recharge Request
   */
  async createRecharge(
    data: RechargeDTO
  ) {
    const recharge =
      await prisma.recharge.create({
        data: {
          userId: data.userId,
          operator: data.operator,
          number: data.number,
          amount: data.amount,
          serviceType:
            data.serviceType,
          status: "PENDING",
        },
      });

    return recharge;
  }

  /**
   * Success Recharge
   */
  async markSuccess(
    rechargeId: string,
    operatorTxnId: string
  ) {
    const recharge =
      await prisma.recharge.update({
        where: {
          id: rechargeId,
        },

        data: {
          status: "SUCCESS",
          operatorTxnId,
          completedAt:
            new Date(),
        },
      });

    return recharge;
  }

  /**
   * Failed Recharge
   */
  async markFailed(
    rechargeId: string,
    reason: string
  ) {
    return prisma.recharge.update({
      where: {
        id: rechargeId,
      },

      data: {
        status: "FAILED",
        failureReason:
          reason,
      },
    });
  }

  /**
   * Wallet Recharge
   */
  async walletRecharge(
    userId: string,
    amount: number
  ) {
    await prisma.wallet.update({
      where: {
        userId,
      },

      data: {
        balance: {
          increment:
            amount,
        },
      },
    });

    await prisma.transaction.create({
      data: {
        userId,
        amount,
        type: "CREDIT",
        remark:
          "Wallet Recharge",
      },
    });

    return {
      success: true,
      amount,
    };
  }

  /**
   * Debit Wallet
   */
  async debitWallet(
    userId: string,
    amount: number
  ) {
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

    await prisma.wallet.update({
      where: {
        userId,
      },

      data: {
        balance: {
          decrement:
            amount,
        },
      },
    });

    await prisma.transaction.create({
      data: {
        userId,
        amount,
        type: "DEBIT",
        remark:
          "Recharge Payment",
      },
    });

    return true;
  }

  /**
   * Recharge History
   */
  async getRechargeHistory(
    userId: string,
    page = 1,
    limit = 20
  ) {
    const skip =
      (page - 1) * limit;

    const [recharges, total] =
      await Promise.all([
        prisma.recharge.findMany({
          where: {
            userId,
          },

          skip,
          take: limit,

          orderBy: {
            createdAt:
              "desc",
          },
        }),

        prisma.recharge.count({
          where: {
            userId,
          },
        }),
      ]);

    return {
      recharges,
      total,
      page,
      pages: Math.ceil(
        total / limit
      ),
    };
  }

  /**
   * Recharge Details
   */
  async getRechargeById(
    rechargeId: string
  ) {
    return prisma.recharge.findUnique({
      where: {
        id: rechargeId,
      },

      include: {
        user: true,
      },
    });
  }

  /**
   * Commission Distribution
   */
  async distributeCommission(
    rechargeId: string,
    commissionAmount: number
  ) {
    const recharge =
      await prisma.recharge.findUnique({
        where: {
          id: rechargeId,
        },
      });

    if (!recharge) {
      throw new Error(
        "Recharge not found"
      );
    }

    return prisma.commission.create({
      data: {
        userId:
          recharge.userId,
        commissionAmount,
        source:
          "RECHARGE",
        status:
          "APPROVED",
      },
    });
  }

  /**
   * Today's Recharge
   */
  async todayRechargeReport() {
    const today =
      new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    return prisma.recharge.aggregate({
      where: {
        createdAt: {
          gte: today,
        },

        status: "SUCCESS",
      },

      _sum: {
        amount: true,
      },

      _count: {
        id: true,
      },
    });
  }

  /**
   * Monthly Recharge Report
   */
  async monthlyRechargeReport() {
    const year =
      new Date().getFullYear();

    return prisma.$queryRaw`
      SELECT
      EXTRACT(MONTH FROM "createdAt") as month,
      COUNT(*) as total_recharges,
      SUM(amount) as total_amount
      FROM "Recharge"
      WHERE EXTRACT(YEAR FROM "createdAt") = ${year}
      GROUP BY month
      ORDER BY month ASC
    `;
  }

  /**
   * Top Recharge Users
   */
  async topRechargeUsers() {
    return prisma.recharge.groupBy({
      by: ["userId"],

      where: {
        status: "SUCCESS",
      },

      _sum: {
        amount: true,
      },

      orderBy: {
        _sum: {
          amount:
            "desc",
        },
      },

      take: 10,
    });
  }

  /**
   * Recharge Analytics
   */
  async getRechargeStats() {
    const [
      totalRecharge,
      successRecharge,
      failedRecharge,
      totalBusiness,
    ] = await Promise.all([
      prisma.recharge.count(),

      prisma.recharge.count({
        where: {
          status:
            "SUCCESS",
        },
      }),

      prisma.recharge.count({
        where: {
          status:
            "FAILED",
        },
      }),

      prisma.recharge.aggregate({
        _sum: {
          amount: true,
        },
      }),
    ]);

    return {
      totalRecharge,
      successRecharge,
      failedRecharge,

      totalBusiness:
        totalBusiness._sum
          .amount || 0,
    };
  }
}

export default new RechargeService();