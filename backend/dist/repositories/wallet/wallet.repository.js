"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletRepository = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class WalletRepository {
    async createWallet(userId) {
        return prisma_1.default.wallet.create({
            data: {
                userId,
                balance: 0,
                cashback: 0,
                rewardBalance: 0,
                totalEarnings: 0,
            },
        });
    }
    async findByUserId(userId) {
        return prisma_1.default.wallet.findUnique({
            where: {
                userId,
            },
            include: {
                transactions: true,
                walletHistory: true,
            },
        });
    }
    async findByWalletId(walletId) {
        return prisma_1.default.wallet.findUnique({
            where: {
                id: walletId,
            },
        });
    }
    async updateBalance(walletId, amount) {
        return prisma_1.default.wallet.update({
            where: {
                id: walletId,
            },
            data: {
                balance: amount,
            },
        });
    }
    async addBalance(walletId, amount) {
        return prisma_1.default.wallet.update({
            where: {
                id: walletId,
            },
            data: {
                balance: {
                    increment: amount,
                },
            },
        });
    }
    async deductBalance(walletId, amount) {
        return prisma_1.default.wallet.update({
            where: {
                id: walletId,
            },
            data: {
                balance: {
                    decrement: amount,
                },
            },
        });
    }
    async updateCashback(walletId, cashback) {
        return prisma_1.default.wallet.update({
            where: {
                id: walletId,
            },
            data: {
                cashback: {
                    increment: cashback,
                },
            },
        });
    }
    async updateRewardBalance(walletId, reward) {
        return prisma_1.default.wallet.update({
            where: {
                id: walletId,
            },
            data: {
                rewardBalance: {
                    increment: reward,
                },
            },
        });
    }
    async updateTotalEarnings(walletId, amount) {
        return prisma_1.default.wallet.update({
            where: {
                id: walletId,
            },
            data: {
                totalEarnings: {
                    increment: amount,
                },
            },
        });
    }
}
exports.WalletRepository = WalletRepository;
exports.default = new WalletRepository();
