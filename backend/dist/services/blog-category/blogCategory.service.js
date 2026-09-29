"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class BlogCategoryService {
    async getCategories(filters) {
        const { page = 1, limit = 10, search, } = filters;
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
                    slug: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
            ];
        }
        const [categories, total] = await Promise.all([
            prisma_1.default.blogCategory.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.blogCategory.count({ where }),
        ]);
        return {
            categories,
            total,
            page,
            pages: Math.ceil(total / limit),
        };
    }
    async getCategoryById(id) {
        return prisma_1.default.blogCategory.findUnique({
            where: { id },
        });
    }
    async createCategory(data) {
        const existing = await prisma_1.default.blogCategory.findUnique({
            where: {
                slug: data.slug,
            },
        });
        if (existing) {
            throw new Error("Category slug already exists");
        }
        return prisma_1.default.blogCategory.create({
            data,
        });
    }
    async updateCategory(id, data) {
        return prisma_1.default.blogCategory.update({
            where: { id },
            data,
        });
    }
    async toggleStatus(id) {
        const category = await prisma_1.default.blogCategory.findUnique({
            where: { id },
        });
        if (!category) {
            throw new Error("Category not found");
        }
        return prisma_1.default.blogCategory.update({
            where: { id },
            data: {
                isActive: !category.isActive,
            },
        });
    }
    async softDelete(id) {
        return prisma_1.default.blogCategory.delete({
            where: { id },
        });
    }
    async getAnalytics() {
        const [total, active, inactive] = await Promise.all([
            prisma_1.default.blogCategory.count(),
            prisma_1.default.blogCategory.count({
                where: {
                    isActive: true,
                },
            }),
            prisma_1.default.blogCategory.count({
                where: {
                    isActive: false,
                },
            }),
        ]);
        return {
            total,
            active,
            inactive,
        };
    }
}
exports.default = new BlogCategoryService();
