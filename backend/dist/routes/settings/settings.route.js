"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const settings_controller_1 = require("../../controllers/settings/settings.controller");
const router = (0, express_1.Router)();
/* ========================================
   DASHBOARD & ANALYTICS
======================================== */
router.get("/dashboard", settings_controller_1.getSettingDashboard);
router.get("/analytics", settings_controller_1.getSettingAnalytics);
router.get("/audit-logs", settings_controller_1.getAuditLogs);
/* ========================================
   SYSTEM SETTINGS
======================================== */
router.get("/system", settings_controller_1.getSystemSettings);
router.put("/system", settings_controller_1.updateSystemSettings);
/* ========================================
   COMPANY SETTINGS
======================================== */
router.get("/company", settings_controller_1.getCompanySettings);
router.put("/company", settings_controller_1.updateCompanySettings);
/* ========================================
   WEBSITE SETTINGS
======================================== */
router.get("/website", settings_controller_1.getWebsiteSettings);
router.put("/website", settings_controller_1.updateWebsiteSettings);
/* ========================================
   SEO SETTINGS
======================================== */
router.get("/seo", settings_controller_1.getSeoSettings);
router.put("/seo", settings_controller_1.updateSeoSettings);
/* ========================================
   EMAIL SETTINGS
======================================== */
router.get("/email", settings_controller_1.getEmailSettings);
router.put("/email", settings_controller_1.updateEmailSettings);
/* ========================================
   SMS SETTINGS
======================================== */
router.get("/sms", settings_controller_1.getSmsSettings);
router.put("/sms", settings_controller_1.updateSmsSettings);
/* ========================================
   WHATSAPP SETTINGS
======================================== */
router.get("/whatsapp", settings_controller_1.getWhatsappSettings);
router.put("/whatsapp", settings_controller_1.updateWhatsappSettings);
/* ========================================
   NOTIFICATION SETTINGS
======================================== */
router.get("/notification", settings_controller_1.getNotificationSettings);
router.put("/notification", settings_controller_1.updateNotificationSettings);
/* ========================================
   PAYMENT GATEWAY SETTINGS
======================================== */
router.get("/payment-gateway", settings_controller_1.getPaymentGatewaySettings);
router.put("/payment-gateway", settings_controller_1.updatePaymentGatewaySettings);
/* ========================================
   LOAN SETTINGS
======================================== */
router.get("/loan", settings_controller_1.getLoanSettings);
router.put("/loan", settings_controller_1.updateLoanSettings);
/* ========================================
   COMMISSION SETTINGS
======================================== */
router.get("/commission", settings_controller_1.getCommissionSettings);
router.put("/commission", settings_controller_1.updateCommissionSettings);
/* ========================================
   REFERRAL SETTINGS
======================================== */
router.get("/referral", settings_controller_1.getReferralSettings);
router.put("/referral", settings_controller_1.updateReferralSettings);
/* ========================================
   KYC SETTINGS
======================================== */
router.get("/kyc", settings_controller_1.getKycSettings);
router.put("/kyc", settings_controller_1.updateKycSettings);
/* ========================================
   SECURITY SETTINGS
======================================== */
router.get("/security", settings_controller_1.getSecuritySettings);
router.put("/security", settings_controller_1.updateSecuritySettings);
/* ========================================
   MAINTENANCE SETTINGS
======================================== */
router.get("/maintenance", settings_controller_1.getMaintenanceSettings);
router.put("/maintenance", settings_controller_1.updateMaintenanceSettings);
// Enable
router.patch("/maintenance/enable", (req, res, next) => {
    req.body.enabled = true;
    return (0, settings_controller_1.toggleMaintenanceMode)(req, res, next);
});
// Disable
router.patch("/maintenance/disable", (req, res, next) => {
    req.body.enabled = false;
    return (0, settings_controller_1.toggleMaintenanceMode)(req, res, next);
});
/* ========================================
   BACKUP & RESTORE
======================================== */
router.post("/restore", settings_controller_1.restoreSettings);
// router.post("/reset", resetSettings);
/* ========================================
   EXPORTS
======================================== */
router.get("/export/excel", settings_controller_1.exportSettingsExcel);
router.get("/export/pdf", settings_controller_1.exportSettingsPdf);
/* ========================================
   SEARCH
======================================== */
router.get("/search", settings_controller_1.searchSettings);
/* ========================================
   CRUD
======================================== */
router.post("/", settings_controller_1.createSetting);
router.get("/", settings_controller_1.getAllSettings);
router.get("/:key", settings_controller_1.getSettingByKey);
router.put("/:key", settings_controller_1.updateSetting);
router.delete("/:key", settings_controller_1.deleteSetting);
/* ========================================
   BULK ACTIONS
======================================== */
router.post("/bulk/update", settings_controller_1.bulkUpdateSettings);
router.post("/bulk/delete", settings_controller_1.bulkDeleteSettings);
exports.default = router;
