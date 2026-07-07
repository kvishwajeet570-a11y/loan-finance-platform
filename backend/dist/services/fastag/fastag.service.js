"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class FastTagService {
    /**
     * Create Fast Tag
     */
    async createFastTag(data) {
        const existing = await prisma_1.default.fastTag.findUnique({
            where: {
                slug: data.slug,
            },
        });
        if (existing) {
            throw new Error("Fast tag already exists");
        }
        return prisma_1.default.fastTag.create({
            data,
        });
    }
    /**
     * Update Fast Tag
     */
    async updateFastTag(id, data) {
        return prisma_1.default.fastTag.update({
            where: { id },
            data,
        });
    }
    /**
     * Delete Fast Tag
     */
    async deleteFastTag(id) {
        return prisma_1.default.fastTag.delete({
            where: { id },
        });
    }
    /**
     * Get Tag By ID
     */
    async getFastTagById(id) {
        return prisma_1.default.fastTag.findUnique({
            where: { id },
        });
    }
    /**
     * Get Tag By Slug
     */
    async getFastTagBySlug(slug) {
        return prisma_1.default.fastTag.findUnique({
            where: { slug },
        });
    }
    /**
     * Get All Tags
     */
    async getFastTags(filters) {
        const { page = 1, limit = 20, search, isActive, } = filters;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                {
                    name: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    description: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
            ];
        }
        if (typeof isActive === "boolean") {
            where.isActive = isActive;
        }
        const [tags, total] = await Promise.all([
            prisma_1.default.fastTag.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.fastTag.count({
                where,
            }),
        ]);
        return {
            tags,
            total,
            page,
            pages: Math.ceil(total / limit),
        };
    }
    /**
     * Active Tags
     */
    async getActiveTags() {
        return prisma_1.default.fastTag.findMany({
            where: {
                isActive: true,
            },
            orderBy: {
                name: "asc",
            },
        });
    }
    /**
     * Enable Tag
     */
    async activateTag(id) {
        return prisma_1.default.fastTag.update({
            where: { id },
            data: {
                isActive: true,
            },
        });
    }
    /**
     * Disable Tag
     */
    async deactivateTag(id) {
        return prisma_1.default.fastTag.update({
            where: { id },
            data: {
                isActive: false,
            },
        });
    }
    /**
     * Dashboard Stats
     */
    async getFastTagStats() {
        const [totalTags, activeTags, inactiveTags,] = await Promise.all([
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
            totalTags,
            activeTags,
            inactiveTags,
        };
    }
}
exports.default = new FastTagService();
