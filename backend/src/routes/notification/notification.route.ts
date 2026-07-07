import { Router } from "express";

import {
  createNotification,
  getNotificationById,
  getAllNotifications,

  updateNotification,
  deleteNotification,

  sendNotification,
  sendBulkNotification,

  getUserNotifications,

  markAsRead,
  markAllAsRead,

  archiveNotification,

  searchNotifications,

  getUnreadNotifications,
  getReadNotifications,
  getArchivedNotifications,

  getNotificationAnalytics,
  getNotificationDashboard,

  getRecentNotifications,

  sendEmailNotification,
  sendSmsNotification,
  sendPushNotification,
  sendWhatsappNotification,

  exportNotificationsExcel,
  exportNotificationsPdf,

  bulkDeleteNotifications,
  bulkArchiveNotifications,
} from "../../controllers/notification/notification.controller";

const router = Router();

/* ========================================
   DASHBOARD & ANALYTICS
======================================== */

router.get(
  "/dashboard",
  getNotificationDashboard
);

router.get(
  "/analytics",
  getNotificationAnalytics
);

router.get(
  "/recent",
  getRecentNotifications
);

/* ========================================
   EXPORTS
======================================== */

router.get(
  "/export/excel",
  exportNotificationsExcel
);

router.get(
  "/export/pdf",
  exportNotificationsPdf
);

/* ========================================
   STATUS
======================================== */

router.get(
  "/unread",
  getUnreadNotifications
);

router.get(
  "/read",
  getReadNotifications
);

router.get(
  "/archived",
  getArchivedNotifications
);

/* ========================================
   SEND NOTIFICATIONS
======================================== */

router.post(
  "/send",
  sendNotification
);

router.post(
  "/send-bulk",
  sendBulkNotification
);

router.post(
  "/send-email",
  sendEmailNotification
);

router.post(
  "/send-sms",
  sendSmsNotification
);

router.post(
  "/send-push",
  sendPushNotification
);

router.post(
  "/send-whatsapp",
  sendWhatsappNotification
);

/* ========================================
   NOTIFICATION MANAGEMENT
======================================== */

router.post(
  "/",
  createNotification
);

router.get(
  "/",
  getAllNotifications
);

router.get(
  "/search",
  searchNotifications
);

router.get(
  "/user/:userId",
  getUserNotifications
);

router.get(
  "/:id",
  getNotificationById
);

router.put(
  "/:id",
  updateNotification
);

router.delete(
  "/:id",
  deleteNotification
);

/* ========================================
   ACTIONS
======================================== */

router.patch(
  "/:id/read",
  markAsRead
);

router.patch(
  "/user/:userId/read-all",
  markAllAsRead
);

router.patch(
  "/:id/archive",
  archiveNotification
);

/* ========================================
   BULK ACTIONS
======================================== */

router.post(
  "/bulk-delete",
  bulkDeleteNotifications
);

router.post(
  "/bulk-archive",
  bulkArchiveNotifications
);

export default router;