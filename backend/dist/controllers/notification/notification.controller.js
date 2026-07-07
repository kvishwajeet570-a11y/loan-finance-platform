"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotifications = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma"));
const getNotifications = async (req, res) => {
    try {
        const notifications = await prisma_1.default.notification.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        return res.status(200).json({
            success: true,
            notifications,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch notifications",
        });
    }
};
exports.getNotifications = getNotifications;
