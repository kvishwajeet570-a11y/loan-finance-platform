import prisma from "../../prisma/prisma";

export class NotificationRepository {

  /* =========================
      CREATE NOTIFICATION
  ========================= */

  static async createNotification(data: {
  userId: string;
  title: string;
  message: string;
  type?: string;
  priority?: string;
  channel?: string;
}) {

  return prisma.notification.create({
    data: {
      userId: data.userId,
      title: data.title,
      message: data.message,
      type: data.type,
      priority: data.priority,
      channel: data.channel,
    }
  });
}

  /* =========================
      BULK CREATE
  ========================= */

 static async createBulkNotifications(
  notifications: {
    userId: string;
    title: string;
    message: string;
    type?: string;
    priority?: string;
    channel?: string;
  }[]
) {

  return prisma.notification.createMany({
    data: notifications
  });
}

  /* =========================
      GET BY ID
  ========================= */

  static async getNotificationById(
    id: string
  ) {

    return prisma.notification.findUnique({
      where: { id }
    });
  }

  /* =========================
      USER NOTIFICATIONS
  ========================= */

  static async getUserNotifications(
    userId: string,
    page = 1,
    limit = 20
  ) {

    const skip =
      (page - 1) * limit;

    return prisma.notification.findMany({

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

  static async getUnreadNotifications(
    userId: string
  ) {

    return prisma.notification.findMany({

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

  static async markAsRead(
    id: string
  ) {

    return prisma.notification.update({

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

  static async markAllAsRead(
    userId: string
  ) {

    return prisma.notification.updateMany({

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

  static async deleteNotification(
    id: string
  ) {

    return prisma.notification.delete({
      where: { id }
    });
  }

  /* =========================
      DELETE USER NOTIFICATIONS
  ========================= */

  static async deleteAllUserNotifications(
    userId: string
  ) {

    return prisma.notification.deleteMany({
      where: {
        userId
      }
    });
  }

  /* =========================
      SEARCH NOTIFICATIONS
  ========================= */

  static async searchNotifications(
    keyword: string
  ) {

    return prisma.notification.findMany({

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

  static async getByType(
    type: string
  ) {

    return prisma.notification.findMany({

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

  static async getAllNotifications(
    page = 1,
    limit = 50
  ) {

    const skip =
      (page - 1) * limit;

    const [notifications, total] =
      await Promise.all([

        prisma.notification.findMany({

          skip,
          take: limit,

          include: {
            user: true
          },

          orderBy: {
            createdAt: "desc"
          }
        }),

        prisma.notification.count()
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

    const [
      total,
      read,
      unread
    ] = await Promise.all([

      prisma.notification.count(),

      prisma.notification.count({
        where: {
          isRead: true
        }
      }),

      prisma.notification.count({
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

  static async getRecentNotifications(
    limit = 10
  ) {

    return prisma.notification.findMany({

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

  static async getUnreadCount(
    userId: string
  ) {

    return prisma.notification.count({

      where: {
        userId,
        isRead: false
      }
    });
  }
}