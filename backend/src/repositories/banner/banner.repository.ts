import prisma from "../../prisma/prisma";

export class BannerRepository {

  // ==========================================
  // CREATE BANNER
  // ==========================================

  static async createBanner(data: {
    title: string;
    description?: string;
    image: string;
    redirectUrl?: string;
    position?: string;
    startDate?: Date;
    endDate?: Date;
    isActive?: boolean;
  }) {
    return prisma.banner.create({
      data: {
        ...data,
        isActive: data.isActive ?? true,
      },
    });
  }

  // ==========================================
  // GET BANNER BY ID
  // ==========================================

  static async getBannerById(bannerId: string) {
    return prisma.banner.findUnique({
      where: {
        id: bannerId,
      },
    });
  }

  // ==========================================
  // GET ACTIVE BANNERS
  // ==========================================

  static async getActiveBanners() {
    const now = new Date();

    return prisma.banner.findMany({
      where: {
        isActive: true,
        OR: [
          {
            startDate: null,
          },
          {
            startDate: {
              lte: now,
            },
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // ==========================================
  // GET BANNER BY TYPE
  // ==========================================

  static async getBannerByType(type: string) {
    // bannerType field schema में नहीं है
    return prisma.banner.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // ==========================================
  // GET AUDIENCE BANNERS
  // ==========================================

  static async getAudienceBanners(audience: string) {
    // targetAudience field schema में नहीं है
    return prisma.banner.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // ==========================================
  // UPDATE BANNER
  // ==========================================

  static async updateBanner(
    bannerId: string,
    data: {
      title?: string;
      description?: string;
      image?: string;
      redirectUrl?: string;
      position?: string;
      startDate?: Date;
      endDate?: Date;
      isActive?: boolean;
    }
  ) {
    return prisma.banner.update({
      where: {
        id: bannerId,
      },
      data,
    });
  }

  // ==========================================
  // ACTIVATE BANNER
  // ==========================================

  static async activateBanner(bannerId: string) {
    return prisma.banner.update({
      where: {
        id: bannerId,
      },
      data: {
        isActive: true,
      },
    });
  }

  // ==========================================
  // DEACTIVATE BANNER
  // ==========================================

  static async deactivateBanner(bannerId: string) {
    return prisma.banner.update({
      where: {
        id: bannerId,
      },
      data: {
        isActive: false,
      },
    });
  }

  // ==========================================
  // INCREMENT VIEW
  // ==========================================

  static async incrementView(bannerId: string) {
    // viewCount schema में नहीं है
    return prisma.banner.findUnique({
      where: {
        id: bannerId,
      },
    });
  }

  // ==========================================
  // INCREMENT CLICK
  // ==========================================

  static async incrementClick(bannerId: string) {
    // clickCount schema में नहीं है
    return prisma.banner.findUnique({
      where: {
        id: bannerId,
      },
    });
  }

  // ==========================================
  // DELETE BANNER
  // ==========================================

  static async deleteBanner(bannerId: string) {
    return prisma.banner.delete({
      where: {
        id: bannerId,
      },
    });
  }

  // ==========================================
  // ADMIN ALL BANNERS
  // ==========================================

  static async getAllBanners(page = 1, limit = 20) {
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
      total,
      page,
      limit,
      banners,
    };
  }

  // ==========================================
  // BANNER ANALYTICS
  // ==========================================

  static async getBannerAnalytics() {
    const [totalBanners, activeBanners] = await Promise.all([
      prisma.banner.count(),

      prisma.banner.count({
        where: {
          isActive: true,
        },
      }),
    ]);

    return {
      totalBanners,
      activeBanners,
      inactiveBanners: totalBanners - activeBanners,
    };
  }
}