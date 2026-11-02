import { createHash, randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import prisma from "../../prisma/prisma";

const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

export async function createLoginSecurityRecords(
  user: { id: string; email: string; role: string },
  req: {
    ip?: string;
    socket?: { remoteAddress?: string };
    headers: { "user-agent"?: string };
  }
) {
  const refreshSecret = process.env.JWT_REFRESH_SECRET;

  if (!refreshSecret) {
    throw new Error("JWT_REFRESH_SECRET is not configured");
  }

  const refreshToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      jti: randomUUID(),
    },
    refreshSecret,
    { expiresIn: "7d" }
  );

  const tokenHash = hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const ipAddress =
    req.ip || req.socket?.remoteAddress || "unknown";
  const userAgent = req.headers["user-agent"] || "unknown";

  const result = await prisma.$transaction(async (tx) => {
    const refreshRecord = await tx.refreshToken.create({
      data: {
        userId: user.id,
        token: tokenHash,
        ipAddress,
        userAgent,
        expiresAt,
      },
    });

    const session = await tx.session.create({
      data: {
        userId: user.id,
        token: tokenHash,
        ipAddress,
        userAgent,
        isActive: true,
        expiresAt,
      },
    });

    await tx.loginHistory.create({
      data: {
        userId: user.id,
        ipAddress,
        userAgent,
        loginMethod: "PASSWORD",
        status: "SUCCESS",
        isActive: true,
        sessionId: session.id,
      },
    });

    await tx.securityLog.create({
      data: {
        userId: user.id,
        action: "LOGIN_SUCCESS",
        severity: "LOW",
        status: "SUCCESS",
        module: "AUTH",
        description: "User logged in successfully",
        ipAddress,
        userAgent,
        deviceInfo: userAgent,
        metadata: {
          sessionId: session.id,
          refreshTokenId: refreshRecord.id,
          loginMethod: "PASSWORD",
        },
      },
    });

    return { sessionId: session.id };
  });

  return {
    refreshToken,
    sessionId: result.sessionId,
  };
}
