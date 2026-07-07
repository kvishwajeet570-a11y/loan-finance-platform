import prisma from "../../prisma/prisma";
import { Prisma } from "@prisma/client";

interface CreateInsuranceDto {
  name: string;
  company: string;
  category: string;

  premiumAmount: number;
  coverageAmount: number;

  tenureMonths: number;

  description?: string;
  benefits?: string[];

  isActive?: boolean;
}

interface InsuranceFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  company?: string;
}

class InsuranceService {
  /**
   * Create Insurance Product
   */
  async createInsurance(
    data: CreateInsuranceDto
  ) {
    return prisma.insurance.create({
      data,
    });
  }

  /**
   * Update Insurance
   */
  async updateInsurance(
    id: string,
    data: Partial<CreateInsuranceDto>
  ) {
    return prisma.insurance.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete Insurance
   */
  async deleteInsurance(id: string) {
    return prisma.insurance.delete({
      where: { id },
    });
  }

  /**
   * Insurance Details
   */
  async getInsuranceById(id: string) {
    return prisma.insurance.findUnique({
      where: { id },
    });
  }

  /**
   * Insurance List
   */
  async getInsurances(
    filters: InsuranceFilters
  ) {
    const {
      page = 1,
      limit = 20,
      search,
      category,
      company,
    } = filters;

    const skip = (page - 1) * limit;

    const where: Prisma.InsuranceWhereInput =
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
          company: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (company) {
      where.company = company;
    }

    const [products, total] =
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
      products,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Apply Insurance
   */
  async applyInsurance(
    userId: string,
    insuranceId: string
  ) {
    return prisma.insuranceApplication.create({
      data: {
        userId,
        insuranceId,
        status: "PENDING",
      },
    });
  }

  /**
   * Approve Insurance
   */
  async approveInsurance(
    applicationId: string
  ) {
    return prisma.insuranceApplication.update({
      where: {
        id: applicationId,
      },
      data: {
        status: "APPROVED",
        approvedAt: new Date(),
      },
    });
  }

  /**
   * Reject Insurance
   */
  async rejectInsurance(
    applicationId: string,
    reason: string
  ) {
    return prisma.insuranceApplication.update({
      where: {
        id: applicationId,
      },
      data: {
        status: "REJECTED",
        rejectionReason: reason,
      },
    });
  }

  /**
   * User Policies
   */
  async getUserPolicies(
    userId: string
  ) {
    return prisma.insuranceApplication.findMany({
      where: {
        userId,
      },
      include: {
        insurance: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Dashboard Stats
   */
  async getInsuranceStats() {
    const [
      totalProducts,
      totalPolicies,
      approvedPolicies,
      pendingPolicies,
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
          status: "PENDING",
        },
      }),
    ]);

    return {
      totalProducts,
      totalPolicies,
      approvedPolicies,
      pendingPolicies,
    };
  }
}

export default new InsuranceService();