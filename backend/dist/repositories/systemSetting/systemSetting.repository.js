"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class SystemSettingRepository {
    // =========================================
    // CREATE
    // =========================================
    async create(data) {
        return prisma_1.default.systemSetting.create({
            data,
        });
    }
    // =========================================
    // GET ALL
    // =========================================
    async findAll(where = {}, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            prisma_1.default.systemSetting.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    updatedAt: "desc",
                },
            }),
            prisma_1.default.systemSetting.count({
                where,
            }),
        ]);
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    // =========================================
    // FIND BY ID
    // =========================================
    async findById(id) {
        return prisma_1.default.systemSetting.findUnique({
            where: {
                id,
            },
        });
    }
    // =========================================
    // FIND BY KEY
    // =========================================
    async findByKey(key) {
        return prisma_1.default.systemSetting.findUnique({
            where: {
                key,
            },
        });
    }
    // =========================================
    // UPDATE
    // =========================================
    async update(id, data) {
        return prisma_1.default.systemSetting.update({
            where: {
                id,
            },
            data,
        });
    }
    // =========================================
    // DELETE
    // =========================================
    async delete(id) {
        return prisma_1.default.systemSetting.delete({
            where: {
                id,
            },
        });
    }
    // =========================================
    // COUNT
    // =========================================
    async count(where = {}) {
        return prisma_1.default.systemSetting.count({
            where,
        });
    }
    // =========================================
    // BULK UPDATE
    // =========================================
    async bulkUpdate(settings) {
        return prisma_1.default.$transaction(settings.map((item) => prisma_1.default.systemSetting.update({
            where: {
                key: item.key,
            },
            data: {
                value: item.value,
                updatedBy: item.updatedBy,
            },
        })));
    }
    // =========================================
    // TOGGLE ACTIVE STATUS
    // =========================================
    async toggleStatus(id) {
        const setting = await prisma_1.default.systemSetting.findUnique({
            where: {
                id,
            },
        });
        if (!setting) {
            throw new Error("System setting not found.");
        }
        return prisma_1.default.systemSetting.update({
            where: {
                id,
            },
            data: {
                isActive: !setting.isActive,
            },
        });
    }
    // =========================================
    // TOGGLE ENCRYPTION
    // =========================================
    async toggleEncryption(id) {
        const setting = await prisma_1.default.systemSetting.findUnique({
            where: {
                id,
            },
        });
        if (!setting) {
            throw new Error("System setting not found.");
        }
        return prisma_1.default.systemSetting.update({
            where: {
                id,
            },
            data: {
                isEncrypted: !setting.isEncrypted,
            },
        });
    }
    // =========================================
    // EXISTS BY KEY
    // =========================================
    async exists(key) {
        const count = await prisma_1.default.systemSetting.count({
            where: {
                key,
            },
        });
        return count > 0;
    }
    // =========================================
    // GET ACTIVE SETTINGS
    // =========================================
    async getActiveSettings() {
        return prisma_1.default.systemSetting.findMany({
            where: {
                isActive: true,
            },
            orderBy: {
                key: "asc",
            },
        });
    }
    // =========================================
    // GET BY CATEGORY
    // =========================================
    async getByCategory(category) {
        return prisma_1.default.systemSetting.findMany({
            where: {
                category: category,
            },
            orderBy: {
                key: "asc",
            },
        });
    }
}
exports.default = new SystemSettingRepository();
