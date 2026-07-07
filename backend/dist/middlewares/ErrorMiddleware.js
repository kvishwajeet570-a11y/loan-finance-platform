"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorMiddleware = (error, req, res, next) => {
    console.error("ERROR:", error);
    // Prisma Validation Error
    if (error instanceof client_1.Prisma.PrismaClientValidationError) {
        return res.status(400).json({
            success: false,
            message: "Invalid data provided",
        });
    }
    // Prisma Unique Constraint
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002") {
        return res.status(409).json({
            success: false,
            message: "Duplicate record already exists",
        });
    }
    // Prisma Record Not Found
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025") {
        return res.status(404).json({
            success: false,
            message: "Record not found",
        });
    }
    // JWT Error
    if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
        return res.status(401).json({
            success: false,
            message: "Invalid token",
        });
    }
    // Token Expired
    if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
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
exports.default = errorMiddleware;
