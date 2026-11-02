import { Request, Response } from "express";
import prisma from "../../prisma/prisma";

/* ========================================
   BASE LEADERBOARD LOGIC
======================================== */

const buildLeaderboard = async () => {
  const loans = await prisma.loanApplication.findMany({
    where: {
      status: "APPROVED",
    },
    include: {
      user: true,
    },
  });

  const groupedUsers: Record<string, any> = {};

  loans.forEach((loan) => {
    const userName =
      loan.user?.name ||
      loan.fullName ||
      "Unknown User";

    if (groupedUsers[userName]) {
      groupedUsers[userName].totalAmount += loan.amount;
      groupedUsers[userName].totalLoans += 1;
    } else {
      groupedUsers[userName] = {
        name: userName,
        totalAmount: loan.amount,
        totalLoans: 1,
      };
    }
  });

  return Object.values(groupedUsers)
    .map((user: any) => ({
      ...user,
      commission: Math.round(user.totalAmount * 0.02),
    }))
    .sort(
      (a: any, b: any) =>
        b.totalAmount - a.totalAmount
    );
};

/* ========================================
   MAIN
======================================== */

export const getOverallLeaderboard = async (
  req: Request,
  res: Response
) => {
  try {
    const leaderboard = await buildLeaderboard();

    return res.status(200).json({
      success: true,
      data: leaderboard,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch leaderboard",
      error,
    });
  }
};

/* ========================================
   USER LEADERBOARDS
======================================== */

export const getCustomerLeaderboard =
  getOverallLeaderboard;

export const getDsaLeaderboard = async (
  req: Request,
  res: Response
) => {
  try {
    const dsas = await prisma.user.findMany({
      where: {
        role: { in: ["DSA", "dsa"] },
        isDeleted: false,
        isBlocked: false,
      },
      select: {
        id: true,
        name: true,
        state: true,
      },
    });

    const ids = dsas.map((dsa) => dsa.id);

    const [commissions, loans, referrals] = await Promise.all([
      ids.length
        ? prisma.commission.findMany({
            where: {
              userId: { in: ids },
              status: "APPROVED",
            },
            select: {
              userId: true,
              commissionAmount: true,
            },
          })
        : Promise.resolve([]),

      ids.length
        ? prisma.loanApplication.findMany({
            where: {
              assignedTo: { in: ids },
              status: "APPROVED",
            },
            select: {
              assignedTo: true,
            },
          })
        : Promise.resolve([]),

      ids.length
        ? prisma.referral.findMany({
            where: {
              userId: { in: ids },
            },
            select: {
              userId: true,
              totalReferrals: true,
              successfulReferrals: true,
              totalEarnings: true,
            },
          })
        : Promise.resolve([]),
    ]);

    const rows = dsas.map((dsa) => {
      const ownCommissions = commissions.filter(
        (item) => item.userId === dsa.id
      );

      const ownLoans = loans.filter(
        (item) => item.assignedTo === dsa.id
      );

      const ownReferral = referrals.find(
        (item) => item.userId === dsa.id
      );

      return {
        userId: dsa.id,
        name: dsa.name || "DSA Partner",
        state: dsa.state || "—",
        totalReferrals: ownReferral?.totalReferrals ?? 0,
        successfulReferrals: ownReferral?.successfulReferrals ?? 0,
        approvedLoans: ownLoans.length,
        totalEarnings: ownCommissions.reduce(
          (sum, item) => sum + Number(item.commissionAmount || 0),
          0
        ),
        commissionCount: ownCommissions.length,
        referralEarnings: Number(ownReferral?.totalEarnings ?? 0),
      };
    });

    rows.sort(
      (a, b) =>
        b.totalEarnings - a.totalEarnings ||
        b.approvedLoans - a.approvedLoans ||
        b.successfulReferrals - a.successfulReferrals
    );

    return res.status(200).json({
      success: true,
      currentUserId: (req as any).user?.id ?? null,
      data: rows.map((row, index) => ({
        rank: index + 1,
        ...row,
      })),
    });
  } catch (error) {
    console.error("[DSA_LEADERBOARD_ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch DSA leaderboard",
    });
  }
};

