"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleRecharge = exports.getUserRecharges = exports.createRecharge = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma"));
/* ========================================
   CREATE RECHARGE
======================================== */
const createRecharge = async (req, res) => {
    try {
        const { userId, mobileNumber, operator, amount, rechargeType, paymentMethod, } = req.body;
        /* ========================================
           VALIDATION
        ======================================== */
        if (!userId ||
            !mobileNumber ||
            !operator ||
            !amount ||
            !rechargeType) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        /* ========================================
           CHECK USER
        ======================================== */
        const user = await prisma_1.default.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                wallet: true,
            },
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        /* ========================================
           CHECK WALLET
        ======================================== */
        if (!user.wallet) {
            return res.status(404).json({
                success: false,
                message: "Wallet not found",
            });
        }
        /* ========================================
           CHECK BALANCE
        ======================================== */
        if (user.wallet.balance <
            Number(amount)) {
            return res.status(400).json({
                success: false,
                message: "Insufficient wallet balance",
            });
        }
        /* ========================================
           CREATE RECHARGE
        ======================================== */
        const recharge = await prisma_1.default.recharge.create({
            data: {
                userId,
                mobileNumber,
                operator,
                amount: Number(amount),
                rechargeType,
                status: "success",
            },
        });
        /* ========================================
           UPDATE WALLET
        ======================================== */
        await prisma_1.default.wallet.update({
            where: {
                id: user.wallet.id,
            },
            data: {
                balance: {
                    decrement: Number(amount),
                },
            },
        });
        /* ========================================
           CREATE TRANSACTION
        ======================================== */
        await prisma_1.default.transaction.create({
            data: {
                walletId: user.wallet.id,
                type: "debit",
                amount: Number(amount),
                description: `${rechargeType} Recharge`,
                paymentMethod: paymentMethod || "Wallet",
                status: "success",
                transactionId: `RCG${Date.now()}`,
            },
        });
        /* ========================================
           CREATE NOTIFICATION
        ======================================== */
        await prisma_1.default.notification.create({
            data: {
                userId,
                title: "Recharge Successful",
                message: `₹${amount} recharge completed successfully for ${mobileNumber}`,
                type: "recharge",
            },
        });
        /* ========================================
           RESPONSE
        ======================================== */
        return res.status(201).json({
            success: true,
            message: "Recharge completed successfully",
            recharge,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create recharge",
        });
    }
};
exports.createRecharge = createRecharge;
/* ========================================
   GET USER RECHARGES
======================================== */
const getUserRecharges = async (req, res) => {
    try {
        /* ========================================
           GET USER ID
        ======================================== */
        const userId = req.params.userId;
        /* ========================================
           VALIDATION
        ======================================== */
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }
        /* ========================================
           FETCH RECHARGES
        ======================================== */
        const recharges = await prisma_1.default.recharge.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        /* ========================================
           TOTAL RECHARGE AMOUNT
        ======================================== */
        const totalRechargeAmount = recharges.reduce((acc, item) => acc + item.amount, 0);
        /* ========================================
           RESPONSE
        ======================================== */
        return res.status(200).json({
            success: true,
            count: recharges.length,
            totalRechargeAmount,
            recharges,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch recharges",
        });
    }
};
exports.getUserRecharges = getUserRecharges;
/* ========================================
   GET SINGLE RECHARGE
======================================== */
const getSingleRecharge = async (req, res) => {
    try {
        const id = req.params.id;
        const recharge = await prisma_1.default.recharge.findUnique({
            where: {
                id,
            },
        });
        if (!recharge) {
            return res.status(404).json({
                success: false,
                message: "Recharge not found",
            });
        }
        return res.status(200).json({
            success: true,
            recharge,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch recharge",
        });
    }
};
exports.getSingleRecharge = getSingleRecharge;
