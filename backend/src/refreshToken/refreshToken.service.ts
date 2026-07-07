import jwt from "jsonwebtoken";
import { prisma } from "../prisma/prisma";

interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export class RefreshTokenService {

  static async generateRefreshToken(
    payload: TokenPayload
  ) {
    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    return refreshToken;
  }

  static async verifyRefreshToken(
    refreshToken: string
  ) {

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as TokenPayload;

    return decoded;
  }

  static async generateAccessToken(
    payload: TokenPayload
  ) {
    return jwt.sign(
      payload,
      process.env.JWT_ACCESS_SECRET!,
      {
        expiresIn: "15m",
      }
    );
  }

  static async refreshAccessToken(
    refreshToken: string
  ) {

    const payload =
      await this.verifyRefreshToken(
        refreshToken
      );

    const user =
      await prisma.user.findUnique({
        where: {
          id: payload.id,
        },
      });

    if (!user) {
      throw new Error(
        "User not found"
      );
    }

    if (user.isBlocked) {
      throw new Error(
        "Account blocked"
      );
    }

    const accessToken =
      await this.generateAccessToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

    return {
      accessToken,
    };
  }
}