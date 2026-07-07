import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";

const errorMiddleware = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("ERROR:", error);

  // Prisma Validation Error
  if (error instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      success: false,
      message: "Invalid data provided",
    });
  }

  // Prisma Unique Constraint
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    return res.status(409).json({
      success: false,
      message: "Duplicate record already exists",
    });
  }

  // Prisma Record Not Found
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  ) {
    return res.status(404).json({
      success: false,
      message: "Record not found",
    });
  }

  // JWT Error
  if (error instanceof jwt.JsonWebTokenError) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  // Token Expired
  if (error instanceof jwt.TokenExpiredError) {
    return res.status(401).json({
      success: false,
      message: "Token expired",
    });
  }

  // Default Error
  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && {
      stack: error.stack,
    }),
  });
};

export default errorMiddleware;