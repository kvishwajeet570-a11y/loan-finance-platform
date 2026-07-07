"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiRepository = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class AiRepository {
    static async getUserProfile(userId) {
        return prisma_1.default.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phoneNo: true,
                role: true,
                createdAt: true,
            },
        });
    }
    static async getLoanHistory(userId) {
        return prisma_1.default.loanApplication.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    static async getLatestLoan(userId) {
        return prisma_1.default.loanApplication.findFirst({
            where: {
                userId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    static async getUserAnalytics(userId) {
        const totalLoans = await prisma_1.default.loanApplication.count({
            where: { userId },
        });
        const approvedLoans = await prisma_1.default.loanApplication.count({
            where: {
                userId,
                status: "approved",
            },
        });
        const rejectedLoans = await prisma_1.default.loanApplication.count({
            where: {
                userId,
                status: "rejected",
            },
        });
        return {
            totalLoans,
            approvedLoans,
            rejectedLoans,
        };
    }
    static async getAiContext(userId) {
        const user = await this.getUserProfile(userId);
        const loans = await this.getLoanHistory(userId);
        const analytics = await this.getUserAnalytics(userId);
        return {
            user,
            loans,
            analytics,
        };
    }
}
exports.AiRepository = AiRepository;
