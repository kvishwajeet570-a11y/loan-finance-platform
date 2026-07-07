import prisma from "../../prisma/prisma";

interface CreateBannerDto {
  title: string;
  description?: string;
  image: string;
  redirectUrl?: string;
  position?: string;
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
}

class BannerService {
  async createBanner(data: CreateBannerDto) {
    return prisma.banner.create({
      data: {
        ...data,
        isActive: data.isActive ?? true,
      },
    });
  }

  async getAllBanners(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [banners, total] = await Promise.all([
      prisma.banner.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.banner.count(),
    ]);

    return {
      banners,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async getActiveBanners() {
    const now = new Date();

    return prisma.banner.findMany({
      where: {
        isActive: true,
        OR: [
          { endDate: null },
          {
            endDate: {
              gte: now,
            },
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getBannerById(id: string) {
    return prisma.banner.findUnique({
      where: { id },
    });
  }

  async updateBanner(id: string, data: Partial<CreateBannerDto>) {
    return prisma.banner.update({
      where: { id },
      data,
    });
  }

  async toggleBanner(id: string) {
    const banner = await prisma.banner.findUnique({
      where: { id },
    });

    if (!banner) {
      throw new Error("Banner not found");
    }

    return prisma.banner.update({
      where: { id },
      data: {
        isActive: !banner.isActive,
      },
    });
  }

  async deleteBanner(id: string) {
    return prisma.banner.delete({
      where: { id },
    });
  }

  async getBannerStats() {
    const [
      total,
      active,
      inactive,
    ] = await Promise.all([
      prisma.banner.count(),
      prisma.banner.count({
        where: { isActive: true },
      }),
      prisma.banner.count({
        where: { isActive: false },
      }),
    ]);

    return {
      total,
      active,
      inactive,
    };
  }
}

export default new BannerService();