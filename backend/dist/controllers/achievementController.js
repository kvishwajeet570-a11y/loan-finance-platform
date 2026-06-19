"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAchievements = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma"));
/* ========================================
   GET ACHIEVEMENTS
======================================== */
const getAchievements = async (req, res) => {
    try {
        /* ========================================
           GET USER ID
        ======================================== */
        const userId = req.params.userId;
        /* ========================================
           FETCH ACHIEVEMENTS
        ======================================== */
        const achievements = await prisma_1.default.achievement.findMany({
            where: userId
                ? {
                    userId,
                }
                : undefined,
            orderBy: {
                createdAt: "desc",
            },
        });
        /* ========================================
           TOTAL REWARDS
        ======================================== */
        const totalRewards = achievements.reduce((acc, item) => acc + item.reward, 0);
        /* ========================================
           TOTAL ACHIEVEMENTS
        ======================================== */
        const totalAchievements = achievements.length;
        /* ========================================
           RESPONSE
        ======================================== */
        return res.status(200).json({
            success: true,
            totalAchievements,
            totalRewards,
            achievements,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch achievements",
        });
    }
};
exports.getAchievements = getAchievements;
