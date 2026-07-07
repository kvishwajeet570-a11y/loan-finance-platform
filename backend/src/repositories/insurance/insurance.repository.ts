import { prisma } from "../../prisma/prisma";

export class InsuranceRepository {

  /* ==========================
      CREATE POLICY
  ========================== */

  static async createPolicy(data: {
    userId: string;
    policyNumber: string;
    policyType: string;
    provider: string;
    premiumAmount: number;
    coverageAmount: number;
    startDate: Date;
    expiryDate: Date;
    nomineeName?: string;
    nomineeRelation?: string;
  }) {

    return prisma.insurancePolicy.create({
      data
    });
  }

  /* ==========================
      GET POLICY BY ID
  ========================== */

  static async getPolicyById(
    policyId: string
  ) {

    return prisma.insurancePolicy.findUnique({
      where: {
        id: policyId
      },
      include: {
        user: true
      }
    });
  }

  /* ==========================
      GET POLICY NUMBER
  ========================== */

  static async getPolicyByNumber(
    policyNumber: string
  ) {

    return prisma.insurancePolicy.findUnique({
      where: {
        policyNumber
      }
    });
  }

  /* ==========================
      USER POLICIES
  ========================== */

  static async getUserPolicies(
    userId: string
  ) {

    return prisma.insurancePolicy.findMany({
      where: {
        userId
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  /* ==========================
      ACTIVE POLICIES
  ========================== */

  static async getActivePolicies() {

    return prisma.insurancePolicy.findMany({
      where: {
        status: "ACTIVE"
      }
    });
  }

  /* ==========================
      EXPIRED POLICIES
  ========================== */

  static async getExpiredPolicies() {

    return prisma.insurancePolicy.findMany({
      where: {
        expiryDate: {
          lt: new Date()
        }
      }
    });
  }

  /* ==========================
      RENEWAL DUE
  ========================== */

  static async getRenewalDuePolicies(
    days = 30
  ) {

    const targetDate = new Date();

    targetDate.setDate(
      targetDate.getDate() + days
    );

    return prisma.insurancePolicy.findMany({
      where: {
        expiryDate: {
          lte: targetDate
        },
        status: "ACTIVE"
      }
    });
  }

  /* ==========================
      UPDATE POLICY
  ========================== */

  static async updatePolicy(
    policyId: string,
    data: any
  ) {

    return prisma.insurancePolicy.update({
      where: {
        id: policyId
      },
      data
    });
  }

  /* ==========================
      CANCEL POLICY
  ========================== */

  static async cancelPolicy(
    policyId: string
  ) {

    return prisma.insurancePolicy.update({
      where: {
        id: policyId
      },
      data: {
        status: "CANCELLED"
      }
    });
  }

  /* ==========================
      RENEW POLICY
  ========================== */

  static async renewPolicy(
    policyId: string,
    expiryDate: Date
  ) {

    return prisma.insurancePolicy.update({
      where: {
        id: policyId
      },
      data: {
        expiryDate,
        status: "ACTIVE"
      }
    });
  }

  /* ==========================
      DELETE POLICY
  ========================== */

  static async deletePolicy(
    policyId: string
  ) {

    return prisma.insurancePolicy.delete({
      where: {
        id: policyId
      }
    });
  }

  /* ==========================
      SEARCH POLICIES
  ========================== */

  static async searchPolicies(
    keyword: string
  ) {

    return prisma.insurancePolicy.findMany({
      where: {
        OR: [
          {
            policyNumber: {
              contains: keyword,
              mode: "insensitive"
            }
          },
          {
            provider: {
              contains: keyword,
              mode: "insensitive"
            }
          },
          {
            policyType: {
              contains: keyword,
              mode: "insensitive"
            }
          }
        ]
      }
    });
  }

  /* ==========================
      ALL POLICIES
  ========================== */

  static async getAllPolicies(
    page = 1,
    limit = 20
  ) {

    const skip =
      (page - 1) * limit;

    const [policies, total] =
      await Promise.all([

        prisma.insurancePolicy.findMany({
          skip,
          take: limit,
          orderBy: {
            createdAt: "desc"
          },
          include: {
            user: true
          }
        }),

        prisma.insurancePolicy.count()
      ]);

    return {
      total,
      page,
      limit,
      policies
    };
  }

  /* ==========================
      INSURANCE ANALYTICS
  ========================== */

  static async getAnalytics() {

    const [
      totalPolicies,
      activePolicies,
      expiredPolicies,
      premiumSum,
      coverageSum
    ] = await Promise.all([

      prisma.insurancePolicy.count(),

      prisma.insurancePolicy.count({
        where: {
          status: "ACTIVE"
        }
      }),

      prisma.insurancePolicy.count({
        where: {
          expiryDate: {
            lt: new Date()
          }
        }
      }),

      prisma.insurancePolicy.aggregate({
        _sum: {
          premiumAmount: true
        }
      }),

      prisma.insurancePolicy.aggregate({
        _sum: {
          coverageAmount: true
        }
      })
    ]);

    return {
      totalPolicies,
      activePolicies,
      expiredPolicies,

      totalPremium:
        premiumSum._sum.premiumAmount || 0,

      totalCoverage:
        coverageSum._sum.coverageAmount || 0
    };
  }

  /* ==========================
      PROVIDER ANALYTICS
  ========================== */

  static async providerAnalytics() {

    return prisma.insurancePolicy.groupBy({
      by: ["provider"],

      _count: {
        provider: true
      },

      _sum: {
        premiumAmount: true
      }
    });
  }
}