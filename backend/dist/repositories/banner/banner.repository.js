"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerRepository = void 0;
const prisma_1 = require("../../prisma/prisma");
class BannerRepository {
    /* ==========================
        CREATE BANNER
    ========================== */
    static async createBanner(data) {
        return prisma_1.prisma.banner.create({
            data
        });
    }
    /* ==========================
        GET BANNER BY ID
    ========================== */
    static async getBannerById(bannerId) {
        return prisma_1.prisma.banner.findUnique({
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
        return prisma_1.prisma.banner.findMany({
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
    static async getBannerByType(bannerType) {
        return prisma_1.prisma.banner.findMany({
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
    static async getAudienceBanners(audience) {
        return prisma_1.prisma.banner.findMany({
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
    static async updateBanner(bannerId, data) {
        return prisma_1.prisma.banner.update({
            where: {
                id: bannerId
            },
            data
        });
    }
    /* ==========================
        ACTIVATE BANNER
    ========================== */
    static async activateBanner(bannerId) {
        return prisma_1.prisma.banner.update({
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
    static async deactivateBanner(bannerId) {
        return prisma_1.prisma.banner.update({
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
    static async incrementView(bannerId) {
        return prisma_1.prisma.banner.update({
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
    static async incrementClick(bannerId) {
        return prisma_1.prisma.banner.update({
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
    static async deleteBanner(bannerId) {
        return prisma_1.prisma.banner.delete({
            where: {
                id: bannerId
            }
        });
    }
    /* ==========================
        ADMIN ALL BANNERS
    ========================== */
    static async getAllBanners(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [banners, total] = await Promise.all([
            prisma_1.prisma.banner.findMany({
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc"
                }
            }),
            prisma_1.prisma.banner.count()
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
        const [totalBanners, activeBanners, totalViews, totalClicks] = await Promise.all([
            prisma_1.prisma.banner.count(),
            prisma_1.prisma.banner.count({
                where: {
                    isActive: true
                }
            }),
            prisma_1.prisma.banner.aggregate({
                _sum: {
                    viewCount: true
                }
            }),
            prisma_1.prisma.banner.aggregate({
                _sum: {
                    clickCount: true
                }
            })
        ]);
        return {
            totalBanners,
            activeBanners,
            totalViews: totalViews._sum.viewCount || 0,
            totalClicks: totalClicks._sum.clickCount || 0,
            ctr: totalClicks._sum.clickCount &&
                totalViews._sum.viewCount
                ? ((totalClicks._sum.clickCount /
                    totalViews._sum.viewCount) *
                    100).toFixed(2)
                : 0
        };
    }
}
exports.BannerRepository = BannerRepository;
