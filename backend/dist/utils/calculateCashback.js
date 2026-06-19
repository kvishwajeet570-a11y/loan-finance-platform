"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../prisma/prisma"));
/* ========================================
   CALCULATE CASHBACK
======================================== */
const calculateCashback = async (userId, amount) => {
    /* ========================================
       CASHBACK LOGIC
    ======================================== */
    let cashback = 0;
    if (amount >= 100) {
        cashback =
            amount * 0.05;
    }
    /* ========================================
       FIND WALLET
    ======================================== */
    const wallet = await prisma_1.default.wallet.findUnique({
        where: {
            userId,
        },
    });
    if (!wallet) {
        throw new Error("Wallet not found");
    }
    /* ========================================
       UPDATE CASHBACK
    ======================================== */
    const updatedWallet = await prisma_1.default.wallet.update({
        where: {
            userId,
        },
        data: {
            cashback: wallet.cashback + cashback,
        },
    });
    return {
        cashback,
        wallet: updatedWallet,
    };
};
exports.default = calculateCashback;
