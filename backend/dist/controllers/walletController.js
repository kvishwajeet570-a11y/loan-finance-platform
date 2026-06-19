"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWalletHistory = exports.withdrawMoney = exports.addMoney = exports.getWallet = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma"));
/* ========================================
   GET WALLET
======================================== */
const getWallet = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }
        const wallet = await prisma_1.default.wallet.findUnique({
            where: {
                userId,
            },
            include: {
                transactions: {
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
        });
        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: "Wallet not found",
            });
        }
        return res.status(200).json({
            success: true,
            wallet,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch wallet",
        });
    }
};
exports.getWallet = getWallet;
/* ========================================
   ADD MONEY
======================================== */
const addMoney = async (req, res) => {
    try {
        const { userId, amount, } = req.body;
        if (!userId ||
            !amount) {
            return res.status(400).json({
                success: false,
                message: "User ID and amount are required",
            });
        }
        const wallet = await prisma_1.default.wallet.findUnique({
            where: {
                userId,
            },
        });
        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: "Wallet not found",
            });
        }
        const updatedWallet = await prisma_1.default.wallet.update({
            where: {
                userId,
            },
            data: {
                balance: {
                    increment: Number(amount),
                },
            },
        });
        await prisma_1.default.transaction.create({
            data: {
                walletId: wallet.id,
                type: "credit",
                amount: Number(amount),
                description: "Money Added",
                status: "success",
            },
        });
        return res.status(200).json({
            success: true,
            message: "Money added successfully",
            wallet: updatedWallet,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to add money",
        });
    }
};
exports.addMoney = addMoney;
/* ========================================
   WITHDRAW MONEY
======================================== */
const withdrawMoney = async (req, res) => {
    try {
        const { userId, amount, } = req.body;
        if (!userId ||
            !amount) {
            return res.status(400).json({
                success: false,
                message: "User ID and amount are required",
            });
        }
        const wallet = await prisma_1.default.wallet.findUnique({
            where: {
                userId,
            },
        });
        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: "Wallet not found",
            });
        }
        if (wallet.balance <
            Number(amount)) {
            return res.status(400).json({
                success: false,
                message: "Insufficient balance",
            });
        }
        const updatedWallet = await prisma_1.default.wallet.update({
            where: {
                userId,
            },
            data: {
                balance: {
                    decrement: Number(amount),
                },
            },
        });
        await prisma_1.default.transaction.create({
            data: {
                walletId: wallet.id,
                type: "debit",
                amount: Number(amount),
                description: "Money Withdrawn",
                status: "success",
            },
        });
        return res.status(200).json({
            success: true,
            message: "Money withdrawn successfully",
            wallet: updatedWallet,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to withdraw money",
        });
    }
};
exports.withdrawMoney = withdrawMoney;
/* ========================================
   GET WALLET HISTORY
======================================== */
const getWalletHistory = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }
        const wallet = await prisma_1.default.wallet.findUnique({
            where: {
                userId,
            },
            include: {
                transactions: {
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
        });
        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: "Wallet not found",
            });
        }
        return res.status(200).json({
            success: true,
            transactions: wallet.transactions,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch wallet history",
        });
    }
};
exports.getWalletHistory = getWalletHistory;
