"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
/* =========================================
   ROUTES
========================================= */
const achievementRoutes_1 = __importDefault(require("./achievements/achievementRoutes"));
const admin_route_1 = __importDefault(require("./admin/admin.route"));
const analytics_route_1 = __importDefault(require("./analytics/analytics.route"));
const audit_route_1 = __importDefault(require("./audit/audit.route"));
const auth_route_1 = __importDefault(require("./auth/auth.route"));
const bank_route_1 = __importDefault(require("./bank/bank.route"));
const banner_route_1 = __importDefault(require("./banner/banner.route"));
const blog_route_1 = __importDefault(require("./blog/blog.route"));
const cms_route_1 = __importDefault(require("./cms/cms.route"));
const commission_route_1 = __importDefault(require("./commission/commission.route"));
const creditScore_route_1 = __importDefault(require("./creditScore/creditScore.route"));
const customer_route_1 = __importDefault(require("./customer/customer.route"));
const dashboard_route_1 = __importDefault(require("./dashboard/dashboard.route"));
const document_route_1 = __importDefault(require("./document/document.route"));
const dsa_route_1 = __importDefault(require("./dsa/dsa.route"));
const faq_route_1 = __importDefault(require("./faq/faq.route"));
const fastag_route_1 = __importDefault(require("./fastag/fastag.route"));
const insurance_route_1 = __importDefault(require("./insurance/insurance.route"));
const investment_route_1 = __importDefault(require("./investment/investment.route"));
const kyc_route_1 = __importDefault(require("./kyc/kyc.route"));
const lead_route_1 = __importDefault(require("./lead/lead.route"));
const leaderboard_route_1 = __importDefault(require("./leaderboard/leaderboard.route"));
const loan_route_1 = __importDefault(require("./loan/loan.route"));
const loanStatusHistory_route_1 = __importDefault(require("./loanStatusHistory/loanStatusHistory.route"));
const loginHistory_route_1 = __importDefault(require("./loginHistory/loginHistory.route"));
const notification_route_1 = __importDefault(require("./notification/notification.route"));
const partner_route_1 = __importDefault(require("./partner/partner.route"));
const payment_route_1 = __importDefault(require("./payment/payment.route"));
const permission_route_1 = __importDefault(require("./permission/permission.route"));
const profile_route_1 = __importDefault(require("./profile/profile.route"));
const recharge_route_1 = __importDefault(require("./recharge/recharge.route"));
const referral_route_1 = __importDefault(require("./referral/referral.route"));
const report_route_1 = __importDefault(require("./report/report.route"));
const revenue_routes_1 = __importDefault(require("./revenue/revenue.routes"));
const role_route_1 = __importDefault(require("./role/role.route"));
const rolePermission_route_1 = __importDefault(require("./rolePermission/rolePermission.route"));
const securityLog_routes_1 = __importDefault(require("./securityLog/securityLog.routes"));
const settings_route_1 = __importDefault(require("./settings/settings.route"));
const superAdmin_route_1 = __importDefault(require("./superAdmin/superAdmin.route"));
const support_route_1 = __importDefault(require("./support/support.route"));
const systemSetting_routes_1 = __importDefault(require("./systemSetting/systemSetting.routes"));
const transaction_route_1 = __importDefault(require("./transaction/transaction.route"));
const upload_route_1 = __importDefault(require("./upload/upload.route"));
const user_route_1 = __importDefault(require("./user/user.route"));
const wallet_route_1 = __importDefault(require("./wallet/wallet.route"));
const refreshToken_routes_1 = __importDefault(require("./refreshToken.routes"));
/* =========================================
   MAIN ROUTER
========================================= */
const router = (0, express_1.Router)();
/* =========================================
   AUTH & USER
========================================= */
router.use("/auth", auth_route_1.default);
router.use("/user", user_route_1.default);
router.use("/profile", profile_route_1.default);
router.use("/refresh-token", refreshToken_routes_1.default);
/* =========================================
   LOAN & KYC
========================================= */
router.use("/loan", loan_route_1.default);
router.use("/loan-status-history", loanStatusHistory_route_1.default);
router.use("/kyc", kyc_route_1.default);
router.use("/document", document_route_1.default);
router.use("/upload", upload_route_1.default);
/* =========================================
   BANKING & PAYMENTS
========================================= */
router.use("/bank", bank_route_1.default);
router.use("/payment", payment_route_1.default);
router.use("/transaction", transaction_route_1.default);
router.use("/wallet", wallet_route_1.default);
router.use("/recharge", recharge_route_1.default);
router.use("/commission", commission_route_1.default);
router.use("/revenue", revenue_routes_1.default);
/* =========================================
   DSA & PARTNER
========================================= */
router.use("/dsa", dsa_route_1.default);
router.use("/partner", partner_route_1.default);
router.use("/referral", referral_route_1.default);
router.use("/lead", lead_route_1.default);
/* =========================================
   INSURANCE & INVESTMENT
========================================= */
router.use("/insurance", insurance_route_1.default);
router.use("/investment", investment_route_1.default);
/* =========================================
   CREDIT & SERVICES
========================================= */
router.use("/credit-score", creditScore_route_1.default);
router.use("/fastag", fastag_route_1.default);
/* =========================================
   NOTIFICATION & SUPPORT
========================================= */
router.use("/notification", notification_route_1.default);
router.use("/support", support_route_1.default);
router.use("/login-history", loginHistory_route_1.default);
router.use("/security-log", securityLog_routes_1.default);
/* =========================================
   DASHBOARD & ANALYTICS
========================================= */
router.use("/dashboard", dashboard_route_1.default);
router.use("/analytics", analytics_route_1.default);
router.use("/audit", audit_route_1.default);
router.use("/reports", report_route_1.default);
router.use("/leaderboard", leaderboard_route_1.default);
/* =========================================
   ADMIN & PERMISSIONS
========================================= */
router.use("/admin", admin_route_1.default);
router.use("/super-admin", superAdmin_route_1.default);
router.use("/permission", permission_route_1.default);
router.use("/role", role_route_1.default);
router.use("/role-permission", rolePermission_route_1.default);
/* =========================================
   CMS & CONTENT
========================================= */
router.use("/banner", banner_route_1.default);
router.use("/blog", blog_route_1.default);
router.use("/cms", cms_route_1.default);
router.use("/faq", faq_route_1.default);
router.use("/settings", settings_route_1.default);
router.use("/system-settings", systemSetting_routes_1.default);
/* =========================================
   CUSTOMER & ACHIEVEMENTS
========================================= */
router.use("/customer", customer_route_1.default);
router.use("/achievements", achievementRoutes_1.default);
exports.default = router;
