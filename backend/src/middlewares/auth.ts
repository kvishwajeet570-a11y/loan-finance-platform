import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { isActiveAuthSession } from "./sessionAuth";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Token required",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as jwt.JwtPayload;

    if (
      typeof decoded.id !== "string" ||
      !(await isActiveAuthSession(decoded.id, decoded.sid))
    ) {
      return res.status(401).json({
        success: false,
        message: "Session expired or revoked. Please login again.",
      });
    }

    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export const optionalAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as jwt.JwtPayload;

    if (
      typeof decoded.id !== "string" ||
      !(await isActiveAuthSession(decoded.id, decoded.sid))
    ) {
      return res.status(401).json({
        success: false,
        message: "Session expired or revoked",
      });
    }

    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;
