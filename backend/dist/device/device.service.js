"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../../database/prisma/client"));
class DeviceService {
    async createDevice(data) {
        return client_1.default.device.create({
            data,
        });
    }
    async getAllDevices(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [devices, total] = await Promise.all([
            client_1.default.device.findMany({
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            client_1.default.device.count(),
        ]);
        return {
            devices,
            total,
            page,
            limit,
        };
    }
    async getDeviceById(id) {
        return client_1.default.device.findUnique({
            where: { id },
        });
    }
    async getUserDevices(userId) {
        return client_1.default.device.findMany({
            where: {
                userId,
            },
            orderBy: {
                lastLoginAt: "desc",
            },
        });
    }
    async blockDevice(id) {
        return client_1.default.device.update({
            where: { id },
            data: {
                isBlocked: true,
            },
        });
    }
    async unblockDevice(id) {
        return client_1.default.device.update({
            where: { id },
            data: {
                isBlocked: false,
            },
        });
    }
    async deleteDevice(id) {
        return client_1.default.device.delete({
            where: { id },
        });
    }
    async updateLastLogin(id) {
        return client_1.default.device.update({
            where: { id },
            data: {
                lastLoginAt: new Date(),
            },
        });
    }
    async getDeviceAnalytics() {
        const [totalDevices, activeDevices, blockedDevices,] = await Promise.all([
            client_1.default.device.count(),
            client_1.default.device.count({
                where: {
                    isActive: true,
                },
            }),
            client_1.default.device.count({
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
