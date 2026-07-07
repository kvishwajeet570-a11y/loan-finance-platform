"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginHistoryRepository = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class LoginHistoryRepository {
    async create(data) {
        return prisma_1.default.loginHistory.create({
            data: {
                userId: data.userId,
                ipAddress: data.ipAddress,
                deviceInfo: data.deviceInfo,
            },
        });
    }
    async getByUserId(userId) {
        return prisma_1.default.loginHistory.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async getLastLogin(userId) {
        return prisma_1.default.loginHistory.findFirst({
            where: {
                userId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async deleteOldHistory(days) {
        const date = new Date();
        date.setDate(date.getDate() - days);
        return prisma_1.default.loginHistory.deleteMany({
            where: {
                createdAt: {
                    lt: date,
                },
            },
        });
    }
}
exports.LoginHistoryRepository = LoginHistoryRepository;
exports.default = new LoginHistoryRepository();
