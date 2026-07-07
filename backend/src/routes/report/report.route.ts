import { Router } from "express";

import {
  getDashboardReport,

  getLoanReport,
  getCustomerReport,
  getDsaReport,
  getPartnerReport,
  getCommissionReport,
  getRevenueReport,
  getTransactionReport,
  getWalletReport,
  getKycReport,
  getInsuranceReport,
  getInvestmentReport,
  getFastagReport,
  getReferralReport,
  getRechargeReport,
  getPaymentReport,

  getDailyReport,
  getWeeklyReport,
  getMonthlyReport,
  getQuarterlyReport,
  getYearlyReport,

  getPendingReport,
  getApprovedReport,
  getRejectedReport,

  getTopCustomersReport,
  getTopDsaReport,
  getTopPartnersReport,

  getGrowthReport,
  getPerformanceReport,
  getConversionReport,
  getProfitLossReport,

  getAuditReport,
  getFraudReport,

  exportReportExcel,
  exportReportPdf,
  exportReportCsv,

  scheduleReport,
  getScheduledReports,

  searchReports,

  getReportById,
  createReport,
  updateReport,
  deleteReport,

  bulkDeleteReports,
  bulkExportReports,
} from "../../controllers/report/report.controller";

const router = Router();

/* =========================
   DASHBOARD
========================= */

router.get("/dashboard", getDashboardReport);

/* =========================
   BUSINESS REPORTS
========================= */

router.get("/loan", getLoanReport);
router.get("/customer", getCustomerReport);
router.get("/dsa", getDsaReport);
router.get("/partner", getPartnerReport);
router.get("/commission", getCommissionReport);
router.get("/revenue", getRevenueReport);
router.get("/transaction", getTransactionReport);
router.get("/wallet", getWalletReport);
router.get("/kyc", getKycReport);
router.get("/insurance", getInsuranceReport);
router.get("/investment", getInvestmentReport);
router.get("/fastag", getFastagReport);
router.get("/referral", getReferralReport);
router.get("/recharge", getRechargeReport);
router.get("/payment", getPaymentReport);

/* =========================
   TIME REPORTS
========================= */

router.get("/daily", getDailyReport);
router.get("/weekly", getWeeklyReport);
router.get("/monthly", getMonthlyReport);
router.get("/quarterly", getQuarterlyReport);
router.get("/yearly", getYearlyReport);

/* =========================
   STATUS REPORTS
========================= */

router.get("/pending", getPendingReport);
router.get("/approved", getApprovedReport);
router.get("/rejected", getRejectedReport);

/* =========================
   PERFORMANCE REPORTS
========================= */

router.get("/top-customers", getTopCustomersReport);
router.get("/top-dsa", getTopDsaReport);
router.get("/top-partners", getTopPartnersReport);

router.get("/growth", getGrowthReport);
router.get("/performance", getPerformanceReport);
router.get("/conversion", getConversionReport);
router.get("/profit-loss", getProfitLossReport);

/* =========================
   SECURITY REPORTS
========================= */

router.get("/audit", getAuditReport);
router.get("/fraud", getFraudReport);

/* =========================
   EXPORTS
========================= */

router.get("/export/excel", exportReportExcel);
router.get("/export/pdf", exportReportPdf);
router.get("/export/csv", exportReportCsv);

/* =========================
   SCHEDULED REPORTS
========================= */

router.post("/schedule", scheduleReport);
router.get("/scheduled", getScheduledReports);

/* =========================
   SEARCH
========================= */

router.get("/search", searchReports);

/* =========================
   CRUD
========================= */

router.post("/", createReport);

router.get("/:id", getReportById);

router.put("/:id", updateReport);

router.delete("/:id", deleteReport);

/* =========================
   BULK ACTIONS
========================= */

router.post("/bulk/export", bulkExportReports);

router.post("/bulk/delete", bulkDeleteReports);

export default router;