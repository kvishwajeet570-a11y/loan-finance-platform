import { Request, Response } from "express";
import cmsService from "../../services/cms/cms.service";

export const getPages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const search = String(req.query.search || "");

    const data = await cmsService.getPages({
      page,
      limit,
      search,
    });

    res.status(200).json({
      success: true,
      ...data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch pages",
    });
  }
};

export const getPageBySlug = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = await cmsService.getPageBySlug(
      req.params.slug
    );

    if (!page) {
      res.status(404).json({
        success: false,
        message: "Page not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: page,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch page",
    });
  }
};

export const createPage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = await cmsService.createPage(
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Page created successfully",
      data: page,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updatePage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = await cmsService.updatePage(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Page updated successfully",
      data: page,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const togglePublishStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page =
      await cmsService.togglePublishStatus(
        req.params.id
      );

    res.status(200).json({
      success: true,
      message: "Status updated",
      data: page,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to update status",
    });
  }
};

export const deletePage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await cmsService.softDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Page deleted successfully",
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to delete page",
    });
  }
};

export const getCMSAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const analytics =
      await cmsService.getAnalytics();

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
    });
  }
};