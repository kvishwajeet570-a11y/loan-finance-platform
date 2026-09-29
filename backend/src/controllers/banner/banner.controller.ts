import { Request, Response } from "express";
import bannerService from "../../services/banner/banner.service";

// ========================================
// GET ALL BANNERS
// ========================================

export const getAllBanners = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    const result = await bannerService.getAllBanners(page, limit);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("[GET_BANNERS_ERROR]", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch banners",
    });
  }
};

// ========================================
// GET ACTIVE BANNERS
// ========================================

export const getActiveBanners = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const banners = await bannerService.getActiveBanners();

    res.status(200).json({
      success: true,
      data: banners,
    });
  } catch (error) {
    console.error("[ACTIVE_BANNERS_ERROR]", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch active banners",
    });
  }
};

// ========================================
// CREATE BANNER
// ========================================

export const createBanner = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const banner = await bannerService.createBanner(req.body);

    res.status(201).json({
      success: true,
      message: "Banner created successfully",
      data: banner,
    });
  } catch (error) {
    console.error("[CREATE_BANNER_ERROR]", error);

    res.status(500).json({
      success: false,
      message: "Failed to create banner",
    });
  }
};

// ========================================
// GET BANNER BY ID
// ========================================

export const getBannerById = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const banner = await bannerService.getBannerById(req.params.id);

    if (!banner) {
      res.status(404).json({
        success: false,
        message: "Banner not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: banner,
    });
  } catch (error) {
    console.error("[GET_BANNER_ERROR]", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch banner",
    });
  }
};

// ========================================
// GET BANNER BY TYPE
// ========================================

export const getBannerByType = async (
  req: Request<{ type: string }>,
  res: Response
): Promise<void> => {
  try {
    const banners = await bannerService.getBannerByType(req.params.type);

    res.status(200).json({
      success: true,
      data: banners,
    });
  } catch (error) {
    console.error("[GET_BANNER_TYPE_ERROR]", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch banners",
    });
  }
};

// ========================================
// GET AUDIENCE BANNERS
// ========================================

export const getAudienceBanners = async (
  req: Request<{ audience: string }>,
  res: Response
): Promise<void> => {
  try {
    const banners = await bannerService.getAudienceBanners(
      req.params.audience
    );

    res.status(200).json({
      success: true,
      data: banners,
    });
  } catch (error) {
    console.error("[AUDIENCE_BANNERS_ERROR]", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch banners",
    });
  }
};

// ========================================
// UPDATE BANNER
// ========================================

export const updateBanner = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const banner = await bannerService.updateBanner(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Banner updated successfully",
      data: banner,
    });
  } catch (error) {
    console.error("[UPDATE_BANNER_ERROR]", error);

    res.status(500).json({
      success: false,
      message: "Failed to update banner",
    });
  }
};

// ========================================
// DELETE BANNER
// ========================================

export const deleteBanner = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    await bannerService.deleteBanner(req.params.id);

    res.status(200).json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    console.error("[DELETE_BANNER_ERROR]", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete banner",
    });
  }
};

// ========================================
// ACTIVATE BANNER
// ========================================

export const activateBanner = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const banner = await bannerService.activateBanner(req.params.id);

    res.status(200).json({
      success: true,
      data: banner,
    });
  } catch (error) {
    console.error("[ACTIVATE_BANNER_ERROR]", error);

    res.status(500).json({
      success: false,
      message: "Failed to activate banner",
    });
  }
};

// ========================================
// DEACTIVATE BANNER
// ========================================

export const deactivateBanner = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const banner = await bannerService.deactivateBanner(req.params.id);

    res.status(200).json({
      success: true,
      data: banner,
    });
  } catch (error) {
    console.error("[DEACTIVATE_BANNER_ERROR]", error);

    res.status(500).json({
      success: false,
      message: "Failed to deactivate banner",
    });
  }
};

// ========================================
// INCREMENT VIEW
// ========================================

export const incrementView = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const banner = await bannerService.incrementView(req.params.id);

    res.status(200).json({
      success: true,
      data: banner,
    });
  } catch (error) {
    console.error("[VIEW_ERROR]", error);

    res.status(500).json({
      success: false,
      message: "Failed to update view count",
    });
  }
};

// ========================================
// INCREMENT CLICK
// ========================================

export const incrementClick = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const banner = await bannerService.incrementClick(req.params.id);

    res.status(200).json({
      success: true,
      data: banner,
    });
  } catch (error) {
    console.error("[CLICK_ERROR]", error);

    res.status(500).json({
      success: false,
      message: "Failed to update click count",
    });
  }
};

// ========================================
// BANNER ANALYTICS
// ========================================

export const getBannerAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const analytics = await bannerService.getBannerAnalytics();

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error("[BANNER_ANALYTICS_ERROR]", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
    });
  }
};