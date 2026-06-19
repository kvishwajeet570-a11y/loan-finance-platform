"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMoneyService = exports.getWalletService = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma"));
/* ========================================
   GET WALLET SERVICE
======================================== */
const getWalletService = async (userId) => {
    return await prisma_1.default.wallet.findUnique({
        where: {
            userId,
        },
        include: {
            transactions: true,
            walletHistory: true,
        },
    });
};
exports.getWalletService = getWalletService;
/* ========================================
   ADD MONEY SERVICE
======================================== */
const addMoneyService = async (userId, amount) => {
    const wallet = await prisma_1.default.wallet.findUnique({
        where: {
            userId,
        },
    });
    if (!wallet) {
        throw new Error("Wallet not found");
    }
    const updatedWallet = await prisma_1.default.wallet.update({
        where: {
            userId,
        },
        data: {
            balance: wallet.balance + amount,
            totalEarnings: wallet.totalEarnings + amount,
        },
    });
    await prisma_1.default.transaction.create({
        data: {
            walletId: wallet.id,
            type: "credit",
            amount,
            description: "Money Added",
            status: "success",
        },
    });
    return updatedWallet;
};
exports.addMoneyService = addMoneyService;
