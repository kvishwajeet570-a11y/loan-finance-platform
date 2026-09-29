import { InvestmentStatus } from "@prisma/client";
import prisma from "../../prisma/prisma";
export class InvestmentService {
  /* ========================================
     CRUD
  ======================================== */

  static async createInvestment(data: any) {
    return prisma.investment.create({
      data,
    });
  }

  static async getAllInvestments() {
    return prisma.investment.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async getInvestmentById(id: string) {
    return prisma.investment.findUnique({
      where: { id },
    });
  }

  static async updateInvestment(
    id: string,
    data: any
  ) {
    return prisma.investment.update({
      where: { id },
      data,
    });
  }

  static async deleteInvestment(id: string) {
    return prisma.investment.delete({
      where: { id },
    });
  }

  /* ========================================
     SEARCH
  ======================================== */

  static async searchInvestments(
    search: string
  ) {
    return prisma.investment.findMany({
      where: {
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      },
    });
  }

  /* ========================================
     STATUS
  ======================================== */

static async getPendingInvestments() {
  return prisma.investment.findMany({
    where: {
      status: InvestmentStatus.PENDING,
    },
  });
}

static async getActiveInvestments() {
  return prisma.investment.findMany({
    where: {
      status: InvestmentStatus.ACTIVE,
    },
  });
}

static async getClosedInvestments() {
  return prisma.investment.findMany({
    where: {
      status: InvestmentStatus.CLOSED,
    },
  });
}

static async getRejectedInvestments() {
  return prisma.investment.findMany({
    where: {
      status: InvestmentStatus.REJECTED,
    },
  });
}

  /* ========================================
     APPROVAL
  ======================================== */

  static async approveInvestment(
    id: string
  ) {
    return prisma.investment.update({
      where: { id },
      data: {
        status: InvestmentStatus.ACTIVE,
      },
    });
  }

  static async rejectInvestment(
    id: string
  ) {
    return prisma.investment.update({
      where: { id },
      data: {
        status: InvestmentStatus.REJECTED,
      },
    });
  }

  static async activateInvestment(
    id: string
  ) {
    return prisma.investment.update({
      where: { id },
      data: {
        status: InvestmentStatus.ACTIVE,
      },
    });
  }

  static async closeInvestment(
    id: string
  ) {
    return prisma.investment.update({
      where: { id },
      data: {
        status: InvestmentStatus.CLOSED,
      },
    });
  }

  /* ========================================
     USER
  ======================================== */

  static async getUserInvestments(
  userId: string
) {
  return prisma.userInvestment.findMany({
    where: {
      userId,
    },
    include: {
      investment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

  /* ========================================
     ANALYTICS
  ======================================== */

  static async getInvestmentAnalytics() {
    const total =
      await prisma.investment.count();

    const active =
      await prisma.investment.count({
        where: {
          status: InvestmentStatus.ACTIVE,
        },
      });

    return {
      total,
      active,
    };
  }

  static async getInvestmentDashboard() {
    const total =
      await prisma.investment.count();

    const active =
      await prisma.investment.count({
        where: {
          status: InvestmentStatus.ACTIVE,
        },
      });

    const pending =
      await prisma.investment.count({
        where: {
          status: InvestmentStatus.PENDING,
        },
      });

    return {
      total,
      active,
      pending,
    };
  }

  /* ========================================
     TOP DATA
  ======================================== */

  static async getTopInvestors() {
    return [];
  }

  static async getTopPlans() {
    return prisma.investment.findMany({
      take: 5,
      orderBy: {
        interestRate: "desc",
      },
    });
  }

  static async getMonthlyInvestments() {
    return [];
  }

  /* ========================================
     RETURNS
  ======================================== */

  static async getInvestmentReturns(
    id: string
  ) {
    return prisma.investment.findUnique({
      where: { id },
    });
  }

  static async calculateReturns(
    principal: number,
    annualRate: number,
    years: number
  ) {
    const maturityAmount =
      principal *
      Math.pow(
        1 + annualRate / 100,
        years
      );

    return {
      principal,
      maturityAmount,
      profit:
        maturityAmount - principal,
    };
  }

  /* ========================================
     EXPORT
  ======================================== */

  static async exportInvestmentsExcel() {
    return [];
  }

  static async exportInvestmentsPdf() {
    return [];
  }

  /* ========================================
     BULK
  ======================================== */

  static async bulkApproveInvestments(
    ids: string[]
  ) {
    return prisma.investment.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        status: InvestmentStatus.ACTIVE,
      },
    });
  }

  static async bulkRejectInvestments(
    ids: string[]
  ) {
    return prisma.investment.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        status: InvestmentStatus.REJECTED,
      },
    });
  }
}

export default InvestmentService;




