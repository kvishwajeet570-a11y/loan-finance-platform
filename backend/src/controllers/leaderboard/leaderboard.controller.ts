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

export const getDsaLeaderboard =
  getOverallLeaderboard;

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

export const getAchievementLeaderboard =
  getOverallLeaderboard;

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