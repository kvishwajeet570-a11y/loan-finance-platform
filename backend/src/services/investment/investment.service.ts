import prisma from "../../prisma/prisma";
import { Prisma } from "@prisma/client";

interface CreateInvestmentDto {
  name: string;
  category: string;

  minimumAmount: number;

  expectedReturn: number;

  tenureMonths: number;

  riskLevel: string;

  description?: string;

  isActive?: boolean;
}

interface InvestmentFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  riskLevel?: string;
}

class InvestmentService {
  /**
   * Create Investment Product
   */
  async createInvestment(
    data: CreateInvestmentDto
  ) {
    return prisma.investment.create({
      data,
    });
  }

  /**
   * Update Investment
   */
  async updateInvestment(
    id: string,
    data: Partial<CreateInvestmentDto>
  ) {
    return prisma.investment.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete Investment
   */
  async deleteInvestment(id: string) {
    return prisma.investment.delete({
      where: { id },
    });
  }

  /**
   * Investment Details
   */
  async getInvestmentById(id: string) {
    return prisma.investment.findUnique({
      where: { id },
    });
  }

  /**
   * Investment Listing
   */
  async getInvestments(
    filters: InvestmentFilters
  ) {
    const {
      page = 1,
      limit = 20,
      search,
      category,
      riskLevel,
    } = filters;

    const skip = (page - 1) * limit;

    const where: Prisma.InvestmentWhereInput =
      {};

    if (search) {
      where.OR = [
        {
          name: {
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
      ];
    }

    if (category) {
      where.category = category;
    }

    if (riskLevel) {
      where.riskLevel = riskLevel;
    }

    const [investments, total] =
      await Promise.all([
        prisma.investment.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.investment.count({
          where,
        }),
      ]);

    return {
      investments,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Invest
   */
  async createInvestmentRequest(
    userId: string,
    investmentId: string,
    amount: number
  ) {
    const investment =
      await prisma.investment.findUnique({
        where: {
          id: investmentId,
        },
      });

    if (!investment) {
      throw new Error(
        "Investment product not found"
      );
    }

    if (
      amount < investment.minimumAmount
    ) {
      throw new Error(
        `Minimum investment amount is ₹${investment.minimumAmount}`
      );
    }

    return prisma.userInvestment.create({
      data: {
        userId,
        investmentId,
        amount,
        status: "PENDING",
      },
    });
  }

  /**
   * Approve Investment
   */
  async approveInvestment(
    investmentRequestId: string
  ) {
    return prisma.userInvestment.update({
      where: {
        id: investmentRequestId,
      },
      data: {
        status: "ACTIVE",
        approvedAt: new Date(),
      },
    });
  }

  /**
   * Close Investment
   */
  async closeInvestment(
    investmentRequestId: string
  ) {
    return prisma.userInvestment.update({
      where: {
        id: investmentRequestId,
      },
      data: {
        status: "CLOSED",
        closedAt: new Date(),
      },
    });
  }

  /**
   * User Investments
   */
  async getUserInvestments(
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

  /**
   * ROI Calculator
   */
  calculateReturns(
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
      investedAmount: principal,
      maturityAmount:
        Number(
          maturityAmount.toFixed(2)
        ),
      estimatedProfit:
        Number(
          (
            maturityAmount -
            principal
          ).toFixed(2)
        ),
    };
  }

  /**
   * Dashboard Analytics
   */
  async getInvestmentStats() {
    const [
      totalProducts,
      totalInvestments,
      activeInvestments,
      totalAmount,
    ] = await Promise.all([
      prisma.investment.count(),

      prisma.userInvestment.count(),

      prisma.userInvestment.count({
        where: {
          status: "ACTIVE",
        },
      }),

      prisma.userInvestment.aggregate({
        _sum: {
          amount: true,
        },
      }),
    ]);

    return {
      totalProducts,
      totalInvestments,
      activeInvestments,
      totalInvestmentAmount:
        totalAmount._sum.amount || 0,
    };
  }
}

export default new InvestmentService();