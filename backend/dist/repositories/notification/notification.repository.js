"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepository = void 0;
const prisma_1 = require("../../prisma/prisma");
class NotificationRepository {
    /* =========================
        CREATE NOTIFICATION
    ========================= */
    static async createNotification(data) {
        return prisma_1.prisma.notification.create({
            data
        });
    }
    /* =========================
        BULK CREATE
    ========================= */
    static async createBulkNotifications(notifications) {
        return prisma_1.prisma.notification.createMany({
            data: notifications
        });
    }
    /* =========================
        GET BY ID
    ========================= */
    static async getNotificationById(id) {
        return prisma_1.prisma.notification.findUnique({
            where: { id }
        });
    }
    /* =========================
        USER NOTIFICATIONS
    ========================= */
    static async getUserNotifications(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        return prisma_1.prisma.notification.findMany({
            where: {
                userId
            },
            skip,
            take: limit,
            orderBy: {
                createdAt: "desc"
            }
        });
    }
    /* =========================
        UNREAD NOTIFICATIONS
    ========================= */
    static async getUnreadNotifications(userId) {
        return prisma_1.prisma.notification.findMany({
            where: {
                userId,
                isRead: false
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    }
    /* =========================
        MARK AS READ
    ========================= */
    static async markAsRead(id) {
        return prisma_1.prisma.notification.update({
            where: {
                id
            },
            data: {
                isRead: true
            }
        });
    }
    /* =========================
        MARK ALL AS READ
    ========================= */
    static async markAllAsRead(userId) {
        return prisma_1.prisma.notification.updateMany({
            where: {
                userId,
                isRead: false
            },
            data: {
                isRead: true
            }
        });
    }
    /* =========================
        DELETE NOTIFICATION
    ========================= */
    static async deleteNotification(id) {
        return prisma_1.prisma.notification.delete({
            where: { id }
        });
    }
    /* =========================
        DELETE USER NOTIFICATIONS
    ========================= */
    static async deleteAllUserNotifications(userId) {
        return prisma_1.prisma.notification.deleteMany({
            where: {
                userId
            }
        });
    }
    /* =========================
        SEARCH NOTIFICATIONS
    ========================= */
    static async searchNotifications(keyword) {
        return prisma_1.prisma.notification.findMany({
            where: {
                OR: [
                    {
                        title: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    },
                    {
                        message: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    }
                ]
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    }
    /* =========================
        GET BY TYPE
    ========================= */
    static async getByType(type) {
        return prisma_1.prisma.notification.findMany({
            where: {
                type
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    }
    /* =========================
        GET ALL
    ========================= */
    static async getAllNotifications(page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const [notifications, total] = await Promise.all([
            prisma_1.prisma.notification.findMany({
                skip,
                take: limit,
                include: {
                    user: true
                },
                orderBy: {
                    createdAt: "desc"
                }
            }),
            prisma_1.prisma.notification.count()
        ]);
        return {
            notifications,
            total,
            page,
            limit
        };
    }
    /* =========================
        NOTIFICATION ANALYTICS
    ========================= */
    static async getAnalytics() {
        const [total, read, unread] = await Promise.all([
            prisma_1.prisma.notification.count(),
            prisma_1.prisma.notification.count({
                where: {
                    isRead: true
                }
            }),
            prisma_1.prisma.notification.count({
                where: {
                    isRead: false
                }
            })
        ]);
        return {
            total,
            read,
            unread
        };
    }
    /* =========================
        RECENT NOTIFICATIONS
    ========================= */
    static async getRecentNotifications(limit = 10) {
        return prisma_1.prisma.notification.findMany({
            take: limit,
            include: {
                user: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    }
    /* =========================
        UNREAD COUNT
    ========================= */
    static async getUnreadCount(userId) {
        return prisma_1.prisma.notification.count({
            where: {
                userId,
                isRead: false
            }
        });
    }
}
exports.NotificationRepository = NotificationRepository;
