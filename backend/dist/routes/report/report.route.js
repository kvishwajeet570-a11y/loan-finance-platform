"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const report_controller_1 = require("../../controllers/report/report.controller");
const router = (0, express_1.Router)();
/* =========================
   DASHBOARD
========================= */
router.get("/dashboard", report_controller_1.getDashboardReport);
/* =========================
   BUSINESS REPORTS
========================= */
router.get("/loan", report_controller_1.getLoanReport);
router.get("/customer", report_controller_1.getCustomerReport);
router.get("/dsa", report_controller_1.getDsaReport);
router.get("/partner", report_controller_1.getPartnerReport);
router.get("/commission", report_controller_1.getCommissionReport);
router.get("/revenue", report_controller_1.getRevenueReport);
router.get("/transaction", report_controller_1.getTransactionReport);
router.get("/wallet", report_controller_1.getWalletReport);
router.get("/kyc", report_controller_1.getKycReport);
router.get("/insurance", report_controller_1.getInsuranceReport);
router.get("/investment", report_controller_1.getInvestmentReport);
router.get("/fastag", report_controller_1.getFastagReport);
router.get("/referral", report_controller_1.getReferralReport);
router.get("/recharge", report_controller_1.getRechargeReport);
router.get("/payment", report_controller_1.getPaymentReport);
/* =========================
   TIME REPORTS
========================= */
router.get("/daily", report_controller_1.getDailyReport);
router.get("/weekly", report_controller_1.getWeeklyReport);
router.get("/monthly", report_controller_1.getMonthlyReport);
router.get("/quarterly", report_controller_1.getQuarterlyReport);
router.get("/yearly", report_controller_1.getYearlyReport);
/* =========================
   STATUS REPORTS
========================= */
router.get("/pending", report_controller_1.getPendingReport);
router.get("/approved", report_controller_1.getApprovedReport);
router.get("/rejected", report_controller_1.getRejectedReport);
/* =========================
   PERFORMANCE REPORTS
========================= */
router.get("/top-customers", report_controller_1.getTopCustomersReport);
router.get("/top-dsa", report_controller_1.getTopDsaReport);
router.get("/top-partners", report_controller_1.getTopPartnersReport);
router.get("/growth", report_controller_1.getGrowthReport);
router.get("/performance", report_controller_1.getPerformanceReport);
router.get("/conversion", report_controller_1.getConversionReport);
router.get("/profit-loss", report_controller_1.getProfitLossReport);
/* =========================
   SECURITY REPORTS
========================= */
router.get("/audit", report_controller_1.getAuditReport);
router.get("/fraud", report_controller_1.getFraudReport);
/* =========================
   EXPORTS
========================= */
router.get("/export/excel", report_controller_1.exportReportExcel);
router.get("/export/pdf", report_controller_1.exportReportPdf);
router.get("/export/csv", report_controller_1.exportReportCsv);
/* =========================
   SCHEDULED REPORTS
========================= */
router.post("/schedule", report_controller_1.scheduleReport);
router.get("/scheduled", report_controller_1.getScheduledReports);
/* =========================
   SEARCH
========================= */
router.get("/search", report_controller_1.searchReports);
/* =========================
   CRUD
========================= */
router.post("/", report_controller_1.createReport);
router.get("/:id", report_controller_1.getReportById);
router.put("/:id", report_controller_1.updateReport);
router.delete("/:id", report_controller_1.deleteReport);
/* =========================
   BULK ACTIONS
========================= */
router.post("/bulk/export", report_controller_1.bulkExportReports);
router.post("/bulk/delete", report_controller_1.bulkDeleteReports);
exports.default = router;
