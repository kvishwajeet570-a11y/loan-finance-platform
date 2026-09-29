import prisma from "../../prisma/prisma";
import { RechargeType } from "@prisma/client";

interface RechargeDTO {
  userId: string;
  operator: string;
  number: string;
  amount: number;
  serviceType: string;
}

class RechargeService {
  async createRecharge(data: RechargeDTO) {
    return prisma.recharge.create({
      data: {
        userId: data.userId,
        operator: data.operator,
        mobileNumber: data.number,
        amount: data.amount,
        rechargeType: data.serviceType as RechargeType,
        status: "PENDING",
      },
    });
  }

  async markSuccess(
    id: string,
    operatorTxnId: string
  ) {
    return prisma.recharge.update({
      where: {
        id: id,
      },
      data: {
        status: "SUCCESS",
        operatorTxnId,
        completedAt: new Date(),
      },
    });
  }

  async markFailed(
    id: string,
    reason: string
  ) {
    return prisma.recharge.update({
      where: {
        id: id,
      },
      data: {
        status: "FAILED",
        failureReason: reason,
      },
    });
  }

  async getRechargeHistory(
    userId: string,
    page = 1,
    limit = 20
  ) {
    const skip = (page - 1) * limit;

    const [recharges, total] =
      await Promise.all([
        prisma.recharge.findMany({
          where: { userId },
          skip,
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
        }),

        prisma.recharge.count({
          where: { userId },
        }),
      ]);

    return {
      recharges,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

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

  async distributeCommission(
    id: string,
    commissionAmount: number
  ) {
    const recharge =
      await prisma.recharge.findUnique({
        where: {
          id: id,
        },
      });

    if (!recharge) {
      throw new Error(
        "Recharge not found"
      );
    }

    return prisma.commission.create({
      data: {
        userId: recharge.userId,
        amount: commissionAmount,
        commissionAmount,
        loanAmount: 0,
        source: "RECHARGE",
        status: "APPROVED",
      },
    });
  }

  async todayRechargeReport() {
    const today = new Date();

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
          amount: "desc",
        },
      },
      take: 10,
    });
  }

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
          status: "SUCCESS",
        },
      }),

      prisma.recharge.count({
        where: {
          status: "FAILED",
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
        totalBusiness._sum.amount || 0,
    };
  }
}

export default new RechargeService();