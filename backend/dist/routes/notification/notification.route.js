"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_controller_1 = require("../../controllers/notification/notification.controller");
const router = (0, express_1.Router)();
/* ========================================
   DASHBOARD & ANALYTICS
======================================== */
router.get("/dashboard", notification_controller_1.getNotificationDashboard);
router.get("/analytics", notification_controller_1.getNotificationAnalytics);
router.get("/recent", notification_controller_1.getRecentNotifications);
/* ========================================
   EXPORTS
======================================== */
router.get("/export/excel", notification_controller_1.exportNotificationsExcel);
router.get("/export/pdf", notification_controller_1.exportNotificationsPdf);
/* ========================================
   STATUS
======================================== */
router.get("/unread", notification_controller_1.getUnreadNotifications);
router.get("/read", notification_controller_1.getReadNotifications);
router.get("/archived", notification_controller_1.getArchivedNotifications);
/* ========================================
   SEND NOTIFICATIONS
======================================== */
router.post("/send", notification_controller_1.sendNotification);
router.post("/send-bulk", notification_controller_1.sendBulkNotification);
router.post("/send-email", notification_controller_1.sendEmailNotification);
router.post("/send-sms", notification_controller_1.sendSmsNotification);
router.post("/send-push", notification_controller_1.sendPushNotification);
router.post("/send-whatsapp", notification_controller_1.sendWhatsappNotification);
/* ========================================
   NOTIFICATION MANAGEMENT
======================================== */
router.post("/", notification_controller_1.createNotification);
router.get("/", notification_controller_1.getAllNotifications);
router.get("/search", notification_controller_1.searchNotifications);
router.get("/user/:userId", notification_controller_1.getUserNotifications);
router.get("/:id", notification_controller_1.getNotificationById);
router.put("/:id", notification_controller_1.updateNotification);
router.delete("/:id", notification_controller_1.deleteNotification);
/* ========================================
   ACTIONS
======================================== */
router.patch("/:id/read", notification_controller_1.markAsRead);
router.patch("/user/:userId/read-all", notification_controller_1.markAllAsRead);
router.patch("/:id/archive", notification_controller_1.archiveNotification);
/* ========================================
   BULK ACTIONS
======================================== */
router.post("/bulk-delete", notification_controller_1.bulkDeleteNotifications);
router.post("/bulk-archive", notification_controller_1.bulkArchiveNotifications);
exports.default = router;
