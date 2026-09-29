"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FastagRepository = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class FastagRepository {
    static async createFastag(data) {
        return prisma_1.default.fastTag.create({
            data,
        });
    }
    static async getById(id) {
        return prisma_1.default.fastTag.findUnique({
            where: { id },
        });
    }
    static async getBySlug(slug) {
        return prisma_1.default.fastTag.findUnique({
            where: { slug },
        });
    }
    static async getByVehicleNo(vehicleNo) {
        return prisma_1.default.fastTag.findFirst({
            where: { vehicleNo },
        });
    }
    static async updateFastag(id, data) {
        return prisma_1.default.fastTag.update({
            where: { id },
            data,
        });
    }
    static async activateFastag(id) {
        return prisma_1.default.fastTag.update({
            where: { id },
            data: {
                isActive: true,
            },
        });
    }
    static async deactivateFastag(id) {
        return prisma_1.default.fastTag.update({
            where: { id },
            data: {
                isActive: false,
            },
        });
    }
    static async deleteFastag(id) {
        return prisma_1.default.fastTag.delete({
            where: { id },
        });
    }
    static async searchFastags(keyword) {
        return prisma_1.default.fastTag.findMany({
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
    static async getUserFastags(userId) {
        return prisma_1.default.fastTag.findMany({
            where: { userId },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    static async getAllFastags(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [records, total] = await Promise.all([
            prisma_1.default.fastTag.findMany({
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.fastTag.count(),
        ]);
        return {
            total,
            page,
            limit,
            records,
        };
    }
    static async getAnalytics() {
        const [totalFastags, activeFastags, inactiveFastags,] = await Promise.all([
            prisma_1.default.fastTag.count(),
            prisma_1.default.fastTag.count({
                where: {
                    isActive: true,
                },
            }),
            prisma_1.default.fastTag.count({
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
        return prisma_1.default.fastTag.groupBy({
            by: ["provider"],
            _count: {
                provider: true,
            },
        });
    }
}
exports.FastagRepository = FastagRepository;
exports.default = FastagRepository;
