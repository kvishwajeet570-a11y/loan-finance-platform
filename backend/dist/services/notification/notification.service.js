"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class NotificationService {
    /**
     * Create Notification
     */
    async createNotification(data) {
        return prisma_1.default.notification.create({
            data: {
                userId: data.userId,
                title: data.title,
                message: data.message,
                type: data.type || "general",
                isRead: false,
            },
        });
    }
    /**
     * Bulk Notification
     */
    async sendBulkNotification(userIds, title, message) {
        return prisma_1.default.notification.createMany({
            data: userIds.map((userId) => ({
                userId,
                title,
                message,
                type: "bulk",
            })),
        });
    }
    /**
     * Notify All Users
     */
    async notifyAllUsers(title, message) {
        const users = await prisma_1.default.user.findMany({
            select: {
                id: true,
            },
        });
        return prisma_1.default.notification.createMany({
            data: users.map((user) => ({
                userId: user.id,
                title,
                message,
                type: "announcement",
            })),
        });
    }
    /**
     * User Notifications
     */
    async getUserNotifications(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [notifications, total] = await Promise.all([
            prisma_1.default.notification.findMany({
                where: {
                    userId,
                },
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.notification.count({
                where: {
                    userId,
                },
            }),
        ]);
        return {
            notifications,
            total,
            page,
            pages: Math.ceil(total / limit),
        };
    }
    /**
     * Mark Single Notification Read
     */
    async markAsRead(notificationId) {
        return prisma_1.default.notification.update({
            where: {
                id: notificationId,
            },
            data: {
                isRead: true,
                readAt: new Date(),
            },
        });
    }
    /**
     * Mark All Read
     */
    async markAllRead(userId) {
        return prisma_1.default.notification.updateMany({
            where: {
                userId,
                isRead: false,
            },
            data: {
                isRead: true,
                readAt: new Date(),
            },
        });
    }
    /**
     * Delete Notification
     */
    async deleteNotification(notificationId) {
        return prisma_1.default.notification.delete({
            where: {
                id: notificationId,
            },
        });
    }
    /**
     * Delete All Notifications
     */
    async deleteAllNotifications(userId) {
        return prisma_1.default.notification.deleteMany({
            where: {
                userId,
            },
        });
    }
    /**
     * Unread Count
     */
    async getUnreadCount(userId) {
        const count = await prisma_1.default.notification.count({
            where: {
                userId,
                isRead: false,
            },
        });
        return {
            unreadCount: count,
        };
    }
    /**
     * Loan Notification
     */
    async loanNotification(userId, amount, status) {
        return this.createNotification({
            userId,
            title: "Loan Update",
            message: `Your ₹${amount} loan has been ${status}.`,
            type: "loan",
        });
    }
    /**
     * Commission Notification
     */
    async commissionNotification(userId, commission) {
        return this.createNotification({
            userId,
            title: "Commission Credited",
            message: `₹${commission} commission credited successfully.`,
            type: "commission",
        });
    }
    /**
     * Referral Notification
     */
    async referralNotification(userId, reward) {
        return this.createNotification({
            userId,
            title: "Referral Bonus",
            message: `₹${reward} referral bonus added.`,
            type: "referral",
        });
    }
    /**
     * KYC Notification
     */
    async kycNotification(userId, status) {
        return this.createNotification({
            userId,
            title: "KYC Status",
            message: `Your KYC has been ${status}.`,
            type: "kyc",
        });
    }
    /**
     * Insurance Notification
     */
    async insuranceNotification(userId, policyName) {
        return this.createNotification({
            userId,
            title: "Insurance Approved",
            message: `${policyName} policy approved successfully.`,
            type: "insurance",
        });
    }
    /**
     * Investment Notification
     */
    async investmentNotification(userId, amount) {
        return this.createNotification({
            userId,
            title: "Investment Success",
            message: `₹${amount} investment processed successfully.`,
            type: "investment",
        });
    }
    /**
     * Admin Announcement
     */
    async adminAnnouncement(title, message) {
        return this.notifyAllUsers(title, message);
    }
    /**
     * Notification Analytics
     */
    async getNotificationStats() {
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
        return {
            total,
            read,
            unread,
        };
    }
    /**
     * Recent Notifications
     */
    async getRecentNotifications(limit = 20) {
        return prisma_1.default.notification.findMany({
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }
}
exports.default = new NotificationService();
