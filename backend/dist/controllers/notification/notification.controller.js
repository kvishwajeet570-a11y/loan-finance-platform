"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportNotificationsPdf = exports.exportNotificationsExcel = exports.sendWhatsappNotification = exports.sendPushNotification = exports.sendSmsNotification = exports.sendEmailNotification = exports.bulkArchiveNotifications = exports.getArchivedNotifications = exports.archiveNotification = exports.getNotificationDashboard = exports.getNotificationAnalytics = exports.getRecentNotifications = exports.getReadNotifications = exports.getUnreadNotifications = exports.markAllAsRead = exports.markAsRead = exports.getUserNotifications = exports.bulkDeleteNotifications = exports.deleteNotification = exports.updateNotification = exports.getNotificationById = exports.searchNotifications = exports.getAllNotifications = exports.getNotifications = exports.sendBulkNotification = exports.sendNotification = exports.createNotification = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
/* ========================================
   CREATE NOTIFICATION
======================================== */
const createNotification = async (req, res) => {
    try {
        const { title, message, type, userId, } = req.body;
        const notification = await prisma_1.default.notification.create({
            data: {
                title,
                message,
                type: type || "general",
                userId,
            },
        });
        return res.status(201).json({
            success: true,
            notification,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create notification",
        });
    }
};
exports.createNotification = createNotification;
/* ========================================
   SEND NOTIFICATION
======================================== */
exports.sendNotification = exports.createNotification;
/* ========================================
   SEND BULK NOTIFICATION
======================================== */
const sendBulkNotification = async (req, res) => {
    try {
        const { userIds, title, message, } = req.body;
        await prisma_1.default.notification.createMany({
            data: userIds.map((userId) => ({
                userId,
                title,
                message,
                type: "bulk",
            })),
        });
        return res.status(200).json({
            success: true,
            message: "Bulk notification sent",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
        });
    }
};
exports.sendBulkNotification = sendBulkNotification;
/* ========================================
   GET ALL NOTIFICATIONS
======================================== */
const getNotifications = async (req, res) => {
    try {
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 20);
        const skip = (page - 1) * limit;
        const [notifications, total] = await Promise.all([
            prisma_1.default.notification.findMany({
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.notification.count(),
        ]);
        return res.status(200).json({
            success: true,
            total,
            page,
            pages: Math.ceil(total / limit),
            notifications,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
        });
    }
};
exports.getNotifications = getNotifications;
exports.getAllNotifications = exports.getNotifications;
/* ========================================
   SEARCH NOTIFICATIONS
======================================== */
const searchNotifications = async (req, res) => {
    try {
        const keyword = typeof req.query.keyword ===
            "string"
            ? req.query.keyword
            : "";
        const notifications = await prisma_1.default.notification.findMany({
            where: {
                OR: [
                    {
                        title: {
                            contains: keyword,
                            mode: "insensitive",
                        },
                    },
                    {
                        message: {
                            contains: keyword,
                            mode: "insensitive",
                        },
                    },
                ],
            },
        });
        return res.status(200).json({
            success: true,
            notifications,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
        });
    }
};
exports.searchNotifications = searchNotifications;
/* ========================================
   GET NOTIFICATION BY ID
======================================== */
const getNotificationById = async (req, res) => {
    try {
        const id = String(req.params.id);
        const notification = await prisma_1.default.notification.findUnique({
            where: {
                id: id,
            },
        });
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found",
            });
        }
        return res.status(200).json({
            success: true,
            notification,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
        });
    }
};
exports.getNotificationById = getNotificationById;
/* ========================================
   UPDATE NOTIFICATION
======================================== */
const updateNotification = async (req, res) => {
    try {
        const id = String(req.params.id);
        const notification = await prisma_1.default.notification.update({
            where: {
                id: id,
            },
            data: req.body,
        });
        return res.status(200).json({
            success: true,
            notification,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
        });
    }
};
exports.updateNotification = updateNotification;
/* ========================================
   DELETE NOTIFICATION
======================================== */
const deleteNotification = async (req, res) => {
    try {
        const id = String(req.params.id);
        await prisma_1.default.notification.delete({
            where: {
                id: id,
            },
        });
        return res.status(200).json({
            success: true,
            message: "Notification deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete Notification Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete notification",
        });
    }
};
exports.deleteNotification = deleteNotification;
/* ========================================
   BULK DELETE
======================================== */
const bulkDeleteNotifications = async (req, res) => {
    try {
        const { ids } = req.body;
        await prisma_1.default.notification.deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        });
        return res.status(200).json({
            success: true,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
        });
    }
};
exports.bulkDeleteNotifications = bulkDeleteNotifications;
/* ========================================
   USER NOTIFICATIONS
======================================== */
const getUserNotifications = async (req, res) => {
    try {
        const userId = String(req.params.userId);
        const notifications = await prisma_1.default.notification.findMany({
            where: {
                userId: userId,
            },
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
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch notifications",
        });
    }
};
exports.getUserNotifications = getUserNotifications;
/* ========================================
   MARK AS READ
======================================== */
const markAsRead = async (req, res) => {
    try {
        const id = String(req.params.id);
        const notification = await prisma_1.default.notification.update({
            where: {
                id: id,
            },
            data: {
                isRead: true,
                readAt: new Date(),
            },
        });
        return res.status(200).json({
            success: true,
            notification,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to mark notification as read",
        });
    }
};
exports.markAsRead = markAsRead;
/* ========================================
   MARK ALL AS READ
======================================== */
const markAllAsRead = async (req, res) => {
    try {
        const userId = String(req.params.userId);
        await prisma_1.default.notification.updateMany({
            where: {
                userId: userId,
                isRead: false,
            },
            data: {
                isRead: true,
                readAt: new Date(),
            },
        });
        return res.status(200).json({
            success: true,
            message: "All notifications marked as read",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to mark all notifications as read",
        });
    }
};
exports.markAllAsRead = markAllAsRead;
/* ========================================
   UNREAD
======================================== */
const getUnreadNotifications = async (req, res) => {
    const notifications = await prisma_1.default.notification.findMany({
        where: {
            isRead: false,
        },
    });
    return res.status(200).json({
        success: true,
        notifications,
    });
};
exports.getUnreadNotifications = getUnreadNotifications;
/* ========================================
   READ
======================================== */
const getReadNotifications = async (req, res) => {
    const notifications = await prisma_1.default.notification.findMany({
        where: {
            isRead: true,
        },
    });
    return res.status(200).json({
        success: true,
        notifications,
    });
};
exports.getReadNotifications = getReadNotifications;
/* ========================================
   RECENT
======================================== */
const getRecentNotifications = async (req, res) => {
    const notifications = await prisma_1.default.notification.findMany({
        take: 10,
        orderBy: {
            createdAt: "desc",
        },
    });
    return res.status(200).json({
        success: true,
        notifications,
    });
};
exports.getRecentNotifications = getRecentNotifications;
/* ========================================
   ANALYTICS
======================================== */
const getNotificationAnalytics = async (req, res) => {
    try {
        const [total, read, unread,] = await Promise.all([
            prisma_1.default.notification.count(),
            prisma_1.default.notification.count({
                where: {
                    isRead: true,
                },
            }),
            prisma_1.default.notification.count({
                where: {
                    isRead: false,
                },
            }),
        ]);
        return res.status(200).json({
            success: true,
            total,
            read,
            unread,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
        });
    }
};
exports.getNotificationAnalytics = getNotificationAnalytics;
exports.getNotificationDashboard = exports.getNotificationAnalytics;
/* ========================================
   PLACEHOLDER FUNCTIONS
======================================== */
const archiveNotification = async (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Archive feature requires schema update",
    });
};
exports.archiveNotification = archiveNotification;
const getArchivedNotifications = async (req, res) => {
    return res.status(200).json({
        success: true,
        notifications: [],
    });
};
exports.getArchivedNotifications = getArchivedNotifications;
const bulkArchiveNotifications = async (req, res) => {
    return res.status(200).json({
        success: true,
    });
};
exports.bulkArchiveNotifications = bulkArchiveNotifications;
exports.sendEmailNotification = exports.sendNotification;
exports.sendSmsNotification = exports.sendNotification;
exports.sendPushNotification = exports.sendNotification;
exports.sendWhatsappNotification = exports.sendNotification;
const exportNotificationsExcel = async (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Excel export coming soon",
    });
};
exports.exportNotificationsExcel = exportNotificationsExcel;
const exportNotificationsPdf = async (req, res) => {
    return res.status(200).json({
        success: true,
        message: "PDF export coming soon",
    });
};
exports.exportNotificationsPdf = exportNotificationsPdf;
