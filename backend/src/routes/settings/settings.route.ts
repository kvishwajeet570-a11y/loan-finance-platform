import { Router } from "express";

import {
  getAllSettings,
  getSettingByKey,
  createSetting,
  updateSetting,
  deleteSetting,

  getSystemSettings,
  updateSystemSettings,

  getCompanySettings,
  updateCompanySettings,

  getWebsiteSettings,
  updateWebsiteSettings,

  getSeoSettings,
  updateSeoSettings,

  getEmailSettings,
  updateEmailSettings,

  getSmsSettings,
  updateSmsSettings,

  getWhatsappSettings,
  updateWhatsappSettings,

  getNotificationSettings,
  updateNotificationSettings,

  getPaymentGatewaySettings,
  updatePaymentGatewaySettings,

  getLoanSettings,
  updateLoanSettings,

  getCommissionSettings,
  updateCommissionSettings,

  getReferralSettings,
  updateReferralSettings,

  getKycSettings,
  updateKycSettings,

  getSecuritySettings,
  updateSecuritySettings,

  getMaintenanceSettings,
  updateMaintenanceSettings,

  // Controller me yahi function hai
  toggleMaintenanceMode,

  
  restoreSettings,

  resetSettings,

  getSettingAnalytics,
  getSettingDashboard,

  exportSettingsExcel,
  exportSettingsPdf,

  searchSettings,

  bulkUpdateSettings,
  bulkDeleteSettings,

  getAuditLogs,
} from "../../controllers/settings/settings.controller";

const router = Router();

/* ========================================
   DASHBOARD & ANALYTICS
======================================== */

router.get("/dashboard", getSettingDashboard);
router.get("/analytics", getSettingAnalytics);
router.get("/audit-logs", getAuditLogs);

/* ========================================
   SYSTEM SETTINGS
======================================== */

router.get("/system", getSystemSettings);
router.put("/system", updateSystemSettings);

/* ========================================
   COMPANY SETTINGS
======================================== */

router.get("/company", getCompanySettings);
router.put("/company", updateCompanySettings);

/* ========================================
   WEBSITE SETTINGS
======================================== */

router.get("/website", getWebsiteSettings);
router.put("/website", updateWebsiteSettings);

/* ========================================
   SEO SETTINGS
======================================== */

router.get("/seo", getSeoSettings);
router.put("/seo", updateSeoSettings);

/* ========================================
   EMAIL SETTINGS
======================================== */

router.get("/email", getEmailSettings);
router.put("/email", updateEmailSettings);

/* ========================================
   SMS SETTINGS
======================================== */

router.get("/sms", getSmsSettings);
router.put("/sms", updateSmsSettings);

/* ========================================
   WHATSAPP SETTINGS
======================================== */

router.get("/whatsapp", getWhatsappSettings);
router.put("/whatsapp", updateWhatsappSettings);

/* ========================================
   NOTIFICATION SETTINGS
======================================== */

router.get("/notification", getNotificationSettings);
router.put("/notification", updateNotificationSettings);

/* ========================================
   PAYMENT GATEWAY SETTINGS
======================================== */

router.get("/payment-gateway", getPaymentGatewaySettings);
router.put("/payment-gateway", updatePaymentGatewaySettings);

/* ========================================
   LOAN SETTINGS
======================================== */

router.get("/loan", getLoanSettings);
router.put("/loan", updateLoanSettings);

/* ========================================
   COMMISSION SETTINGS
======================================== */

router.get("/commission", getCommissionSettings);
router.put("/commission", updateCommissionSettings);

/* ========================================
   REFERRAL SETTINGS
======================================== */

router.get("/referral", getReferralSettings);
router.put("/referral", updateReferralSettings);

/* ========================================
   KYC SETTINGS
======================================== */

router.get("/kyc", getKycSettings);
router.put("/kyc", updateKycSettings);

/* ========================================
   SECURITY SETTINGS
======================================== */

router.get("/security", getSecuritySettings);
router.put("/security", updateSecuritySettings);

/* ========================================
   MAINTENANCE SETTINGS
======================================== */

router.get("/maintenance", getMaintenanceSettings);
router.put("/maintenance", updateMaintenanceSettings);

// Enable
router.patch("/maintenance/enable", (req, res, next) => {
  req.body.enabled = true;
  return toggleMaintenanceMode(req, res, next);
});

// Disable
router.patch("/maintenance/disable", (req, res, next) => {
  req.body.enabled = false;
  return toggleMaintenanceMode(req, res, next);
});

/* ========================================
   BACKUP & RESTORE
======================================== */

router.post("/restore", restoreSettings);
// router.post("/reset", resetSettings);

/* ========================================
   EXPORTS
======================================== */

router.get("/export/excel", exportSettingsExcel);
router.get("/export/pdf", exportSettingsPdf);

/* ========================================
   SEARCH
======================================== */

router.get("/search", searchSettings);

/* ========================================
   CRUD
======================================== */

router.post("/", createSetting);
router.get("/", getAllSettings);
router.get("/:key", getSettingByKey);
router.put("/:key", updateSetting);
router.delete("/:key", deleteSetting);

/* ========================================
   BULK ACTIONS
======================================== */

router.post("/bulk/update", bulkUpdateSettings);
router.post("/bulk/delete", bulkDeleteSettings);

export default router;