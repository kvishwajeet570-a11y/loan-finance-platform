import { Request, Response } from "express";
import bannerService from "../../services/banner/banner.service";

export const getAllBanners = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);

    const result = await bannerService.getAllBanners({
      page,
      limit,
    });

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

export const getActiveBanners = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const banners =
      await bannerService.getActiveBanners();

    res.status(200).json({
      success: true,
      data: banners,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch active banners",
    });
  }
};

export const createBanner = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const banner =
      await bannerService.createBanner(
        req.body
      );

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

export const updateBanner = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const banner =
      await bannerService.updateBanner(
        req.params.id,
        req.body
      );

    res.status(200).json({
      success: true,
      message: "Banner updated successfully",
      data: banner,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update banner",
    });
  }
};

export const deleteBanner = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await bannerService.deleteBanner(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete banner",
    });
  }
};

export const getBannerAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const analytics =
      await bannerService.getBannerAnalytics();

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
    });
  }
};