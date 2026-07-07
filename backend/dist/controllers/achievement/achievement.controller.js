"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAchievements = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
const getAchievements = async (req, res) => {
    try {
        const { userId } = req.params;
        const achievements = await prisma_1.default.achievement.findMany({
            where: userId ? { userId } : {},
            orderBy: {
                createdAt: "desc",
            },
        });
        const totalAchievements = achievements.length;
        const totalRewards = achievements.reduce((sum, achievement) => sum + Number(achievement.reward ?? 0), 0);
        const latestAchievement = achievements[0] ?? null;
        res.status(200).json({
            success: true,
            message: "Achievements fetched successfully",
            data: {
                totalAchievements,
                totalRewards,
                latestAchievement,
                achievements,
            },
        });
    }
    catch (error) {
        console.error("[ACHIEVEMENT_FETCH_ERROR]", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch achievements",
        });
    }
};
exports.getAchievements = getAchievements;
