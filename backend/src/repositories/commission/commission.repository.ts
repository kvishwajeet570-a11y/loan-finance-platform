import prisma from "../../prisma/prisma";

export class CommissionRepository {

/* =========================
    CREATE COMMISSION
========================= */

static async createCommission(data: {
  userId: string;
  loanId?: string;
  partnerId?: string;
  source?: string;
  amount: number;
  loanAmount: number;
  commissionAmount: number;
}) {

  return prisma.commission.create({
    data: {
      ...data,
      status: "PENDING",
    },
  });
}

  /* =========================
      GET COMMISSION BY ID
  ========================= */

  static async getCommissionById(
    commissionId: string
  ) {

    return prisma.commission.findUnique({
      where: {
        id: commissionId
      },
      include: {
        user: true
      }
    });
  }

  /* =========================
      USER COMMISSIONS
  ========================= */

  static async getUserCommissions(
    userId: string
  ) {

    return prisma.commission.findMany({
      where: {
        userId
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  /* =========================
      PENDING COMMISSIONS
  ========================= */

  static async getPendingCommissions() {

    return prisma.commission.findMany({
      where: {
        status: "PENDING"
      },
      include: {
        user: true
      }
    });
  }

  /* =========================
      APPROVE COMMISSION
  ========================= */

  static async approveCommission(
    commissionId: string,
    approvedBy: string
  ) {

    return prisma.commission.update({
      where: {
        id: commissionId
      },
      data: {
  status: "APPROVED",
  approvedAt: new Date(),
}
    });
  }

/* =========================
    REJECT COMMISSION
========================= */

static async rejectCommission(
  commissionId: string,
  rejectionReason?: string
) {

  return prisma.commission.update({
    where: {
      id: commissionId
    },
    data: {
      status: "REJECTED",
      rejectionReason
    }
  });
}

  /* =========================
      MARK AS PAID
  ========================= */

  static async markCommissionPaid(
    commissionId: string
  ) {

    return prisma.commission.update({
      where: {
        id: commissionId
      },
      data: {
  status: "PAID",
}
    });
  }

  /* =========================
      GET ALL COMMISSIONS
  ========================= */

  static async getAllCommissions(
    page = 1,
    limit = 20
  ) {

    const skip = (page - 1) * limit;

    const [commissions, total] =
      await Promise.all([

        prisma.commission.findMany({
          skip,
          take: limit,
          orderBy: {
            createdAt: "desc"
          },
          include: {
            user: true
          }
        }),

        prisma.commission.count()
      ]);

    return {
      total,
      page,
      limit,
      commissions
    };
  }

  /* =========================
      SEARCH COMMISSIONS
  ========================= */

  static async searchCommissions(
    keyword: string
  ) {

    return prisma.commission.findMany({
  where: {
    OR: [
      {
        status: {
          contains: keyword,
          mode: "insensitive",
        },
      },
      {
        source: {
          contains: keyword,
          mode: "insensitive",
        },
      },
    ],
  },
});
  }

  /* =========================
      COMMISSION ANALYTICS
  ========================= */

  static async getCommissionAnalytics() {

    const [
      totalCommission,
      pendingCommission,
      approvedCommission,
      paidCommission
    ] = await Promise.all([

      prisma.commission.aggregate({
        _sum: {
          commissionAmount: true
        }
      }),

      prisma.commission.aggregate({
        where: {
          status: "PENDING"
        },
        _sum: {
          commissionAmount: true
        }
      }),

      prisma.commission.aggregate({
        where: {
          status: "APPROVED"
        },
        _sum: {
          commissionAmount: true
        }
      }),

      prisma.commission.aggregate({
        where: {
          status: "PAID"
        },
        _sum: {
          commissionAmount: true
        }
      })
    ]);

    return {
      totalCommission:
        totalCommission._sum.commissionAmount || 0,

      pendingCommission:
        pendingCommission._sum.commissionAmount || 0,

      approvedCommission:
        approvedCommission._sum.commissionAmount || 0,

      paidCommission:
        paidCommission._sum.commissionAmount || 0
    };
  }

  /* =========================
      TOP EARNERS
  ========================= */

  static async getTopEarners() {

    return prisma.commission.groupBy({
      by: ["userId"],
      _sum: {
        commissionAmount: true
      },
      orderBy: {
        _sum: {
          commissionAmount: "desc"
        }
      },
      take: 10
    });
  }

  /* =========================
      MONTHLY COMMISSION
  ========================= */

  static async getMonthlyCommission(
    startDate: Date,
    endDate: Date
  ) {

    return prisma.commission.aggregate({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: {
        commissionAmount: true
      }
    });
  }
}