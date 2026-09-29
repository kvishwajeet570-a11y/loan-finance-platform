import { Request, Response } from "express";
import prisma from "../../prisma/prisma";
import { Prisma } from "@prisma/client";

export const getAchievements = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.userId
      ? String(req.params.userId)
      : undefined;

    const query: Prisma.AchievementFindManyArgs = {
      orderBy: {
        createdAt: "desc",
      },
    };

    if (userId) {
      query.where = {
        userId,
      };
    }

    const achievements = await prisma.achievement.findMany(query);

    const totalAchievements = achievements.length;

    const totalRewards = achievements.reduce(
      (sum, achievement) => sum + Number(achievement.reward ?? 0),
      0
    );

    const latestAchievement =
      achievements.length > 0 ? achievements[0] : null;

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
  } catch (error) {
    console.error("[ACHIEVEMENT_FETCH_ERROR]", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch achievements",
    });
  }
};