import prisma from "../../prisma/prisma";

interface NotificationDTO {
  userId: string;
  title: string;
  message: string;
  type?: string;
}

class NotificationService {
  /**
   * Create Notification
   */
  async createNotification(
    data: NotificationDTO
  ) {
    return prisma.notification.create({
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
  async sendBulkNotification(
    userIds: string[],
    title: string,
    message: string
  ) {
    return prisma.notification.createMany({
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
  async notifyAllUsers(
    title: string,
    message: string
  ) {
    const users =
      await prisma.user.findMany({
        select: {
          id: true,
        },
      });

    return prisma.notification.createMany({
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
  async getUserNotifications(
    userId: string,
    page = 1,
    limit = 20
  ) {
    const skip =
      (page - 1) * limit;

    const [notifications, total] =
      await Promise.all([
        prisma.notification.findMany({
          where: {
            userId,
          },
          skip,
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
        }),

        prisma.notification.count({
          where: {
            userId,
          },
        }),
      ]);

    return {
      notifications,
      total,
      page,
      pages: Math.ceil(
        total / limit
      ),
    };
  }

  /**
   * Mark Single Notification Read
   */
  async markAsRead(
    notificationId: string
  ) {
    return prisma.notification.update({
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
  async markAllRead(
    userId: string
  ) {
    return prisma.notification.updateMany({
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
  async deleteNotification(
    notificationId: string
  ) {
    return prisma.notification.delete({
      where: {
        id: notificationId,
      },
    });
  }

  /**
   * Delete All Notifications
   */
  async deleteAllNotifications(
    userId: string
  ) {
    return prisma.notification.deleteMany({
      where: {
        userId,
      },
    });
  }

  /**
   * Unread Count
   */
  async getUnreadCount(
    userId: string
  ) {
    const count =
      await prisma.notification.count({
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
  async loanNotification(
    userId: string,
    amount: number,
    status: string
  ) {
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
  async commissionNotification(
    userId: string,
    commission: number
  ) {
    return this.createNotification({
      userId,
      title:
        "Commission Credited",
      message: `₹${commission} commission credited successfully.`,
      type: "commission",
    });
  }

  /**
   * Referral Notification
   */
  async referralNotification(
    userId: string,
    reward: number
  ) {
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
  async kycNotification(
    userId: string,
    status: string
  ) {
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
  async insuranceNotification(
    userId: string,
    policyName: string
  ) {
    return this.createNotification({
      userId,
      title:
        "Insurance Approved",
      message: `${policyName} policy approved successfully.`,
      type: "insurance",
    });
  }

  /**
   * Investment Notification
   */
  async investmentNotification(
    userId: string,
    amount: number
  ) {
    return this.createNotification({
      userId,
      title:
        "Investment Success",
      message: `₹${amount} investment processed successfully.`,
      type: "investment",
    });
  }

  /**
   * Admin Announcement
   */
  async adminAnnouncement(
    title: string,
    message: string
  ) {
    return this.notifyAllUsers(
      title,
      message
    );
  }

  /**
   * Notification Analytics
   */
  async getNotificationStats() {
    const [
      total,
      read,
      unread,
    ] = await Promise.all([
      prisma.notification.count(),

      prisma.notification.count({
        where: {
          isRead: true,
        },
      }),

      prisma.notification.count({
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
  async getRecentNotifications(
    limit = 20
  ) {
    return prisma.notification.findMany({
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

export default new NotificationService();