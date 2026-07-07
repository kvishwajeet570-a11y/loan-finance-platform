import prisma from "../../prisma/prisma";
import { Prisma } from "@prisma/client";

interface DSAFilter {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

class DSAService {
  /**
   * Register DSA
   */
  async registerDSA(data: {
    name: string;
    email: string;
    phoneNo: string;
    password: string;
    referralCode?: string;
  }) {
    const existingUser =
      await prisma.user.findFirst({
        where: {
          OR: [
            { email: data.email },
            { phoneNo: data.phoneNo },
          ],
        },
      });

    if (existingUser) {
      throw new Error("DSA already exists");
    }

    return prisma.user.create({
      data: {
        ...data,
        role: "dsa",
        isVerified: false,
      },
    });
  }

  /**
   * Verify DSA
   */
  async verifyDSA(dsaId: string) {
    return prisma.user.update({
      where: { id: dsaId },
      data: {
        isVerified: true,
      },
    });
  }

  /**
   * Get DSA Profile
   */
  async getDSAProfile(dsaId: string) {
    return prisma.user.findUnique({
      where: { id: dsaId },
    });
  }

  /**
   * Update DSA Profile
   */
  async updateDSA(
    dsaId: string,
    data: any
  ) {
    return prisma.user.update({
      where: { id: dsaId },
      data,
    });
  }

  /**
   * DSA List
   */
  async getDSAList(filters: DSAFilter) {
    const {
      page = 1,
      limit = 20,
      search,
    } = filters;

    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      role: "dsa",
    };

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          phoneNo: {
            contains: search,
          },
        },
      ];
    }

    const [dsas, total] =
      await Promise.all([
        prisma.user.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.user.count({
          where,
        }),
      ]);

    return {
      dsas,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Assign Lead
   */
  async assignLead(
    dsaId: string,
    loanId: string
  ) {
    return prisma.loanApplication.update({
      where: { id: loanId },
      data: {
        assignedTo: dsaId,
      },
    });
  }

  /**
   * DSA Loan Applications
   */
  async getDSALoans(dsaId: string) {
    return prisma.loanApplication.findMany({
      where: {
        assignedTo: dsaId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * DSA Dashboard
   */
  async getDSADashboard(dsaId: string) {
    const [
      totalLeads,
      approvedLoans,
      pendingLoans,
      rejectedLoans,
    ] = await Promise.all([
      prisma.loanApplication.count({
        where: {
          assignedTo: dsaId,
        },
      }),

      prisma.loanApplication.count({
        where: {
          assignedTo: dsaId,
          status: "approved",
        },
      }),

      prisma.loanApplication.count({
        where: {
          assignedTo: dsaId,
          status: "pending",
        },
      }),

      prisma.loanApplication.count({
        where: {
          assignedTo: dsaId,
          status: "rejected",
        },
      }),
    ]);

    const earnings =
      await prisma.commission.aggregate({
        where: {
          userId: dsaId,
          status: "APPROVED",
        },
        _sum: {
          commissionAmount: true,
        },
      });

    return {
      totalLeads,
      approvedLoans,
      pendingLoans,
      rejectedLoans,
      totalEarnings:
        earnings._sum
          .commissionAmount || 0,
    };
  }

  /**
   * DSA Performance Report
   */
  async getPerformanceReport(
    dsaId: string
  ) {
    const total =
      await prisma.loanApplication.count({
        where: {
          assignedTo: dsaId,
        },
      });

    const approved =
      await prisma.loanApplication.count({
        where: {
          assignedTo: dsaId,
          status: "approved",
        },
      });

    const conversionRate =
      total > 0
        ? (approved / total) * 100
        : 0;

    return {
      totalLeads: total,
      approvedLeads: approved,
      conversionRate:
        conversionRate.toFixed(2),
    };
  }

  /**
   * Top Performing DSA
   */
  async getTopDSA(limit = 10) {
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
   * Block DSA
   */
  async blockDSA(dsaId: string) {
    return prisma.user.update({
      where: {
        id: dsaId,
      },
      data: {
        isBlocked: true,
      },
    });
  }

  /**
   * Unblock DSA
   */
  async unblockDSA(dsaId: string) {
    return prisma.user.update({
      where: {
        id: dsaId,
      },
      data: {
        isBlocked: false,
      },
    });
  }
}

export default new DSAService();