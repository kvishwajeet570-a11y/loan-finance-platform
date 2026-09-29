import prisma from "../../prisma/prisma";

export class FastagRepository {
  static async createFastag(data: {
    userId: string;
    vehicleNo: string;
    provider: string;
    amount: number;
    slug?: string;
    status?: string;
    isActive?: boolean;
  }) {
    return prisma.fastTag.create({
      data,
    });
  }

  static async getById(id: string) {
    return prisma.fastTag.findUnique({
      where: { id },
    });
  }

  static async getBySlug(slug: string) {
    return prisma.fastTag.findUnique({
      where: { slug },
    });
  }

  static async getByVehicleNo(vehicleNo: string) {
    return prisma.fastTag.findFirst({
      where: { vehicleNo },
    });
  }

  static async updateFastag(
    id: string,
    data: Partial<{
      vehicleNo: string;
      provider: string;
      amount: number;
      status: string;
      isActive: boolean;
      slug: string;
    }>
  ) {
    return prisma.fastTag.update({
      where: { id },
      data,
    });
  }

  static async activateFastag(id: string) {
    return prisma.fastTag.update({
      where: { id },
      data: {
        isActive: true,
      },
    });
  }

  static async deactivateFastag(id: string) {
    return prisma.fastTag.update({
      where: { id },
      data: {
        isActive: false,
      },
    });
  }

  static async deleteFastag(id: string) {
    return prisma.fastTag.delete({
      where: { id },
    });
  }

  static async searchFastags(keyword: string) {
    return prisma.fastTag.findMany({
      where: {
        OR: [
          {
            vehicleNo: {
              contains: keyword,
              mode: "insensitive",
            },
          },
          {
            provider: {
              contains: keyword,
              mode: "insensitive",
            },
          },
          {
            status: {
              contains: keyword,
              mode: "insensitive",
            },
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async getUserFastags(userId: string) {
    return prisma.fastTag.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async getAllFastags(
    page = 1,
    limit = 20
  ) {
    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      prisma.fastTag.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.fastTag.count(),
    ]);

    return {
      total,
      page,
      limit,
      records,
    };
  }

  static async getAnalytics() {
    const [
      totalFastags,
      activeFastags,
      inactiveFastags,
    ] = await Promise.all([
      prisma.fastTag.count(),
      prisma.fastTag.count({
        where: {
          isActive: true,
        },
      }),
      prisma.fastTag.count({
        where: {
          isActive: false,
        },
      }),
    ]);

    return {
      totalFastags,
      activeFastags,
      inactiveFastags,
    };
  }

  static async providerAnalytics() {
    return prisma.fastTag.groupBy({
      by: ["provider"],
      _count: {
        provider: true,
      },
    });
  }
}

export default FastagRepository;