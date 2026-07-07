import { Router } from "express";

import {
  createBanner,
  getBannerById,
  getActiveBanners,
  getBannerByType,
  getAudienceBanners,
  updateBanner,
  activateBanner,
  deactivateBanner,
  incrementView,
  incrementClick,
  deleteBanner,
  getAllBanners,
  getBannerAnalytics,
} from "../../controllers/banner/banner.controller";

const router = Router();

/* ========================================
   ANALYTICS
======================================== */

router.get(
  "/analytics",
  getBannerAnalytics
);

/* ========================================
   BANNERS
======================================== */

router.post(
  "/",
  createBanner
);

router.get(
  "/",
  getAllBanners
);

router.get(
  "/active",
  getActiveBanners
);

router.get(
  "/type/:type",
  getBannerByType
);

router.get(
  "/audience/:audience",
  getAudienceBanners
);

router.get(
  "/:id",
  getBannerById
);

router.put(
  "/:id",
  updateBanner
);

router.delete(
  "/:id",
  deleteBanner
);

/* ========================================
   STATUS
======================================== */

router.patch(
  "/:id/activate",
  activateBanner
);

router.patch(
  "/:id/deactivate",
  deactivateBanner
);

/* ========================================
   TRACKING
======================================== */

router.patch(
  "/:id/view",
  incrementView
);

router.patch(
  "/:id/click",
  incrementClick
);

export default router;