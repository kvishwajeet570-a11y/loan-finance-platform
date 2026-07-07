import { prisma } from "../../prisma/prisma";

export class DsaRepository {

  /* ==========================
      CREATE DSA PROFILE
  ========================== */

  static async createProfile(data: {
    userId: string;
    companyName?: string;
    referralCode: string;
  }) {

    return prisma.dsaProfile.create({
      data
    });
  }

  /* ==========================
      GET DSA PROFILE
  ========================== */

  static async getProfile(
    userId: string
  ) {

    return prisma.dsaProfile.findUnique({
      where: {
        userId
      },
      include: {
        user: true
      }
    });
  }

  /* ==========================
      GET DSA BY REFERRAL
  ========================== */

  static async getByReferralCode(
    referralCode: string
  ) {

    return prisma.dsaProfile.findUnique({
      where: {
        referralCode
      }
    });
  }

  /* ==========================
      UPDATE PROFILE
  ========================== */

  static async updateProfile(
    userId: string,
    data: Partial<{
      companyName: string;
      status: string;
    }>
  ) {

    return prisma.dsaProfile.update({
      where: {
        userId
      },
      data
    });
  }

  /* ==========================
      DSA LOANS
  ========================== */

  static async getDsaLoans(
    userId: string
  ) {

    return prisma.loanApplication.findMany({
      where: {
        dsaId: userId
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  /* ==========================
      DSA CUSTOMERS
  ========================== */

  static async getDsaCustomers(
    userId: string
  ) {

    return prisma.user.findMany({
      where: {
        referredBy: userId
      }
    });
  }

  /* ==========================
      DSA COMMISSIONS
  ========================== */

  static async getDsaCommissions(
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

  /* ==========================
      INCREASE LEADS
  ========================== */

  static async increaseLeadCount(
    userId: string
  ) {

    return prisma.dsaProfile.update({
      where: {
        userId
      },
      data: {
        totalLeads: {
          increment: 1
        }
      }
    });
  }

  /* ==========================
      INCREASE LOANS
  ========================== */

  static async increaseLoanCount(
    userId: string
  ) {

    return prisma.dsaProfile.update({
      where: {
        userId
      },
      data: {
        totalLoans: {
          increment: 1
        }
      }
    });
  }

  /* ==========================
      UPDATE BUSINESS
  ========================== */

  static async addBusinessVolume(
    userId: string,
    amount: number
  ) {

    return prisma.dsaProfile.update({
      where: {
        userId
      },
      data: {
        totalBusiness: {
          increment: amount
        }
      }
    });
  }

  /* ==========================
      UPDATE COMMISSION
  ========================== */

  static async addCommission(
    userId: string,
    amount: number
  ) {

    return prisma.dsaProfile.update({
      where: {
        userId
      },
      data: {
        totalCommission: {
          increment: amount
        }
      }
    });
  }

  /* ==========================
      TOP DSA
  ========================== */

  static async getTopDsa() {

    return prisma.dsaProfile.findMany({
      orderBy: {
        totalBusiness: "desc"
      },
      take: 10,
      include: {
        user: true
      }
    });
  }

  /* ==========================
      DSA ANALYTICS
  ========================== */

  static async getAnalytics() {

    const [
      totalDsa,
      activeDsa,
      totalBusiness,
      totalCommission
    ] = await Promise.all([

      prisma.dsaProfile.count(),

      prisma.dsaProfile.count({
        where: {
          status: "ACTIVE"
        }
      }),

      prisma.dsaProfile.aggregate({
        _sum: {
          totalBusiness: true
        }
      }),

      prisma.dsaProfile.aggregate({
        _sum: {
          totalCommission: true
        }
      })
    ]);

    return {
      totalDsa,
      activeDsa,

      totalBusiness:
        totalBusiness._sum.totalBusiness || 0,

      totalCommission:
        totalCommission._sum.totalCommission || 0
    };
  }

  /* ==========================
      ALL DSA LIST
  ========================== */

  static async getAllDsa(
    page = 1,
    limit = 20
  ) {

    const skip =
      (page - 1) * limit;

    const [data, total] =
      await Promise.all([

        prisma.dsaProfile.findMany({
          skip,
          take: limit,
          orderBy: {
            createdAt: "desc"
          },
          include: {
            user: true
          }
        }),

        prisma.dsaProfile.count()
      ]);

    return {
      total,
      page,
      limit,
      data
    };
  }

  /* ==========================
      DELETE DSA
  ========================== */

  static async deleteDsa(
    userId: string
  ) {

    return prisma.dsaProfile.delete({
      where: {
        userId
      }
    });
  }
}