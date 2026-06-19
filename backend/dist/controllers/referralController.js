"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyReferralCode = exports.getReferral = exports.createReferral = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma"));
const crypto_1 = __importDefault(require("crypto"));
/* ========================================
   GENERATE REFERRAL CODE
======================================== */
const generateReferralCode = () => {
    return ("LP" +
        crypto_1.default
            .randomBytes(3)
            .toString("hex")
            .toUpperCase());
};
/* ========================================
   CREATE REFERRAL
======================================== */
const createReferral = async (req, res) => {
    try {
        const { userId, } = req.body;
        /* VALIDATION */
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }
        /* CHECK USER */
        const user = await prisma_1.default.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        /* CHECK EXISTING REFERRAL */
        const existingReferral = await prisma_1.default.referral.findUnique({
            where: {
                userId,
            },
        });
        if (existingReferral) {
            return res.status(400).json({
                success: false,
                message: "Referral already exists",
            });
        }
        /* GENERATE REFERRAL CODE */
        const referralCode = generateReferralCode();
        /* CREATE REFERRAL */
        const referral = await prisma_1.default.referral.create({
            data: {
                userId,
                referralCode,
                rewardAmount: 0,
                totalReferrals: 0,
            },
        });
        /* CREATE NOTIFICATION */
        await prisma_1.default.notification.create({
            data: {
                userId,
                title: "Referral Activated",
                message: "Your referral account has been created successfully.",
                type: "referral",
            },
        });
        return res.status(201).json({
            success: true,
            message: "Referral created successfully",
            referral,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create referral",
        });
    }
};
exports.createReferral = createReferral;
/* ========================================
   GET REFERRAL
======================================== */
const getReferral = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }
        const referral = await prisma_1.default.referral.findUnique({
            where: {
                userId,
            },
            include: {
                referralHistory: {
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
        });
        if (!referral) {
            return res.status(404).json({
                success: false,
                message: "Referral not found",
            });
        }
        return res.status(200).json({
            success: true,
            referral,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch referral",
        });
    }
};
exports.getReferral = getReferral;
/* ========================================
   APPLY REFERRAL CODE
======================================== */
const applyReferralCode = async (req, res) => {
    try {
        const { userId, referralCode, } = req.body;
        /* VALIDATION */
        if (!userId ||
            !referralCode) {
            return res.status(400).json({
                success: false,
                message: "User ID and referral code are required",
            });
        }
        /* FIND REFERRAL */
        const referral = await prisma_1.default.referral.findUnique({
            where: {
                referralCode,
            },
        });
        if (!referral) {
            return res.status(404).json({
                success: false,
                message: "Invalid referral code",
            });
        }
        /* UPDATE REFERRAL */
        await prisma_1.default.referral.update({
            where: {
                id: referral.id,
            },
            data: {
                totalReferrals: {
                    increment: 1,
                },
                rewardAmount: {
                    increment: 100,
                },
            },
        });
        /* CREATE REFERRAL HISTORY */
        await prisma_1.default.referralHistory.create({
            data: {
                referralId: referral.id,
                referredUserId: userId,
                rewardAmount: 100,
            },
        });
        /* UPDATE WALLET */
        const wallet = await prisma_1.default.wallet.findUnique({
            where: {
                userId: referral.userId,
            },
        });
        if (wallet) {
            await prisma_1.default.wallet.update({
                where: {
                    id: wallet.id,
                },
                data: {
                    balance: {
                        increment: 100,
                    },
                },
            });
        }
        /* CREATE TRANSACTION */
        if (wallet) {
            await prisma_1.default.transaction.create({
                data: {
                    walletId: wallet.id,
                    type: "credit",
                    amount: 100,
                    description: "Referral Bonus",
                    paymentMethod: "Referral",
                    status: "success",
                    transactionId: `REF${Date.now()}`,
                },
            });
        }
        /* CREATE NOTIFICATION */
        await prisma_1.default.notification.create({
            data: {
                userId: referral.userId,
                title: "Referral Reward Earned",
                message: "You earned ₹100 referral reward.",
                type: "referral",
            },
        });
        return res.status(200).json({
            success: true,
            message: "Referral code applied successfully",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to apply referral code",
        });
    }
};
exports.applyReferralCode = applyReferralCode;
