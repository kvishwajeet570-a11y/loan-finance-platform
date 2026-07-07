"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class BannerService {
    async createBanner(data) {
        return prisma_1.default.banner.create({
            data: {
                ...data,
                isActive: data.isActive ?? true,
            },
        });
    }
    async getAllBanners(page = 1, limit = 10) {
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
            banners,
            total,
            page,
            pages: Math.ceil(total / limit),
        };
    }
    async getActiveBanners() {
        const now = new Date();
        return prisma_1.default.banner.findMany({
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
    async getBannerById(id) {
        return prisma_1.default.banner.findUnique({
            where: { id },
        });
    }
    async updateBanner(id, data) {
        return prisma_1.default.banner.update({
            where: { id },
            data,
        });
    }
    async toggleBanner(id) {
        const banner = await prisma_1.default.banner.findUnique({
            where: { id },
        });
        if (!banner) {
            throw new Error("Banner not found");
        }
        return prisma_1.default.banner.update({
            where: { id },
            data: {
                isActive: !banner.isActive,
            },
        });
    }
    async deleteBanner(id) {
        return prisma_1.default.banner.delete({
            where: { id },
        });
    }
    async getBannerStats() {
        const [total, active, inactive,] = await Promise.all([
            prisma_1.default.banner.count(),
            prisma_1.default.banner.count({
                where: { isActive: true },
            }),
            prisma_1.default.banner.count({
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
exports.default = new BannerService();
