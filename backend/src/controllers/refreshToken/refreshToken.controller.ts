import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../../config/prisma";

const ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET!;

const REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET!;

/**
 * GENERATE NEW ACCESS TOKEN
 */
export const refreshAccessToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        message: "Refresh token required",
      });
      return;
    }

    const tokenRecord =
      await prisma.refreshToken.findUnique({
        where: {
          token: refreshToken,
        },
        include: {
          user: true,
        },
      });

    if (
      !tokenRecord ||
      tokenRecord.isRevoked
    ) {
      res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
      return;
    }

    if (
      new Date() >
      tokenRecord.expiresAt
    ) {
      res.status(401).json({
        success: false,
        message: "Refresh token expired",
      });
      return;
    }

    const payload = jwt.verify(
      refreshToken,
      REFRESH_SECRET
    ) as any;

    const accessToken = jwt.sign(
      {
        userId: payload.userId,
        role: payload.role,
      },
      ACCESS_SECRET,
      {
        expiresIn: "15m",
      }
    );

    res.status(200).json({
      success: true,
      accessToken,
    });
  } catch {
    res.status(401).json({
      success: false,
      message: "Token refresh failed",
    });
  }
};

/**
 * LOGOUT CURRENT DEVICE
 */
export const revokeRefreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    await prisma.refreshToken.update({
      where: {
        token: refreshToken,
      },
      data: {
        isRevoked: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};

/**
 * LOGOUT ALL DEVICES
 */
export const revokeAllTokens = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    await prisma.refreshToken.updateMany({
      where: {
        userId,
      },
      data: {
        isRevoked: true,
      },
    });

    res.status(200).json({
      success: true,
      message:
        "All sessions terminated",
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Operation failed",
    });
  }
};

/**
 * GET ACTIVE SESSIONS
 */
export const getActiveSessions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    const sessions =
      await prisma.refreshToken.findMany({
        where: {
          userId,
          isRevoked: false,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    res.status(200).json({
      success: true,
      data: sessions,
    });
  } catch {
    res.status(500).json({
      success: false,
      message:
        "Failed to fetch sessions",
    });
  }
};

/**
 * TOKEN ANALYTICS
 */
export const refreshTokenAnalytics =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const [
        totalTokens,
        activeTokens,
        revokedTokens,
      ] = await Promise.all([
        prisma.refreshToken.count(),

        prisma.refreshToken.count({
          where: {
            isRevoked: false,
          },
        }),

        prisma.refreshToken.count({
          where: {
            isRevoked: true,
          },
        }),
      ]);

      res.status(200).json({
        success: true,
        data: {
          totalTokens,
          activeTokens,
          revokedTokens,
        },
      });
    } catch {
      res.status(500).json({
        success: false,
        message: "Analytics failed",
      });
    }
  };