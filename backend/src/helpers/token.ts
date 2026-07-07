// src/helpers/token.ts

import jwt from "jsonwebtoken";

interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

/* ========================================
   ACCESS TOKEN
======================================== */

export const generateAccessToken = (
  payload: TokenPayload
): string => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1d",
    }
  );
};

/* ========================================
   REFRESH TOKEN
======================================== */

export const generateRefreshToken = (
  payload: TokenPayload
): string => {
  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET as string,
    {
      expiresIn: "7d",
    }
  );
};

/* ========================================
   VERIFY ACCESS TOKEN
======================================== */

export const verifyAccessToken = (
  token: string
) => {
  return jwt.verify(
    token,
    process.env.JWT_SECRET as string
  );
};

/* ========================================
   VERIFY REFRESH TOKEN
======================================== */

export const verifyRefreshToken = (
  token: string
) => {
  return jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET as string
  );
};