import prisma from "../../prisma/prisma";

export class InsuranceRepository {
  /* ==========================
      INSURANCE PRODUCTS
  ========================== */

  static async createInsurance(data: {
    policyNumber: string;
    title: string;
    type: string;
    minAmount: number;

    name?: string;
    description?: string;
    premiumCode?: string;

    maxAmount?: number;
    premiumRate?: number;
    coverageAmount?: number;
    tenureMonths?: number;
    isActive?: boolean;
  }) {
    return prisma.insurance.create({
      data,
    });
  }

  static async getInsuranceById(id: string) {
    return prisma.insurance.findUnique({
      where: { id },
      include: {
        applications: true,
        claims: true,
      },
    });
  }

  static async getInsuranceByPolicyNumber(
    policyNumber: string
  ) {
    return prisma.insurance.findUnique({
      where: {
        policyNumber,
      },
    });
  }

  static async getAllInsurances(
    page = 1,
    limit = 20
  ) {
    const skip = (page - 1) * limit;

    const [data, total] =
      await Promise.all([
        prisma.insurance.findMany({
          skip,
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
        }),

        prisma.insurance.count(),
      ]);

    return {
      total,
      page,
      limit,
      data,
    };
  }

  static async updateInsurance(
    id: string,
    data: any
  ) {
    return prisma.insurance.update({
      where: { id },
      data,
    });
  }

  static async deleteInsurance(id: string) {
    return prisma.insurance.delete({
      where: { id },
    });
  }

  /* ==========================
      APPLICATIONS
  ========================== */

  static async createApplication(data: {
    applicationNo: string;
    insuranceType: string;
    amount: number;

    userId?: string;
    insuranceId?: string;

    agentId?: string;
  }) {
    return prisma.insuranceApplication.create({
      data: {
        ...data,
        status: "PENDING",
      },
    });
  }

  static async getApplicationById(
    applicationId: string
  ) {
    return prisma.insuranceApplication.findUnique(
      {
        where: {
          id: applicationId,
        },
        include: {
          user: true,
          insuranceRef: true,
          claims: true,
        },
      }
    );
  }

  static async getUserApplications(
    userId: string
  ) {
    return prisma.insuranceApplication.findMany(
      {
        where: {
          userId,
        },
        include: {
          insuranceRef: true,
          claims: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }
    );
  }

  static async approveApplication(
    applicationId: string
  ) {
    return prisma.insuranceApplication.update(
      {
        where: {
          id: applicationId,
        },
        data: {
          status: "APPROVED",
          approvedAt: new Date(),
        },
      }
    );
  }

  static async rejectApplication(
    applicationId: string,
    reason: string
  ) {
    return prisma.insuranceApplication.update(
      {
        where: {
          id: applicationId,
        },
        data: {
          status: "REJECTED",
          rejectedAt: new Date(),
          rejectionReason: reason,
        },
      }
    );
  }

  /* ==========================
      CLAIMS
  ========================== */

  static async createClaim(data: {
    claimNo: string;
    applicationId: string;
    insuranceId: string;
    claimAmount: number;
    reason: string;
  }) {
    return prisma.insuranceClaim.create({
      data,
    });
  }

  static async getClaimById(
    claimId: string
  ) {
    return prisma.insuranceClaim.findUnique({
      where: {
        id: claimId,
      },
      include: {
        application: true,
        insurance: true,
      },
    });
  }

  static async getApplicationClaims(
    applicationId: string
  ) {
    return prisma.insuranceClaim.findMany({
      where: {
        applicationId,
      },
      include: {
        insurance: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async approveClaim(
    claimId: string
  ) {
    return prisma.insuranceClaim.update({
      where: {
        id: claimId,
      },
      data: {
        status: "APPROVED",
        approvedAt: new Date(),
      },
    });
  }

  static async rejectClaim(
    claimId: string,
    reason: string
  ) {
    return prisma.insuranceClaim.update({
      where: {
        id: claimId,
      },
      data: {
        status: "REJECTED",
        rejectedAt: new Date(),
        rejectionReason: reason,
      },
    });
  }

  /* ==========================
      ANALYTICS
  ========================== */

  static async getAnalytics() {
    const [
      totalPolicies,
      totalApplications,
      approvedApplications,
      rejectedApplications,
      pendingApplications,
      totalClaims,
      approvedClaims,
      rejectedClaims,
    ] = await Promise.all([
      prisma.insurance.count(),

      prisma.insuranceApplication.count(),

      prisma.insuranceApplication.count({
        where: {
          status: "APPROVED",
        },
      }),

      prisma.insuranceApplication.count({
        where: {
          status: "REJECTED",
        },
      }),

      prisma.insuranceApplication.count({
        where: {
          status: "PENDING",
        },
      }),

      prisma.insuranceClaim.count(),

      prisma.insuranceClaim.count({
        where: {
          status: "APPROVED",
        },
      }),

      prisma.insuranceClaim.count({
        where: {
          status: "REJECTED",
        },
      }),
    ]);

    return {
      totalPolicies,
      totalApplications,
      approvedApplications,
      rejectedApplications,
      pendingApplications,
      totalClaims,
      approvedClaims,
      rejectedClaims,
    };
  }
}

export default InsuranceRepository;