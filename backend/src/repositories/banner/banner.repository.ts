import { prisma } from "../../prisma/prisma";

export class BannerRepository {

  /* ==========================
      CREATE BANNER
  ========================== */

  static async createBanner(data: {
    title: string;
    subtitle?: string;
    description?: string;
    imageUrl: string;
    mobileImage?: string;
    redirectUrl?: string;
    buttonText?: string;
    position?: number;
    bannerType?: string;
    targetAudience?: string;
    startDate?: Date;
    endDate?: Date;
  }) {

    return prisma.banner.create({
      data
    });
  }

  /* ==========================
      GET BANNER BY ID
  ========================== */

  static async getBannerById(
    bannerId: string
  ) {

    return prisma.banner.findUnique({
      where: {
        id: bannerId
      }
    });
  }

  /* ==========================
      GET ACTIVE BANNERS
  ========================== */

  static async getActiveBanners() {

    const now = new Date();

    return prisma.banner.findMany({
      where: {
        isActive: true,
        OR: [
          {
            startDate: null
          },
          {
            startDate: {
              lte: now
            }
          }
        ]
      },
      orderBy: {
        position: "asc"
      }
    });
  }

  /* ==========================
      GET BANNERS BY TYPE
  ========================== */

  static async getBannerByType(
    bannerType: string
  ) {

    return prisma.banner.findMany({
      where: {
        bannerType,
        isActive: true
      },
      orderBy: {
        position: "asc"
      }
    });
  }

  /* ==========================
      GET AUDIENCE BANNERS
  ========================== */

  static async getAudienceBanners(
    audience: string
  ) {

    return prisma.banner.findMany({
      where: {
        targetAudience: audience,
        isActive: true
      },
      orderBy: {
        position: "asc"
      }
    });
  }

  /* ==========================
      UPDATE BANNER
  ========================== */

  static async updateBanner(
    bannerId: string,
    data: any
  ) {

    return prisma.banner.update({
      where: {
        id: bannerId
      },
      data
    });
  }

  /* ==========================
      ACTIVATE BANNER
  ========================== */

  static async activateBanner(
    bannerId: string
  ) {

    return prisma.banner.update({
      where: {
        id: bannerId
      },
      data: {
        isActive: true
      }
    });
  }

  /* ==========================
      DEACTIVATE BANNER
  ========================== */

  static async deactivateBanner(
    bannerId: string
  ) {

    return prisma.banner.update({
      where: {
        id: bannerId
      },
      data: {
        isActive: false
      }
    });
  }

  /* ==========================
      INCREMENT VIEW
  ========================== */

  static async incrementView(
    bannerId: string
  ) {

    return prisma.banner.update({
      where: {
        id: bannerId
      },
      data: {
        viewCount: {
          increment: 1
        }
      }
    });
  }

  /* ==========================
      INCREMENT CLICK
  ========================== */

  static async incrementClick(
    bannerId: string
  ) {

    return prisma.banner.update({
      where: {
        id: bannerId
      },
      data: {
        clickCount: {
          increment: 1
        }
      }
    });
  }

  /* ==========================
      DELETE BANNER
  ========================== */

  static async deleteBanner(
    bannerId: string
  ) {

    return prisma.banner.delete({
      where: {
        id: bannerId
      }
    });
  }

  /* ==========================
      ADMIN ALL BANNERS
  ========================== */

  static async getAllBanners(
    page = 1,
    limit = 20
  ) {

    const skip = (page - 1) * limit;

    const [banners, total] =
      await Promise.all([

        prisma.banner.findMany({
          skip,
          take: limit,
          orderBy: {
            createdAt: "desc"
          }
        }),

        prisma.banner.count()
      ]);

    return {
      total,
      page,
      limit,
      banners
    };
  }

  /* ==========================
      BANNER ANALYTICS
  ========================== */

  static async getBannerAnalytics() {

    const [
      totalBanners,
      activeBanners,
      totalViews,
      totalClicks
    ] = await Promise.all([

      prisma.banner.count(),

      prisma.banner.count({
        where: {
          isActive: true
        }
      }),

      prisma.banner.aggregate({
        _sum: {
          viewCount: true
        }
      }),

      prisma.banner.aggregate({
        _sum: {
          clickCount: true
        }
      })
    ]);

    return {
      totalBanners,
      activeBanners,
      totalViews:
        totalViews._sum.viewCount || 0,

      totalClicks:
        totalClicks._sum.clickCount || 0,

      ctr:
        totalClicks._sum.clickCount &&
        totalViews._sum.viewCount
          ? (
              (totalClicks._sum.clickCount /
                totalViews._sum.viewCount) *
              100
            ).toFixed(2)
          : 0
    };
  }
}