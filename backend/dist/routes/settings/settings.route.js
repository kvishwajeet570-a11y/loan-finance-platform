"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const setting_controller_1 = require("../../controllers/setting/setting.controller");
const router = (0, express_1.Router)();
/* ========================================
   DASHBOARD & ANALYTICS
======================================== */
router.get("/dashboard", setting_controller_1.getSettingDashboard);
router.get("/analytics", setting_controller_1.getSettingAnalytics);
router.get("/audit-logs", setting_controller_1.getAuditLogs);
/* ========================================
   SYSTEM SETTINGS
======================================== */
router.get("/system", setting_controller_1.getSystemSettings);
router.put("/system", setting_controller_1.updateSystemSettings);
/* ========================================
   COMPANY SETTINGS
======================================== */
router.get("/company", setting_controller_1.getCompanySettings);
router.put("/company", setting_controller_1.updateCompanySettings);
/* ========================================
   WEBSITE SETTINGS
======================================== */
router.get("/website", setting_controller_1.getWebsiteSettings);
router.put("/website", setting_controller_1.updateWebsiteSettings);
/* ========================================
   SEO SETTINGS
======================================== */
router.get("/seo", setting_controller_1.getSeoSettings);
router.put("/seo", setting_controller_1.updateSeoSettings);
/* ========================================
   EMAIL SETTINGS
======================================== */
router.get("/email", setting_controller_1.getEmailSettings);
router.put("/email", setting_controller_1.updateEmailSettings);
/* ========================================
   SMS SETTINGS
======================================== */
router.get("/sms", setting_controller_1.getSmsSettings);
router.put("/sms", setting_controller_1.updateSmsSettings);
/* ========================================
   WHATSAPP SETTINGS
======================================== */
router.get("/whatsapp", setting_controller_1.getWhatsappSettings);
router.put("/whatsapp", setting_controller_1.updateWhatsappSettings);
/* ========================================
   NOTIFICATION SETTINGS
======================================== */
router.get("/notification", setting_controller_1.getNotificationSettings);
router.put("/notification", setting_controller_1.updateNotificationSettings);
/* ========================================
   PAYMENT GATEWAY SETTINGS
======================================== */
router.get("/payment-gateway", setting_controller_1.getPaymentGatewaySettings);
router.put("/payment-gateway", setting_controller_1.updatePaymentGatewaySettings);
/* ========================================
   LOAN SETTINGS
======================================== */
router.get("/loan", setting_controller_1.getLoanSettings);
router.put("/loan", setting_controller_1.updateLoanSettings);
/* ========================================
   COMMISSION SETTINGS
======================================== */
router.get("/commission", setting_controller_1.getCommissionSettings);
router.put("/commission", setting_controller_1.updateCommissionSettings);
/* ========================================
   REFERRAL SETTINGS
======================================== */
router.get("/referral", setting_controller_1.getReferralSettings);
router.put("/referral", setting_controller_1.updateReferralSettings);
/* ========================================
   KYC SETTINGS
======================================== */
router.get("/kyc", setting_controller_1.getKycSettings);
router.put("/kyc", setting_controller_1.updateKycSettings);
/* ========================================
   SECURITY SETTINGS
======================================== */
router.get("/security", setting_controller_1.getSecuritySettings);
router.put("/security", setting_controller_1.updateSecuritySettings);
/* ========================================
   MAINTENANCE SETTINGS
======================================== */
router.get("/maintenance", setting_controller_1.getMaintenanceSettings);
router.patch("/maintenance/enable", setting_controller_1.enableMaintenanceMode);
router.patch("/maintenance/disable", setting_controller_1.disableMaintenanceMode);
/* ========================================
   BACKUP & RESTORE
======================================== */
router.post("/backup", setting_controller_1.backupSettings);
router.post("/restore", setting_controller_1.restoreSettings);
router.post("/reset", setting_controller_1.resetSettings);
/* ========================================
   EXPORTS
======================================== */
router.get("/export/excel", setting_controller_1.exportSettingsExcel);
router.get("/export/pdf", setting_controller_1.exportSettingsPdf);
/* ========================================
   SEARCH
======================================== */
router.get("/search", setting_controller_1.searchSettings);
/* ========================================
   CRUD
======================================== */
router.post("/", setting_controller_1.createSetting);
router.get("/", setting_controller_1.getAllSettings);
router.get("/:key", setting_controller_1.getSettingByKey);
router.put("/:key", setting_controller_1.updateSetting);
router.delete("/:key", setting_controller_1.deleteSetting);
/* ========================================
   BULK ACTIONS
======================================== */
router.post("/bulk/update", setting_controller_1.bulkUpdateSettings);
router.post("/bulk/delete", setting_controller_1.bulkDeleteSettings);
exports.default = router;
