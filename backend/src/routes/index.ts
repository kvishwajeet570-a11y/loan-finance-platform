import { Router } from "express";

/* =========================================
   ROUTES
========================================= */

import achievementRoutes from "./achievements/achievementRoutes";
import adminRoutes from "./admin/admin.route";
import analyticsRoutes from "./analytics/analytics.route";
import auditRoutes from "./audit/audit.route";
import authRoutes from "./auth/auth.route";
import bankRoutes from "./bank/bank.route";
import bannerRoutes from "./banner/banner.route";
import blogRoutes from "./blog/blog.route";
import cmsRoutes from "./cms/cms.route";
import commissionRoutes from "./commission/commission.route";
import creditScoreRoutes from "./creditScore/creditScore.route";
import customerRoutes from "./customer/customer.route";
import dashboardRoutes from "./dashboard/dashboard.route";
import documentRoutes from "./document/document.route";
import dsaRoutes from "./dsa/dsa.route";
import faqRoutes from "./faq/faq.route";
import fastagRoutes from "./fastag/fastag.route";
import insuranceRoutes from "./insurance/insurance.route";
import investmentRoutes from "./investment/investment.route";
import kycRoutes from "./kyc/kyc.route";
import leadRoutes from "./lead/lead.route";
import leaderboardRoutes from "./leaderboard/leaderboard.route";
import loanRoutes from "./loan/loan.route";
import loanStatusHistoryRoutes from "./loanStatusHistory/loanStatusHistory.route";
import loginHistoryRoutes from "./loginHistory/loginHistory.route";
import notificationRoutes from "./notification/notification.route";
import partnerRoutes from "./partner/partner.route";
import paymentRoutes from "./payment/payment.route";
import permissionRoutes from "./permission/permission.route";
import profileRoutes from "./profile/profile.route";
import rechargeRoutes from "./recharge/recharge.route";
import referralRoutes from "./referral/referral.route";
import reportRoutes from "./report/report.route";
import revenueRoutes from "./revenue/revenue.routes";
import roleRoutes from "./role/role.route";
import rolePermissionRoutes from "./rolePermission/rolePermission.route";
import securityLogRoutes from "./securityLog/securityLog.routes";
import settingsRoutes from "./settings/settings.route";
import superAdminRoutes from "./superAdmin/superAdmin.route";
import supportRoutes from "./support/support.route";
import subAgentRoutes from "./sub-agent/sub-agent.route";
import systemSettingRoutes from "./systemSetting/systemSetting.routes";
import transactionRoutes from "./transaction/transaction.route";
import uploadRoutes from "./upload/upload.route";
import userRoutes from "./user/user.route";
import walletRoutes from "./wallet/wallet.route";
import refreshTokenRoutes from "./refreshToken.routes";

/* =========================================
   MAIN ROUTER
========================================= */

const router = Router();

/* =========================================
   AUTH & USER
========================================= */

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/profile", profileRoutes);
router.use("/refresh-token", refreshTokenRoutes);

/* =========================================
   LOAN & KYC
========================================= */

router.use("/loan", loanRoutes);
router.use("/loan-status-history", loanStatusHistoryRoutes);
router.use("/kyc", kycRoutes);
router.use("/document", documentRoutes);
router.use("/upload", uploadRoutes);

/* =========================================
   BANKING & PAYMENTS
========================================= */

router.use("/bank", bankRoutes);
router.use("/payment", paymentRoutes);
router.use("/transaction", transactionRoutes);
router.use("/wallet", walletRoutes);
router.use("/recharge", rechargeRoutes);
router.use("/commission", commissionRoutes);
router.use("/revenue", revenueRoutes);

/* =========================================
   DSA & PARTNER
========================================= */

router.use("/dsa", dsaRoutes);
router.use("/partner", partnerRoutes);
router.use("/referral", referralRoutes);
router.use("/lead", leadRoutes);

/* =========================================
   INSURANCE & INVESTMENT
========================================= */

router.use("/insurance", insuranceRoutes);
router.use("/investment", investmentRoutes);

/* =========================================
   CREDIT & SERVICES
========================================= */

router.use("/credit-score", creditScoreRoutes);
router.use("/fastag", fastagRoutes);

/* =========================================
   NOTIFICATION & SUPPORT
========================================= */

router.use("/notification", notificationRoutes);
router.use("/support", supportRoutes);
router.use("/sub-agent", subAgentRoutes);
router.use("/login-history", loginHistoryRoutes);
router.use("/security-log", securityLogRoutes);

/* =========================================
   DASHBOARD & ANALYTICS
========================================= */

router.use("/dashboard", dashboardRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/audit", auditRoutes);
router.use("/reports", reportRoutes);
router.use("/leaderboard", leaderboardRoutes);

/* =========================================
   ADMIN & PERMISSIONS
========================================= */

router.use("/admin", adminRoutes);
router.use("/super-admin", superAdminRoutes);
router.use("/permission", permissionRoutes);
router.use("/role", roleRoutes);
router.use("/role-permission", rolePermissionRoutes);

/* =========================================
   CMS & CONTENT
========================================= */

router.use("/banner", bannerRoutes);
router.use("/blog", blogRoutes);
router.use("/cms", cmsRoutes);
router.use("/faq", faqRoutes);
router.use("/settings", settingsRoutes);
router.use("/system-settings", systemSettingRoutes);

/* =========================================
   CUSTOMER & ACHIEVEMENTS
========================================= */

router.use("/customer", customerRoutes);
router.use("/achievements", achievementRoutes);

export default router;

