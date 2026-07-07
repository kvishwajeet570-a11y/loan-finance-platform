import prisma from "../../prisma/prisma";
import { Prisma } from "@prisma/client";

interface SubmitKYCDto {
  userId: string;
  fullName: string;
  panNumber: string;
  dob: string;

  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

interface KYCFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

class KYCService {
  /**
   * Submit KYC
   */
  async submitKYC(data: SubmitKYCDto) {
    const existingKYC =
      await prisma.kYC.findFirst({
        where: {
          userId: data.userId,
        },
      });

    if (existingKYC) {
      throw new Error(
        "KYC already submitted"
      );
    }

    return prisma.kYC.create({
      data: {
        ...data,
        status: "PENDING",
      },
    });
  }

  /**
   * Get KYC By User
   */
  async getUserKYC(userId: string) {
    return prisma.kYC.findFirst({
      where: {
        userId,
      },
    });
  }

  /**
   * Verify KYC
   */
  async approveKYC(
    kycId: string,
    adminId: string
  ) {
    return prisma.$transaction(
      async (tx) => {
        const kyc =
          await tx.kYC.update({
            where: {
              id: kycId,
            },
            data: {
              status: "APPROVED",
              approvedBy: adminId,
              approvedAt: new Date(),
            },
          });

        await tx.user.update({
          where: {
            id: kyc.userId,
          },
          data: {
            isVerified: true,
          },
        });

        return kyc;
      }
    );
  }

  /**
   * Reject KYC
   */
  async rejectKYC(
    kycId: string,
    reason: string,
    adminId: string
  ) {
    return prisma.kYC.update({
      where: {
        id: kycId,
      },
      data: {
        status: "REJECTED",
        rejectionReason: reason,
        approvedBy: adminId,
      },
    });
  }

  /**
   * Update KYC
   */
  async updateKYC(
    kycId: string,
    data: Partial<SubmitKYCDto>
  ) {
    return prisma.kYC.update({
      where: {
        id: kycId,
      },
      data,
    });
  }

  /**
   * Get All KYC
   */
  async getAllKYC(
    filters: KYCFilters
  ) {
    const {
      page = 1,
      limit = 20,
      search,
      status,
    } = filters;

    const skip = (page - 1) * limit;

    const where: Prisma.KYCWhereInput =
      {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        {
          fullName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          panNumber: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    const [kycs, total] =
      await Promise.all([
        prisma.kYC.findMany({
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

        prisma.kYC.count({
          where,
        }),
      ]);

    return {
      kycs,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Pending KYC
   */
  async getPendingKYC() {
    return prisma.kYC.findMany({
      where: {
        status: "PENDING",
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * KYC Dashboard Stats
   */
  async getKYCStats() {
    const [
      total,
      pending,
      approved,
      rejected,
    ] = await Promise.all([
      prisma.kYC.count(),

      prisma.kYC.count({
        where: {
          status: "PENDING",
        },
      }),

      prisma.kYC.count({
        where: {
          status: "APPROVED",
        },
      }),

      prisma.kYC.count({
        where: {
          status: "REJECTED",
        },
      }),
    ]);

    return {
      total,
      pending,
      approved,
      rejected,
    };
  }

  /**
   * Check User Eligibility
   */
  async isKYCCompleted(
    userId: string
  ) {
    const kyc =
      await prisma.kYC.findFirst({
        where: {
          userId,
          status: "APPROVED",
        },
      });

    return {
      completed: !!kyc,
      kyc,
    };
  }
}

export default new KYCService();