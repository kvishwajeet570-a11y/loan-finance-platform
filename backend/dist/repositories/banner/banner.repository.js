"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerRepository = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class BannerRepository {
    // ==========================================
    // CREATE BANNER
    // ==========================================
    static async createBanner(data) {
        return prisma_1.default.banner.create({
            data: {
                ...data,
                isActive: data.isActive ?? true,
            },
        });
    }
    // ==========================================
    // GET BANNER BY ID
    // ==========================================
    static async getBannerById(bannerId) {
        return prisma_1.default.banner.findUnique({
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
        return prisma_1.default.banner.findMany({
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
    static async getBannerByType(type) {
        // bannerType field schema में नहीं है
        return prisma_1.default.banner.findMany({
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
    static async getAudienceBanners(audience) {
        // targetAudience field schema में नहीं है
        return prisma_1.default.banner.findMany({
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
    static async updateBanner(bannerId, data) {
        return prisma_1.default.banner.update({
            where: {
                id: bannerId,
            },
            data,
        });
    }
    // ==========================================
    // ACTIVATE BANNER
    // ==========================================
    static async activateBanner(bannerId) {
        return prisma_1.default.banner.update({
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
    static async deactivateBanner(bannerId) {
        return prisma_1.default.banner.update({
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
    static async incrementView(bannerId) {
        // viewCount schema में नहीं है
        return prisma_1.default.banner.findUnique({
            where: {
                id: bannerId,
            },
        });
    }
    // ==========================================
    // INCREMENT CLICK
    // ==========================================
    static async incrementClick(bannerId) {
        // clickCount schema में नहीं है
        return prisma_1.default.banner.findUnique({
            where: {
                id: bannerId,
            },
        });
    }
    // ==========================================
    // DELETE BANNER
    // ==========================================
    static async deleteBanner(bannerId) {
        return prisma_1.default.banner.delete({
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
            prisma_1.default.banner.findMany({
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.banner.count(),
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
            prisma_1.default.banner.count(),
            prisma_1.default.banner.count({
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
exports.BannerRepository = BannerRepository;
