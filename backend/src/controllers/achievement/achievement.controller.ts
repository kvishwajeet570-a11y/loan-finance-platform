import { Request, Response } from "express";
import prisma from "../../prisma/prisma";
import { ReferralService } from "../../services/referral/referral.service";

export const getAchievements = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Authenticated user not found",
      });
      return;
    }

    // Only initialize referral setup for regular customer accounts.
    // Never create or alter referral records for DSA/admin accounts here.
    let referral = await prisma.referral.findUnique({
      where: { userId },
      select: {
        referralCode: true,
        referralLink: true,
        totalReferrals: true,
        successfulReferrals: true,
        pendingReferrals: true,
        totalEarnings: true,
      },
    });

    if (!referral && user.role.toLowerCase() === "user") {
      await ReferralService.createReferralProgram({
        userId,
        source: "CUSTOMER",
      });

      referral = await prisma.referral.findUnique({
        where: { userId },
        select: {
        referralCode: true,
        referralLink: true,
        totalReferrals: true,
          successfulReferrals: true,
          pendingReferrals: true,
          totalEarnings: true,
        },
      });
    }

    const achievements = await prisma.achievement.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    const totalRewards = achievements.reduce(
      (sum, achievement) => sum + Number(achievement.reward ?? 0),
      0
    );

    res.status(200).json({
      success: true,
      message: "Achievements fetched successfully",
      data: {
        achievements,
        totalAchievements: achievements.length,
        totalRewards,
        latestAchievement: achievements[0] ?? null,
        referralCode: referral?.referralCode ?? null,
        referralLink: referral?.referralLink ?? null,
        totalReferrals: referral?.totalReferrals ?? 0,
        successfulReferrals: referral?.successfulReferrals ?? 0,
        pendingReferrals: referral?.pendingReferrals ?? 0,
        totalEarnings: Number(referral?.totalEarnings ?? 0),
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


