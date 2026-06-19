"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../prisma/prisma"));
const adminMiddleware = async (req, res, next) => {
    try {
        const user = await prisma_1.default.user.findUnique({
            where: {
                id: req.userId,
            },
        });
        if (!user ||
            user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin Access Only",
            });
        }
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Middleware Error",
        });
    }
};
exports.default = adminMiddleware;
