"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const partner_controller_1 = require("../../controllers/partner/partner.controller");
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const RoleMiddleware_1 = __importDefault(require("../../middlewares/RoleMiddleware"));
const router = (0, express_1.Router)();
/* ========================================
   GLOBAL SECURITY
======================================== */
router.use(AuthMiddleware_1.default);
/* ========================================
   DASHBOARD
======================================== */
router.get("/dashboard", (0, RoleMiddleware_1.default)("SUPER_ADMIN", "ADMIN", "PARTNER"), partner_controller_1.getPartnerDashboard);
router.get("/analytics", (0, RoleMiddleware_1.default)("SUPER_ADMIN", "ADMIN"), partner_controller_1.getPartnerAnalytics);
router.get("/top-performers", (0, RoleMiddleware_1.default)("SUPER_ADMIN", "ADMIN"), partner_controller_1.getTopPartners);
router.get("/monthly", (0, RoleMiddleware_1.default)("SUPER_ADMIN", "ADMIN"), partner_controller_1.getMonthlyPartners);
/* ========================================
   EXPORTS
======================================== */
router.get("/export/excel", (0, RoleMiddleware_1.default)("SUPER_ADMIN", "ADMIN"), partner_controller_1.exportPartnersExcel);
router.get("/export/pdf", (0, RoleMiddleware_1.default)("SUPER_ADMIN", "ADMIN"), partner_controller_1.exportPartnersPdf);
/* ========================================
   STATUS FILTERS
======================================== */
router.get("/pending", (0, RoleMiddleware_1.default)("SUPER_ADMIN", "ADMIN"), partner_controller_1.getPendingPartners);
router.get("/verified", (0, RoleMiddleware_1.default)("SUPER_ADMIN", "ADMIN"), partner_controller_1.getVerifiedPartners);
router.get("/blocked", (0, RoleMiddleware_1.default)("SUPER_ADMIN", "ADMIN"), partner_controller_1.getBlockedPartners);
router.get("/active", (0, RoleMiddleware_1.default)("SUPER_ADMIN", "ADMIN"), partner_controller_1.getActivePartners);
/* ========================================
   SEARCH
======================================== */
router.get("/search", (0, RoleMiddleware_1.default)("SUPER_ADMIN", "ADMIN"), partner_controller_1.searchPartners);
/* ========================================
   EXPORT ROUTER
======================================== */
exports.default = router;
