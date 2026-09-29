import { Request, Response } from "express";
import prisma from "../../prisma/prisma";

/* ==========================================
   GET ALL LOGIN HISTORY
========================================== */

export const getAllLoginHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);

    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      prisma.loginHistory.findMany({
        skip,
        take: limit,
        orderBy: {
          loginTime: "desc",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phoneNo: true,
              role: true,
            },
          },
        },
      }),

      prisma.loginHistory.count(),
    ]);

    res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      records,
    });
  } catch (error: any) {
    console.error("GET LOGIN HISTORY ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch login history",
      error: error?.message,
    });
  }
};

/* ==========================================
   GET USER LOGIN HISTORY
========================================== */

export const getUserLoginHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = String(req.params.userId);

    const history = await prisma.loginHistory.findMany({
      where: {
        userId,
      },
      orderBy: {
        loginTime: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error: any) {
    console.error("USER LOGIN HISTORY ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch user login history",
      error: error?.message,
    });
  }
};

/* ==========================================
   LOGOUT SESSION
========================================== */

export const logoutSession = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = String(req.params.id);

    const session = await prisma.loginHistory.update({
      where: {
        id,
      },
      data: {
        logoutTime: new Date(),
        isActive: false,
        status: "LOGOUT",
      },
    });

    res.status(200).json({
      success: true,
      message: "Session logged out successfully",
      data: session,
    });
  } catch (error: any) {
    console.error("LOGOUT SESSION ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to logout session",
      error: error?.message,
    });
  }
};

/* ==========================================
   ACTIVE SESSIONS
========================================== */

export const getActiveSessions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const sessions = await prisma.loginHistory.findMany({
      where: {
        isActive: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        loginTime: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions,
    });
  } catch (error: any) {
    console.error("ACTIVE SESSION ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch active sessions",
      error: error?.message,
    });
  }
};

/* ==========================================
   LOGIN ANALYTICS
========================================== */

export const loginAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const [
      totalLogins,
      successLogins,
      failedLogins,
      activeSessions,
    ] = await Promise.all([
      prisma.loginHistory.count(),

      prisma.loginHistory.count({
        where: {
          status: "SUCCESS",
        },
      }),

      prisma.loginHistory.count({
        where: {
          status: "FAILED",
        },
      }),

      prisma.loginHistory.count({
        where: {
          isActive: true,
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      analytics: {
        totalLogins,
        successLogins,
        failedLogins,
        activeSessions,
        successRate:
          totalLogins > 0
            ? Number(
                ((successLogins / totalLogins) * 100).toFixed(2)
              )
            : 0,
      },
    });
  } catch (error: any) {
    console.error("LOGIN ANALYTICS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch login analytics",
      error: error?.message,
    });
  }
};

/* ==========================================
   DELETE LOGIN HISTORY
========================================== */

export const deleteLoginHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = String(req.params.id);

    await prisma.loginHistory.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Login history deleted successfully",
    });
  } catch (error: any) {
    console.error("DELETE LOGIN HISTORY ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete login history",
      error: error?.message,
    });
  }
};