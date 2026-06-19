"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReferralReward = exports.getReferralService = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma"));
/* ========================================
   GET REFERRAL
======================================== */
const getReferralService = async (userId) => {
    return await prisma_1.default.referral.findUnique({
        where: {
            userId,
        },
        include: {
            referralHistory: true,
        },
    });
};
exports.getReferralService = getReferralService;
/* ========================================
   UPDATE REFERRAL REWARD
======================================== */
const updateReferralReward = async (userId, amount) => {
    return await prisma_1.default.referral.update({
        where: {
            userId,
        },
        data: {
            rewardAmount: {
                increment: amount,
            },
            totalEarnings: {
                increment: amount,
            },
        },
    });
};
exports.updateReferralReward = updateReferralReward;
