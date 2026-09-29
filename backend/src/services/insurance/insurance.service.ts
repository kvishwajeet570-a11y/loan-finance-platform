// src/services/insurance/insurance.service.ts

import { Prisma } from "@prisma/client";
import prisma from "../../prisma/prisma";
interface CreateInsuranceDto {
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
}

interface UpdateInsuranceDto
  extends Partial<CreateInsuranceDto> {}

interface InsuranceFilters {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
}

class InsuranceService {
  async createInsurance(
    data: CreateInsuranceDto
  ) {
    return prisma.insurance.create({
      data: {
        ...data,
      },
    });
  }

  async getInsurances(
    filters: InsuranceFilters
  ) {
    const {
      page = 1,
      limit = 10,
      search,
      type,
    } = filters;

    const skip = (page - 1) * limit;

    const where: Prisma.insuranceWhereInput = {};

    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          policyNumber: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (type) {
      where.type = type;
    }

    const [items, total] =
      await Promise.all([
        prisma.insurance.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
        }),

        prisma.insurance.count({
          where,
        }),
      ]);

    return {
      data: items,
      total,
      page,
      limit,
      totalPages: Math.ceil(
        total / limit
      ),
    };
  }

  async getInsuranceById(
    id: string
  ) {
    return prisma.insurance.findUnique({
      where: {
        id,
      },
      include: {
        applications: true,
        claims: true,
      },
    });
  }

  async updateInsurance(
    id: string,
    data: UpdateInsuranceDto
  ) {
    return prisma.insurance.update({
      where: {
        id,
      },
      data,
    });
  }

  async deleteInsurance(
    id: string
  ) {
    return prisma.insurance.delete({
      where: {
        id,
      },
    });
  }

  async applyInsurance(
    userId: string,
    insuranceId: string,
    amount: number
  ) {
    const policy =
      await prisma.insurance.findUnique({
        where: {
          id: insuranceId,
        },
      });

    if (!policy) {
      throw new Error(
        "Insurance policy not found"
      );
    }

    return prisma.insuranceApplication.create(
      {
        data: {
          applicationNo: `APP-${Date.now()}`,
          insuranceType:
            policy.type,
          amount,

          userId,
          insuranceId,

          status: "PENDING",
        },
      }
    );
  }

  async approveInsurance(
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

  async rejectInsurance(
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

  async getUserPolicies(
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

  async createClaim(data: {
    applicationId: string;
    insuranceId: string;
    claimAmount: number;
    reason: string;
  }) {
    return prisma.insuranceClaim.create({
      data: {
        claimNo: `CLM-${Date.now()}`,
        ...data,
      },
    });
  }

  async getPolicyClaims(
    applicationId: string
  ) {
    return prisma.insuranceClaim.findMany({
      where: {
        applicationId,
      },
      include: {
        insurance: true,
        application: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async approveClaim(
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

  async rejectClaim(
    claimId: string,
    reason: string
  ) {
    return prisma.insuranceClaim.update({
      where: {
        id: claimId,
      },
      data: {
        status: "REJECTED",
        rejectionReason: reason,
        rejectedAt: new Date(),
      },
    });
  }

  async getInsuranceStats() {
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

      prisma.insuranceApplication.count(
        {
          where: {
            status:
              "APPROVED",
          },
        }
      ),

      prisma.insuranceApplication.count(
        {
          where: {
            status:
              "REJECTED",
          },
        }
      ),

      prisma.insuranceApplication.count(
        {
          where: {
            status:
              "PENDING",
          },
        }
      ),

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

  async getInsuranceAnalytics() {
    return this.getInsuranceStats();
  }
}

export const insuranceService =
  new InsuranceService();

export default insuranceService;