import prisma from "../../prisma/prisma";
import { Prisma } from "@prisma/client";

interface CommissionFilter {
  page?: number;
  limit?: number;
  status?: string;
  userId?: string;
}

class CommissionService {
  /**
   * Create Commission Entry
   */
  async createCommission(
    userId: string,
    loanId: string,
    amount: number,
    percentage: number
  ) {
    const commissionAmount =
      (amount * percentage) / 100;

    return prisma.commission.create({
      data: {
        userId,
        loanId,
        loanAmount: amount,
        commissionRate: percentage,
        commissionAmount,
        status: "PENDING",
      },
    });
  }

  /**
   * Approve Commission
   */
  async approveCommission(id: string) {
    return prisma.$transaction(async (tx) => {
      const commission =
        await tx.commission.update({
          where: { id },
          data: {
            status: "APPROVED",
            approvedAt: new Date(),
          },
        });

      await tx.wallet.update({
        where: {
          userId: commission.userId,
        },
        data: {
          balance: {
            increment:
              commission.commissionAmount,
          },
        },
      });

      await tx.transaction.create({
        data: {
          userId: commission.userId,
          amount:
            commission.commissionAmount,
          type: "COMMISSION_CREDIT",
          status: "SUCCESS",
        },
      });

      return commission;
    });
  }

  /**
   * Reject Commission
   */
  async rejectCommission(
    id: string,
    reason: string
  ) {
    return prisma.commission.update({
      where: { id },
      data: {
        status: "REJECTED",
        rejectionReason: reason,
      },
    });
  }

  /**
   * Get Commission By ID
   */
  async getCommissionById(id: string) {
    return prisma.commission.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }

  /**
   * Commission List
   */
  async getCommissions(
    filters: CommissionFilter
  ) {
    const {
      page = 1,
      limit = 20,
      status,
      userId,
    } = filters;

    const skip = (page - 1) * limit;

    const where: Prisma.CommissionWhereInput =
      {};

    if (status) {
      where.status = status;
    }

    if (userId) {
      where.userId = userId;
    }

    const [commissions, total] =
      await Promise.all([
        prisma.commission.findMany({
          where,
          skip,
          take: limit,
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.commission.count({
          where,
        }),
      ]);

    return {
      commissions,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * User Earnings
   */
  async getUserEarnings(userId: string) {
    const result =
      await prisma.commission.aggregate({
        where: {
          userId,
          status: "APPROVED",
        },
        _sum: {
          commissionAmount: true,
        },
      });

    return {
      totalEarnings:
        result._sum.commissionAmount || 0,
    };
  }

  /**
   * Monthly Earnings
   */
  async getMonthlyCommissionReport() {
    const startDate = new Date();
    startDate.setDate(1);

    return prisma.commission.aggregate({
      where: {
        createdAt: {
          gte: startDate,
        },
        status: "APPROVED",
      },
      _sum: {
        commissionAmount: true,
      },
      _count: true,
    });
  }

  /**
   * Top DSA Partners
   */
  async getTopPartners(limit = 10) {
    return prisma.commission.groupBy({
      by: ["userId"],
      _sum: {
        commissionAmount: true,
      },
      orderBy: {
        _sum: {
          commissionAmount: "desc",
        },
      },
      take: limit,
    });
  }

  /**
   * Dashboard Statistics
   */
  async getCommissionStats() {
    const [
      totalCommission,
      pendingCommission,
      approvedCommission,
      rejectedCommission,
    ] = await Promise.all([
      prisma.commission.aggregate({
        _sum: {
          commissionAmount: true,
        },
      }),

      prisma.commission.aggregate({
        where: {
          status: "PENDING",
        },
        _sum: {
          commissionAmount: true,
        },
      }),

      prisma.commission.aggregate({
        where: {
          status: "APPROVED",
        },
        _sum: {
          commissionAmount: true,
        },
      }),

      prisma.commission.aggregate({
        where: {
          status: "REJECTED",
        },
        _sum: {
          commissionAmount: true,
        },
      }),
    ]);

    return {
      totalCommission:
        totalCommission._sum
          .commissionAmount || 0,

      pendingCommission:
        pendingCommission._sum
          .commissionAmount || 0,

      approvedCommission:
        approvedCommission._sum
          .commissionAmount || 0,

      rejectedCommission:
        rejectedCommission._sum
          .commissionAmount || 0,
    };
  }
}

export default new CommissionService();