export const getPartnerLeaderboard =
  getOverallLeaderboard;

/* ========================================
   BUSINESS LEADERBOARDS
======================================== */

export const getLoanLeaderboard =
  getOverallLeaderboard;

export const getCommissionLeaderboard =
  getOverallLeaderboard;

export const getReferralLeaderboard =
  getOverallLeaderboard;

export const getInsuranceLeaderboard =
  getOverallLeaderboard;

export const getInvestmentLeaderboard =
  getOverallLeaderboard;

export const getFastagLeaderboard =
  getOverallLeaderboard;

/* ========================================
   TOP PERFORMERS
======================================== */

export const getTopCustomers =
  getOverallLeaderboard;

export const getTopDsa =
  getOverallLeaderboard;

export const getTopPartners =
  getOverallLeaderboard;

/* ========================================
   PERIOD WISE
======================================== */

export const getDailyLeaderboard =
  getOverallLeaderboard;

export const getWeeklyLeaderboard =
  getOverallLeaderboard;

export const getMonthlyLeaderboard =
  getOverallLeaderboard;

export const getYearlyLeaderboard =
  getOverallLeaderboard;

/* ========================================
   FINANCIAL
======================================== */

export const getRevenueLeaderboard =
  getOverallLeaderboard;

export const getWalletLeaderboard =
  getOverallLeaderboard;

/* ========================================
   ACHIEVEMENTS
======================================== */

export const getAchievementLeaderboard = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const dsas = await prisma.user.findMany({
      where: { role: { in: ["DSA", "dsa"] } },
      select: { id: true, name: true },
    });

    const ids = dsas.map((dsa) => dsa.id);

    const achievements = ids.length
      ? await prisma.achievement.findMany({
          where: { userId: { in: ids } },
          select: { userId: true, reward: true },
        })
      : [];

    const leaderboard = dsas
      .map((dsa) => {
        const records = achievements.filter(
          (item) => item.userId === dsa.id
        );

        return {
          userId: dsa.id,
          name: dsa.name || "DSA Partner",
          totalAchievements: records.length,
          totalRewards: records.reduce(
            (sum, item) => sum + Number(item.reward ?? 0),
            0
          ),
        };
      })
      .filter((dsa) => dsa.totalAchievements > 0)
      .sort(
        (a, b) =>
          b.totalAchievements - a.totalAchievements ||
          b.totalRewards - a.totalRewards
      )
      .map((dsa, index) => ({
        rank: index + 1,
        ...dsa,
      }));

    res.status(200).json({ success: true, data: leaderboard });
  } catch (error) {
    console.error("[ACHIEVEMENT_LEADERBOARD_ERROR]", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch achievement leaderboard",
    });
  }
};

/* ========================================
   ANALYTICS
======================================== */

export const getLeaderboardAnalytics =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const leaderboard =
        await buildLeaderboard();

      const totalBusiness =
        leaderboard.reduce(
          (
            acc: number,
            item: any
          ) => acc + item.totalAmount,
          0
        );

      const totalCommission =
        leaderboard.reduce(
          (
            acc: number,
            item: any
          ) => acc + item.commission,
          0
        );

      return res.status(200).json({
        success: true,
        totalUsers:
          leaderboard.length,
        totalBusiness,
        totalCommission,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error,
      });
    }
  };

/* ========================================
   DASHBOARD
======================================== */

export const getLeaderboardDashboard =
  getLeaderboardAnalytics;

/* ========================================
   EXPORTS
======================================== */

export const exportLeaderboardExcel =
  async (
    req: Request,
    res: Response
  ) => {
    return res.json({
      success: true,
      message:
        "Excel export coming soon",
    });
  };

export const exportLeaderboardPdf =
  async (
    req: Request,
    res: Response
  ) => {
    return res.json({
      success: true,
      message:
        "PDF export coming soon",
    });
  };

