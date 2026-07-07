import { Request, Response } from "express";
import prisma from "../../config/prisma";

/**
 * GET ACTIVE SESSIONS
 */
export const getActiveSessions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const sessions =
      await prisma.session.findMany({
        where: {
          isActive: true,
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
        orderBy: {
          loginAt: "desc",
        },
      });

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions,
    });

  } catch {

    res.status(500).json({
      success: false,
      message: "Failed to fetch sessions",
    });

  }
};

/**
 * GET USER SESSIONS
 */
export const getUserSessions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const sessions =
      await prisma.session.findMany({
        where: {
          userId: req.params.userId,
        },
        orderBy: {
          loginAt: "desc",
        },
      });

    res.status(200).json({
      success: true,
      data: sessions,
    });

  } catch {

    res.status(500).json({
      success: false,
      message: "Failed",
    });

  }
};

/**
 * FORCE LOGOUT SESSION
 */
export const forceLogoutSession = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const session =
      await prisma.session.update({
        where: {
          id: req.params.id,
        },
        data: {
          isActive: false,
          logoutAt: new Date(),
        },
      });

    res.status(200).json({
      success: true,
      message: "Session terminated",
      data: session,
    });

  } catch {

    res.status(500).json({
      success: false,
      message: "Failed",
    });

  }
};

/**
 * FORCE LOGOUT ALL USER SESSIONS
 */
export const logoutAllUserSessions =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const userId =
        req.params.userId;

      const result =
        await prisma.session.updateMany({
          where: {
            userId,
            isActive: true,
          },
          data: {
            isActive: false,
            logoutAt: new Date(),
          },
        });

      res.status(200).json({
        success: true,
        affected: result.count,
      });

    } catch {

      res.status(500).json({
        success: false,
        message: "Operation failed",
      });

    }
  };

/**
 * SESSION ANALYTICS
 */
export const sessionAnalytics =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const [
        totalSessions,
        activeSessions,
        inactiveSessions,
      ] = await Promise.all([

        prisma.session.count(),

        prisma.session.count({
          where: {
            isActive: true,
          },
        }),

        prisma.session.count({
          where: {
            isActive: false,
          },
        }),
      ]);

      res.status(200).json({
        success: true,
        data: {
          totalSessions,
          activeSessions,
          inactiveSessions,
        },
      });

    } catch {

      res.status(500).json({
        success: false,
        message: "Analytics failed",
      });

    }
  };

/**
 * DELETE EXPIRED SESSIONS
 */
export const cleanupExpiredSessions =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const result =
        await prisma.session.deleteMany({
          where: {
            expiresAt: {
              lt: new Date(),
            },
          },
        });

      res.status(200).json({
        success: true,
        deleted: result.count,
      });

    } catch {

      res.status(500).json({
        success: false,
        message: "Cleanup failed",
      });

    }
  };