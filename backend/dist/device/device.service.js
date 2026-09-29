"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../prisma/prisma"));
class DeviceService {
    async createDevice(data) {
        return prisma_1.default.device.create({
            data,
        });
    }
    async getAllDevices(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [devices, total] = await Promise.all([
            prisma_1.default.device.findMany({
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.device.count(),
        ]);
        return {
            devices,
            total,
            page,
            limit,
        };
    }
    async getDeviceById(id) {
        return prisma_1.default.device.findUnique({
            where: { id },
        });
    }
    async getUserDevices(userId) {
        return prisma_1.default.device.findMany({
            where: {
                userId,
            },
            orderBy: {
                lastLoginAt: "desc",
            },
        });
    }
    async blockDevice(id) {
        return prisma_1.default.device.update({
            where: { id },
            data: {
                isBlocked: true,
            },
        });
    }
    async unblockDevice(id) {
        return prisma_1.default.device.update({
            where: { id },
            data: {
                isBlocked: false,
            },
        });
    }
    async deleteDevice(id) {
        return prisma_1.default.device.delete({
            where: { id },
        });
    }
    async updateLastLogin(id) {
        return prisma_1.default.device.update({
            where: { id },
            data: {
                lastLoginAt: new Date(),
            },
        });
    }
    async getDeviceAnalytics() {
        const [totalDevices, activeDevices, blockedDevices,] = await Promise.all([
            prisma_1.default.device.count(),
            prisma_1.default.device.count({
                where: {
                    isActive: true,
                },
            }),
            prisma_1.default.device.count({
                where: {
                    isBlocked: true,
                },
            }),
        ]);
        return {
            totalDevices,
            activeDevices,
            blockedDevices,
        };
    }
}
exports.default = new DeviceService();
