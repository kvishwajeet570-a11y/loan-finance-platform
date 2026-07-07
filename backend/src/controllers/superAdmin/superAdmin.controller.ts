import { Request, Response } from "express";
import prisma from "../../config/prisma";

/**
 * DASHBOARD
 */
export const getDashboard =
async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const [
      users,
      loans,
      pendingLoans,
      approvedLoans,
      totalRevenue,
    ] = await Promise.all([

      prisma.user.count(),

      prisma.loanApplication.count(),

      prisma.loanApplication.count({
        where: {
          status: "PENDING",
        },
      }),

      prisma.loanApplication.count({
        where: {
          status: "APPROVED",
        },
      }),

      prisma.payment.aggregate({
        _sum: {
          amount: true,
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        users,
        loans,
        pendingLoans,
        approvedLoans,
        revenue:
          totalRevenue._sum.amount || 0,
      },
    });

  } catch {

    res.status(500).json({
      success: false,
      message: "Dashboard failed",
    });

  }
};

/**
 * SYSTEM OVERVIEW
 */
export const systemOverview =
async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const [
      activeUsers,
      blockedUsers,
      totalDSA,
      totalPartners,
    ] = await Promise.all([

      prisma.user.count({
        where: {
          isBlocked: false,
        },
      }),

      prisma.user.count({
        where: {
          isBlocked: true,
        },
      }),

      prisma.dSA.count(),

      prisma.partner.count(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        activeUsers,
        blockedUsers,
        totalDSA,
        totalPartners,
      },
    });

  } catch {

    res.status(500).json({
      success: false,
      message: "Failed",
    });

  }
};

/**
 * BLOCK USER
 */
export const blockUser =
async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const user =
      await prisma.user.update({
        where: {
          id: req.params.id,
        },
        data: {
          isBlocked: true,
        },
      });

    res.status(200).json({
      success: true,
      data: user,
    });

  } catch {

    res.status(500).json({
      success: false,
    });

  }
};

/**
 * UNBLOCK USER
 */
export const unblockUser =
async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const user =
      await prisma.user.update({
        where: {
          id: req.params.id,
        },
        data: {
          isBlocked: false,
        },
      });

    res.status(200).json({
      success: true,
      data: user,
    });

  } catch {

    res.status(500).json({
      success: false,
    });

  }
};

/**
 * TOGGLE MAINTENANCE MODE
 */
export const toggleMaintenance =
async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const setting =
      await prisma.setting.findUnique({
        where: {
          key: "maintenance_mode",
        },
      });

    const updated =
      await prisma.setting.update({
        where: {
          key: "maintenance_mode",
        },
        data: {
          value: !setting?.value,
        },
      });

    res.status(200).json({
      success: true,
      data: updated,
    });

  } catch {

    res.status(500).json({
      success: false,
    });

  }
};

/**
 * SUPER ADMIN ANALYTICS
 */
export const superAdminAnalytics =
async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const [
      totalUsers,
      totalLoans,
      totalPayments,
      totalSessions,
    ] = await Promise.all([

      prisma.user.count(),

      prisma.loanApplication.count(),

      prisma.payment.count(),

      prisma.session.count(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalLoans,
        totalPayments,
        totalSessions,
      },
    });

  } catch {

    res.status(500).json({
      success: false,
      message: "Analytics failed",
    });

  }
};