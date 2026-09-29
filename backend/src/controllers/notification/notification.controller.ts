
import { Request, Response } from "express";
import prisma from "../../prisma/prisma";

/* ========================================
   CREATE NOTIFICATION
======================================== */

export const createNotification = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      title,
      message,
      type,
      userId,
    } = req.body;

    const notification =
      await prisma.notification.create({
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
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to create notification",
    });
  }
};

/* ========================================
   SEND NOTIFICATION
======================================== */

export const sendNotification =
  createNotification;

/* ========================================
   SEND BULK NOTIFICATION
======================================== */

export const sendBulkNotification =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const {
        userIds,
        title,
        message,
      } = req.body;

      await prisma.notification.createMany({
        data: userIds.map(
          (userId: string) => ({
            userId,
            title,
            message,
            type: "bulk",
          })
        ),
      });

      return res.status(200).json({
        success: true,
        message:
          "Bulk notification sent",
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
      });
    }
  };

/* ========================================
   GET ALL NOTIFICATIONS
======================================== */

export const getNotifications =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const page = Number(
        req.query.page || 1
      );

      const limit = Number(
        req.query.limit || 20
      );

      const skip =
        (page - 1) * limit;

      const [notifications, total] =
        await Promise.all([
          prisma.notification.findMany({
            skip,
            take: limit,
            orderBy: {
              createdAt: "desc",
            },
          }),

          prisma.notification.count(),
        ]);

      return res.status(200).json({
        success: true,
        total,
        page,
        pages: Math.ceil(
          total / limit
        ),
        notifications,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
      });
    }
  };

export const getAllNotifications =
  getNotifications;

/* ========================================
   SEARCH NOTIFICATIONS
======================================== */

export const searchNotifications =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const keyword =
        typeof req.query.keyword ===
        "string"
          ? req.query.keyword
          : "";

      const notifications =
        await prisma.notification.findMany(
          {
            where: {
              OR: [
                {
                  title: {
                    contains:
                      keyword,
                    mode:
                      "insensitive",
                  },
                },
                {
                  message: {
                    contains:
                      keyword,
                    mode:
                      "insensitive",
                  },
                },
              ],
            },
          }
        );

      return res.status(200).json({
        success: true,
        notifications,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
      });
    }
  };

/* ========================================
   GET NOTIFICATION BY ID
======================================== */

export const getNotificationById = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);

    const notification =
      await prisma.notification.findUnique({
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
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
    });
  }
};
/* ========================================
   UPDATE NOTIFICATION
======================================== */

export const updateNotification = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);

    const notification =
      await prisma.notification.update({
        where: {
          id: id,
        },
        data: req.body,
      });

    return res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
    });
  }
};
/* ========================================
   DELETE NOTIFICATION
======================================== */

export const deleteNotification = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);

    await prisma.notification.delete({
      where: {
        id: id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("Delete Notification Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete notification",
    });
  }
};

/* ========================================
   BULK DELETE
======================================== */

export const bulkDeleteNotifications =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const { ids } = req.body;

      await prisma.notification.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      });

      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
      });
    }
  };

/* ========================================
   USER NOTIFICATIONS
======================================== */

export const getUserNotifications = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = String(req.params.userId);

    const notifications =
      await prisma.notification.findMany({
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
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};

/* ========================================
   MARK AS READ
======================================== */

export const markAsRead = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);

    const notification =
      await prisma.notification.update({
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
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
    });
  }
};

/* ========================================
   MARK ALL AS READ
======================================== */

export const markAllAsRead = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = String(req.params.userId);

    await prisma.notification.updateMany({
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
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to mark all notifications as read",
    });
  }
};

/* ========================================
   UNREAD
======================================== */

export const getUnreadNotifications =
  async (
    req: Request,
    res: Response
  ) => {
    const notifications =
      await prisma.notification.findMany(
        {
          where: {
            isRead: false,
          },
        }
      );

    return res.status(200).json({
      success: true,
      notifications,
    });
  };

/* ========================================
   READ
======================================== */

export const getReadNotifications =
  async (
    req: Request,
    res: Response
  ) => {
    const notifications =
      await prisma.notification.findMany(
        {
          where: {
            isRead: true,
          },
        }
      );

    return res.status(200).json({
      success: true,
      notifications,
    });
  };

/* ========================================
   RECENT
======================================== */

export const getRecentNotifications =
  async (
    req: Request,
    res: Response
  ) => {
    const notifications =
      await prisma.notification.findMany(
        {
          take: 10,
          orderBy: {
            createdAt:
              "desc",
          },
        }
      );

    return res.status(200).json({
      success: true,
      notifications,
    });
  };

/* ========================================
   ANALYTICS
======================================== */

export const getNotificationAnalytics =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const [
        total,
        read,
        unread,
      ] =
        await Promise.all([
          prisma.notification.count(),

          prisma.notification.count(
            {
              where: {
                isRead:
                  true,
              },
            }
          ),

          prisma.notification.count(
            {
              where: {
                isRead:
                  false,
              },
            }
          ),
        ]);

      return res.status(200).json({
        success: true,
        total,
        read,
        unread,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
      });
    }
  };

export const getNotificationDashboard =
  getNotificationAnalytics;

/* ========================================
   PLACEHOLDER FUNCTIONS
======================================== */

export const archiveNotification =
  async (
    req: Request,
    res: Response
  ) => {
    return res.status(200).json({
      success: true,
      message:
        "Archive feature requires schema update",
    });
  };

export const getArchivedNotifications =
  async (
    req: Request,
    res: Response
  ) => {
    return res.status(200).json({
      success: true,
      notifications: [],
    });
  };

export const bulkArchiveNotifications =
  async (
    req: Request,
    res: Response
  ) => {
    return res.status(200).json({
      success: true,
    });
  };

export const sendEmailNotification =
  sendNotification;

export const sendSmsNotification =
  sendNotification;

export const sendPushNotification =
  sendNotification;

export const sendWhatsappNotification =
  sendNotification;

export const exportNotificationsExcel =
  async (
    req: Request,
    res: Response
  ) => {
    return res.status(200).json({
      success: true,
      message:
        "Excel export coming soon",
    });
  };

export const exportNotificationsPdf =
  async (
    req: Request,
    res: Response
  ) => {
    return res.status(200).json({
      success: true,
      message:
        "PDF export coming soon",
    });
  };

