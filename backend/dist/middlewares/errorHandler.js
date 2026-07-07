"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    console.error("ERROR:", {
        message: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
        code: err.code,
    });
    // Prisma Unique Constraint
    if (err.code === "P2002") {
        return res.status(409).json({
            success: false,
            message: "Record already exists",
        });
    }
    // Prisma Record Not Found
    if (err.code === "P2025") {
        return res.status(404).json({
            success: false,
            message: "Record not found",
        });
    }
    // JWT Errors
    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
            success: false,
            message: "Invalid token",
        });
    }
    if (err.name === "TokenExpiredError") {
        return res.status(401).json({
            success: false,
            message: "Token expired",
        });
    }
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        ...(process.env.NODE_ENV === "development" && {
            stack: err.stack,
        }),
    });
};
exports.default = errorHandler;
