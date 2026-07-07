"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma"));
const adminMiddleware = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isBlocked: true,
            },
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        if (user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin access required",
            });
        }
        req.admin = user;
        next();
    }
    catch (error) {
        console.error("Admin Middleware Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
exports.adminMiddleware = adminMiddleware;
exports.default = exports.adminMiddleware;
