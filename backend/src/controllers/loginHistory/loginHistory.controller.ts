import { Request, Response } from "express";
import prisma from "../../config/prisma";

export const getAllLoginHistory = async (
  req: Request,
  res: Response
) => {
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
            },
          },
        },
      }),
      prisma.loginHistory.count(),
    ]);

    res.status(200).json({
      success: true,
      total,
      page,
      records,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch login history",
    });
  }
};

export const getUserLoginHistory = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.params.userId;

    const history =
      await prisma.loginHistory.findMany({
        where: { userId },
        orderBy: {
          loginTime: "desc",
        },
      });

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "History fetch failed",
    });
  }
};

export const logoutSession = async (
  req: Request,
  res: Response
) => {
  try {
    const sessionId = req.params.id;

    const session =
      await prisma.loginHistory.update({
        where: { id: sessionId },
        data: {
          logoutTime: new Date(),
        },
      });

    res.status(200).json({
      success: true,
      message: "Session closed",
      data: session,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};

export const loginAnalytics = async (
  req: Request,
  res: Response
) => {
  try {
    const totalLogins =
      await prisma.loginHistory.count();

    const failedLogins =
      await prisma.loginHistory.count({
        where: {
          status: "FAILED",
        },
      });

    const successLogins =
      await prisma.loginHistory.count({
        where: {
          status: "SUCCESS",
        },
      });

    res.status(200).json({
      success: true,
      data: {
        totalLogins,
        successLogins,
        failedLogins,
      },
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Analytics failed",
    });
  }
};