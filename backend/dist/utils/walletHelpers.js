"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWalletBalance = exports.checkWalletBalance = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma"));
/* ========================================
   CHECK BALANCE
======================================== */
const checkWalletBalance = async (userId, amount) => {
    const wallet = await prisma_1.default.wallet.findUnique({
        where: {
            userId,
        },
    });
    if (!wallet) {
        throw new Error("Wallet not found");
    }
    if (wallet.balance < amount) {
        throw new Error("Insufficient balance");
    }
    return wallet;
};
exports.checkWalletBalance = checkWalletBalance;
/* ========================================
   UPDATE BALANCE
======================================== */
const updateWalletBalance = async (userId, amount) => {
    const wallet = await prisma_1.default.wallet.findUnique({
        where: {
            userId,
        },
    });
    if (!wallet) {
        throw new Error("Wallet not found");
    }
    return await prisma_1.default.wallet.update({
        where: {
            userId,
        },
        data: {
            balance: wallet.balance + amount,
        },
    });
};
exports.updateWalletBalance = updateWalletBalance;
