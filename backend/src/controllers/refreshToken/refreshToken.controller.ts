import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { createHash } from "crypto";
import prisma from "../../prisma/prisma";

const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

const getUserId = (req: Request): string | null => {
  const id = (req as any).user?.id;
  return typeof id === "string" && id.length > 0 ? id : null;
};

/**
 * Generate a new access token using a valid refresh token.
 */
export const refreshAccessToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    const refreshSecret = process.env.JWT_REFRESH_SECRET;
    const accessSecret = process.env.JWT_SECRET;

    if (!refreshToken || !refreshSecret || !accessSecret) {
      res.status(400).json({
        success: false,
        message: "Refresh token or token configuration missing",
      });
      return;
    }

    let payload: any;

    try {
      payload = jwt.verify(refreshToken, refreshSecret);
    } catch {
      res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
      return;
    }

    if (!payload?.id) {
      res.status(401).json({
        success: false,
        message: "Invalid refresh token payload",
      });
      return;
    }

    const tokenHash = hashToken(refreshToken);

    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: tokenHash },
      include: { user: true },
    });

    if (
      !tokenRecord ||
      tokenRecord.isRevoked ||
      tokenRecord.userId !== payload.id ||
      tokenRecord.expiresAt <= new Date() ||
      tokenRecord.user.isBlocked
    ) {
      res.status(401).json({
        success: false,
        message: "Refresh token is no longer active",
      });
      return;
    }

    const session = await prisma.session.findUnique({
      where: { token: tokenHash },
    });

    if (!session || !session.isActive || session.expiresAt <= new Date()) {
      res.status(401).json({
        success: false,
        message: "Session is no longer active",
      });
      return;
    }

    const accessToken = jwt.sign(
      {
        id: tokenRecord.user.id,
        email: tokenRecord.user.email,
        role: tokenRecord.user.role,
        sid: session.id,
      },
      accessSecret,
      { expiresIn: "7d" }
    );

    await prisma.securityLog.create({
      data: {
        userId: tokenRecord.userId,
        action: "TOKEN_REFRESH",
        severity: "LOW",
        status: "SUCCESS",
        module: "AUTH",
        description: "Access token refreshed successfully",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      },
    });

    res.status(200).json({
      success: true,
      accessToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({
      success: false,
      message: "Token refresh failed",
    });
  }
};

/**
 * Logout current device using tokenId.
 */
export const revokeRefreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = getUserId(req);
    const { tokenId } = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    if (!tokenId) {
      res.status(400).json({
        success: false,
        message: "Token ID required",
      });
      return;
    }

    const record = await prisma.refreshToken.findFirst({
      where: {
        id: tokenId,
        userId,
        isRevoked: false,
      },
    });

    if (!record) {
      res.status(404).json({
        success: false,
        message: "Active token not found",
      });
      return;
    }

    const now = new Date();

    await prisma.$transaction(async (tx) => {
      await tx.refreshToken.update({
        where: { id: record.id },
        data: { isRevoked: true },
      });

      const session = await tx.session.findUnique({
        where: { token: record.token },
      });

      if (session) {
        await tx.session.update({
          where: { id: session.id },
          data: { isActive: false, logoutAt: now },
        });

        await tx.loginHistory.updateMany({
          where: {
            sessionId: session.id,
            isActive: true,
          },
          data: {
            isActive: false,
            logoutTime: now,
          },
        });
      }

      await tx.securityLog.create({
        data: {
          userId,
          action: "LOGOUT",
          severity: "LOW",
          status: "SUCCESS",
          module: "AUTH",
          description: "User logged out from a device",
          ipAddress: req.ip,
          userAgent: req.headers["user-agent"],
          metadata: { tokenId: record.id },
        },
      });
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};

/**
 * Logout all devices.
 */
export const revokeAllTokens = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const now = new Date();

    await prisma.$transaction(async (tx) => {
      await tx.refreshToken.updateMany({
        where: { userId, isRevoked: false },
        data: { isRevoked: true },
      });

      await tx.session.updateMany({
        where: { userId, isActive: true },
        data: { isActive: false, logoutAt: now },
      });

      await tx.loginHistory.updateMany({
        where: { userId, isActive: true },
        data: { isActive: false, logoutTime: now },
      });

      await tx.securityLog.create({
        data: {
          userId,
          action: "LOGOUT_ALL",
          severity: "MEDIUM",
          status: "SUCCESS",
          module: "AUTH",
          description: "All user refresh tokens and sessions revoked",
          ipAddress: req.ip,
          userAgent: req.headers["user-agent"],
        },
      });
    });

    res.status(200).json({
      success: true,
      message: "All refresh tokens and sessions terminated",
    });
  } catch (error) {
    console.error("Logout all error:", error);
    res.status(500).json({
      success: false,
      message: "Operation failed",
    });
  }
};

/**
 * Get active sessions without exposing token hashes.
 */
export const getActiveSessions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const sessions = await prisma.refreshToken.findMany({
      where: {
        userId,
        isRevoked: false,
        expiresAt: { gt: new Date() },
      },
      select: {
        id: true,
        deviceId: true,
        deviceType: true,
        deviceName: true,
        ipAddress: true,
        userAgent: true,
        createdAt: true,
        expiresAt: true,
        isRevoked: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    console.error("Active sessions error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sessions",
    });
  }
};

/**
 * Refresh token analytics.
 */
export const refreshTokenAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const [
      totalTokens,
      activeTokens,
      revokedTokens,
      expiredTokens,
    ] = await Promise.all([
      prisma.refreshToken.count(),
      prisma.refreshToken.count({
        where: {
          isRevoked: false,
          expiresAt: { gt: new Date() },
        },
      }),
      prisma.refreshToken.count({
        where: { isRevoked: true },
      }),
      prisma.refreshToken.count({
        where: {
          isRevoked: false,
          expiresAt: { lte: new Date() },
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalTokens,
        activeTokens,
        revokedTokens,
        expiredTokens,
      },
    });
  } catch (error) {
    console.error("Refresh analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Analytics failed",
    });
  }
};

