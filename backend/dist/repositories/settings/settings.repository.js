"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsRepository = void 0;
const prisma_1 = require("../../prisma");
class SettingsRepository {
    /* =========================
        CREATE SETTING
    ========================= */
    static async createSetting(data) {
        return prisma_1.prisma.setting.create({
            data
        });
    }
    /* =========================
        GET BY ID
    ========================= */
    static async getById(id) {
        return prisma_1.prisma.setting.findUnique({
            where: { id }
        });
    }
    /* =========================
        GET BY KEY
    ========================= */
    static async getByKey(settingKey) {
        return prisma_1.prisma.setting.findUnique({
            where: {
                settingKey
            }
        });
    }
    /* =========================
        GET CATEGORY SETTINGS
    ========================= */
    static async getByCategory(category) {
        return prisma_1.prisma.setting.findMany({
            where: {
                category
            },
            orderBy: {
                settingKey: "asc"
            }
        });
    }
    /* =========================
        GET PUBLIC SETTINGS
    ========================= */
    static async getPublicSettings() {
        return prisma_1.prisma.setting.findMany({
            where: {
                isPublic: true
            }
        });
    }
    /* =========================
        UPDATE SETTING
    ========================= */
    static async updateSetting(settingKey, settingValue, updatedBy) {
        return prisma_1.prisma.setting.update({
            where: {
                settingKey
            },
            data: {
                settingValue,
                updatedBy
            }
        });
    }
    /* =========================
        UPSERT SETTING
    ========================= */
    static async upsertSetting(data) {
        return prisma_1.prisma.setting.upsert({
            where: {
                settingKey: data.settingKey
            },
            update: {
                settingValue: data.settingValue,
                updatedBy: data.updatedBy
            },
            create: data
        });
    }
    /* =========================
        DELETE SETTING
    ========================= */
    static async deleteSetting(settingKey) {
        return prisma_1.prisma.setting.delete({
            where: {
                settingKey
            }
        });
    }
    /* =========================
        BULK UPDATE
    ========================= */
    static async bulkUpdate(settings) {
        return prisma_1.prisma.$transaction(settings.map(setting => prisma_1.prisma.setting.update({
            where: {
                settingKey: setting.settingKey
            },
            data: {
                settingValue: setting.settingValue
            }
        })));
    }
    /* =========================
        SEARCH SETTINGS
    ========================= */
    static async searchSettings(keyword) {
        return prisma_1.prisma.setting.findMany({
            where: {
                OR: [
                    {
                        settingKey: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    },
                    {
                        category: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    },
                    {
                        description: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    }
                ]
            }
        });
    }
    /* =========================
        GET ALL SETTINGS
    ========================= */
    static async getAllSettings(page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const [settings, total] = await Promise.all([
            prisma_1.prisma.setting.findMany({
                skip,
                take: limit,
                orderBy: {
                    category: "asc"
                }
            }),
            prisma_1.prisma.setting.count()
        ]);
        return {
            settings,
            total,
            page,
            limit
        };
    }
    /* =========================
        SETTINGS ANALYTICS
    ========================= */
    static async getAnalytics() {
        const [totalSettings, publicSettings] = await Promise.all([
            prisma_1.prisma.setting.count(),
            prisma_1.prisma.setting.count({
                where: {
                    isPublic: true
                }
            })
        ]);
        return {
            totalSettings,
            publicSettings
        };
    }
    /* =========================
        PLATFORM CONFIG
    ========================= */
    static async getPlatformConfig() {
        const settings = await prisma_1.prisma.setting.findMany();
        return settings.reduce((acc, item) => {
            acc[item.settingKey] =
                item.settingValue;
            return acc;
        }, {});
    }
}
exports.SettingsRepository = SettingsRepository;
