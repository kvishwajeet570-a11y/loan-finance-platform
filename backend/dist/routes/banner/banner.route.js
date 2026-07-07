"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const banner_controller_1 = require("../../controllers/banner/banner.controller");
const router = (0, express_1.Router)();
/* ========================================
   ANALYTICS
======================================== */
router.get("/analytics", banner_controller_1.getBannerAnalytics);
/* ========================================
   BANNERS
======================================== */
router.post("/", banner_controller_1.createBanner);
router.get("/", banner_controller_1.getAllBanners);
router.get("/active", banner_controller_1.getActiveBanners);
router.get("/type/:type", banner_controller_1.getBannerByType);
router.get("/audience/:audience", banner_controller_1.getAudienceBanners);
router.get("/:id", banner_controller_1.getBannerById);
router.put("/:id", banner_controller_1.updateBanner);
router.delete("/:id", banner_controller_1.deleteBanner);
/* ========================================
   STATUS
======================================== */
router.patch("/:id/activate", banner_controller_1.activateBanner);
router.patch("/:id/deactivate", banner_controller_1.deactivateBanner);
/* ========================================
   TRACKING
======================================== */
router.patch("/:id/view", banner_controller_1.incrementView);
router.patch("/:id/click", banner_controller_1.incrementClick);
exports.default = router;
