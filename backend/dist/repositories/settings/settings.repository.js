"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsRepository = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class SettingsRepository {
    /* =========================
        CREATE SETTING
    ========================= */
    static async createSetting(data) {
        return prisma_1.default.setting.create({
            data,
        });
    }
    /* =========================
        GET BY ID
    ========================= */
    static async getById(id) {
        return prisma_1.default.setting.findUnique({
            where: { id },
        });
    }
    /* =========================
        GET BY KEY
    ========================= */
    static async getByKey(key) {
        return prisma_1.default.setting.findUnique({
            where: { key },
        });
    }
    /* =========================
        GET CATEGORY SETTINGS
    ========================= */
    static async getByCategory(category) {
        return prisma_1.default.setting.findMany({
            where: {
                category,
            },
            orderBy: {
                key: "asc",
            },
        });
    }
    /* =========================
        UPDATE SETTING
    ========================= */
    static async updateSetting(key, value, description) {
        return prisma_1.default.setting.update({
            where: {
                key,
            },
            data: {
                value,
                description,
            },
        });
    }
    /* =========================
        UPSERT SETTING
    ========================= */
    static async upsertSetting(data) {
        return prisma_1.default.setting.upsert({
            where: {
                key: data.key,
            },
            update: {
                value: data.value,
                category: data.category,
                description: data.description,
            },
            create: data,
        });
    }
    /* =========================
        DELETE SETTING
    ========================= */
    static async deleteSetting(key) {
        return prisma_1.default.setting.delete({
            where: {
                key,
            },
        });
    }
    /* =========================
        BULK UPDATE
    ========================= */
    static async bulkUpdate(settings) {
        return prisma_1.default.$transaction(settings.map((setting) => prisma_1.default.setting.update({
            where: {
                key: setting.key,
            },
            data: {
                value: setting.value,
            },
        })));
    }
    /* =========================
        SEARCH SETTINGS
    ========================= */
    /* =========================
        SEARCH SETTINGS
    ========================= */
    static async searchSettings(keyword) {
        return prisma_1.default.setting.findMany({
            where: {
                OR: [
                    {
                        key: {
                            contains: keyword,
                            mode: "insensitive",
                        },
                    },
                    {
                        category: {
                            contains: keyword,
                            mode: "insensitive",
                        },
                    },
                    {
                        description: {
                            contains: keyword,
                            mode: "insensitive",
                        },
                    },
                ],
            },
            orderBy: {
                key: "asc",
            },
        });
    }
    /* =========================
        GET ALL SETTINGS
    ========================= */
    static async getAllSettings(page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const [settings, total] = await Promise.all([
            prisma_1.default.setting.findMany({
                skip,
                take: limit,
                orderBy: {
                    category: "asc",
                },
            }),
            prisma_1.default.setting.count(),
        ]);
        return {
            settings,
            total,
            page,
            limit,
        };
    }
    /* =========================
        SETTINGS ANALYTICS
    ========================= */
    static async getAnalytics() {
        const totalSettings = await prisma_1.default.setting.count();
        const categories = await prisma_1.default.setting.groupBy({
            by: ["category"],
            _count: true,
        });
        return {
            totalSettings,
            categories,
        };
    }
    /* =========================
        PLATFORM CONFIG
    ========================= */
    static async getPlatformConfig() {
        const settings = await prisma_1.default.setting.findMany();
        return settings.reduce((acc, item) => {
            acc[item.key] = item.value;
            return acc;
        }, {});
    }
}
exports.SettingsRepository = SettingsRepository;
exports.default = SettingsRepository;
