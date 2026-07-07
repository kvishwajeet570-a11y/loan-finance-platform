"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class SettingService {
    /**
     * Create Setting
     */
    async createSetting(data) {
        const exists = await prisma_1.default.setting.findUnique({
            where: {
                key: data.key,
            },
        });
        if (exists) {
            throw new Error("Setting already exists");
        }
        return prisma_1.default.setting.create({
            data,
        });
    }
    /**
     * Get Setting By Key
     */
    async getSetting(key) {
        return prisma_1.default.setting.findUnique({
            where: {
                key,
            },
        });
    }
    /**
     * Get All Settings
     */
    async getAllSettings(category) {
        return prisma_1.default.setting.findMany({
            where: category
                ? {
                    category,
                }
                : {},
            orderBy: {
                category: "asc",
            },
        });
    }
    /**
     * Update Setting
     */
    async updateSetting(key, value) {
        return prisma_1.default.setting.update({
            where: {
                key,
            },
            data: {
                value,
            },
        });
    }
    /**
     * Bulk Update
     */
    async bulkUpdate(settings) {
        const updates = settings.map((item) => prisma_1.default.setting.update({
            where: {
                key: item.key,
            },
            data: {
                value: item.value,
            },
        }));
        return prisma_1.default.$transaction(updates);
    }
    /**
     * Delete Setting
     */
    async deleteSetting(settingId) {
        return prisma_1.default.setting.delete({
            where: {
                id: settingId,
            },
        });
    }
    /**
     * Company Configuration
     */
    async companyConfig() {
        const settings = await prisma_1.default.setting.findMany({
            where: {
                category: "company",
            },
        });
        return Object.fromEntries(settings.map((s) => [
            s.key,
            s.value,
        ]));
    }
    /**
     * Loan Configuration
     */
    async loanConfig() {
        const settings = await prisma_1.default.setting.findMany({
            where: {
                category: "loan",
            },
        });
        return Object.fromEntries(settings.map((s) => [
            s.key,
            s.value,
        ]));
    }
    /**
     * Commission Configuration
     */
    async commissionConfig() {
        const settings = await prisma_1.default.setting.findMany({
            where: {
                category: "commission",
            },
        });
        return Object.fromEntries(settings.map((s) => [
            s.key,
            s.value,
        ]));
    }
    /**
     * Referral Configuration
     */
    async referralConfig() {
        const settings = await prisma_1.default.setting.findMany({
            where: {
                category: "referral",
            },
        });
        return Object.fromEntries(settings.map((s) => [
            s.key,
            s.value,
        ]));
    }
    /**
     * Maintenance Mode
     */
    async enableMaintenance() {
        return prisma_1.default.setting.upsert({
            where: {
                key: "maintenance_mode",
            },
            update: {
                value: "true",
            },
            create: {
                key: "maintenance_mode",
                value: "true",
                category: "system",
            },
        });
    }
    async disableMaintenance() {
        return prisma_1.default.setting.upsert({
            where: {
                key: "maintenance_mode",
            },
            update: {
                value: "false",
            },
            create: {
                key: "maintenance_mode",
                value: "false",
                category: "system",
            },
        });
    }
    /**
     * System Status
     */
    async systemStatus() {
        const maintenance = await prisma_1.default.setting.findUnique({
            where: {
                key: "maintenance_mode",
            },
        });
        return {
            maintenance: maintenance?.value ===
                "true",
        };
    }
    /**
     * Seed Default Settings
     */
    async seedDefaultSettings() {
        const settings = [
            {
                key: "company_name",
                value: "India Loan Finance",
                category: "company",
            },
            {
                key: "support_email",
                value: "support@indialoanfinance.com",
                category: "company",
            },
            {
                key: "support_phone",
                value: "8292908077",
                category: "company",
            },
            {
                key: "min_loan_amount",
                value: "10000",
                category: "loan",
            },
            {
                key: "max_loan_amount",
                value: "5000000",
                category: "loan",
            },
            {
                key: "referral_bonus",
                value: "500",
                category: "referral",
            },
        ];
        for (const setting of settings) {
            await prisma_1.default.setting.upsert({
                where: {
                    key: setting.key,
                },
                update: {},
                create: setting,
            });
        }
        return {
            success: true,
            count: settings.length,
        };
    }
    /**
     * Settings Analytics
     */
    async getSettingStats() {
        const [totalSettings, categories,] = await Promise.all([
            prisma_1.default.setting.count(),
            prisma_1.default.setting.groupBy({
                by: ["category"],
            }),
        ]);
        return {
            totalSettings,
            totalCategories: categories.length,
        };
    }
}
exports.default = new SettingService();
