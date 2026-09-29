import { Request, Response } from "express";
import cmsService from "../../services/cms/cms.service";

interface IdParams {
  id: string;
}

interface SlugParams {
  slug: string;
}

/* ========================================
   CREATE PAGE
======================================== */

export const createPage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = await cmsService.createPage(req.body);

    res.status(201).json({
      success: true,
      message: "CMS page created successfully.",
      data: page,
    });
  } catch (error: any) {
    console.error(error);

    res.status(400).json({
      success: false,
      message: error?.message || "Failed to create page.",
    });
  }
};

/* ========================================
   GET PAGE BY ID
======================================== */

export const getPageById = async (
  req: Request<IdParams>,
  res: Response
): Promise<void> => {
  try {
    const page = await cmsService.getPageById(req.params.id);

    if (!page) {
      res.status(404).json({
        success: false,
        message: "Page not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: page,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch page.",
    });
  }
};

/* ========================================
   GET PAGE BY SLUG
======================================== */

export const getPageBySlug = async (
  req: Request<SlugParams>,
  res: Response
): Promise<void> => {
  try {
    const page = await cmsService.getPageBySlug(req.params.slug);

    if (!page) {
      res.status(404).json({
        success: false,
        message: "Page not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: page,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch page.",
    });
  }
};

/* ========================================
   GET ALL PAGES
======================================== */

export const getAllPages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    const result = await cmsService.getAllPages({
      page,
      limit,
      search: String(req.query.search ?? ""),
      pageType: String(req.query.pageType ?? ""),
      category: String(req.query.category ?? ""),
      isPublished:
        req.query.isPublished !== undefined
          ? req.query.isPublished === "true"
          : undefined,
    });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch pages.",
    });
  }
};
/* ========================================
   GET PUBLISHED PAGES
======================================== */

export const getPublishedPages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const pages = await cmsService.getPublishedPages();

    res.status(200).json({
      success: true,
      count: pages.length,
      data: pages,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch published pages.",
    });
  }
};

/* ========================================
   SEARCH PAGES
======================================== */

export const searchPages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      keyword = "",
      pageType,
      category,
      isPublished,
      page = 1,
      limit = 10,
    } = req.query;

    const result = await cmsService.searchPages({
      keyword: String(keyword),
      pageType: pageType ? String(pageType) : undefined,
      category: category ? String(category) : undefined,
      isPublished:
        isPublished !== undefined
          ? isPublished === "true"
          : undefined,
      page: Number(page),
      limit: Number(limit),
    });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Search failed.",
    });
  }
};

/* ========================================
   UPDATE PAGE
======================================== */

export const updatePage = async (
  req: Request<IdParams>,
  res: Response
): Promise<void> => {
  try {
    const page = await cmsService.updatePage(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Page updated successfully.",
      data: page,
    });
  } catch (error: any) {
    console.error(error);

    res.status(400).json({
      success: false,
      message: error?.message || "Failed to update page.",
    });
  }
};

/* ========================================
   PUBLISH PAGE
======================================== */

export const publishPage = async (
  req: Request<IdParams>,
  res: Response
): Promise<void> => {
  try {
    const page = await cmsService.publishPage(req.params.id);

    res.status(200).json({
      success: true,
      message: "Page published successfully.",
      data: page,
    });
  } catch (error: any) {
    console.error(error);

    res.status(400).json({
      success: false,
      message: error?.message || "Failed to publish page.",
    });
  }
};

/* ========================================
   UNPUBLISH PAGE
======================================== */

export const unpublishPage = async (
  req: Request<IdParams>,
  res: Response
): Promise<void> => {
  try {
    const page = await cmsService.unpublishPage(req.params.id);

    res.status(200).json({
      success: true,
      message: "Page unpublished successfully.",
      data: page,
    });
  } catch (error: any) {
    console.error(error);

    res.status(400).json({
      success: false,
      message: error?.message || "Failed to unpublish page.",
    });
  }
};
/* ========================================
   DELETE PAGE
======================================== */

export const deletePage = async (
  req: Request<IdParams>,
  res: Response
): Promise<void> => {
  try {
    await cmsService.deletePage(req.params.id);

    res.status(200).json({
      success: true,
      message: "Page deleted successfully.",
    });
  } catch (error: any) {
    console.error(error);

    res.status(400).json({
      success: false,
      message: error?.message || "Failed to delete page.",
    });
  }
};

/* ========================================
   GET PAGE TYPES
======================================== */

export const getPageTypes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const pageTypes = await cmsService.getPageTypes();

    res.status(200).json({
      success: true,
      count: pageTypes.length,
      data: pageTypes,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch page types.",
    });
  }
};

/* ========================================
   CMS ANALYTICS
======================================== */

export const getCmsAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const analytics = await cmsService.getCmsAnalytics();

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch CMS analytics.",
    });
  }
};

/* ========================================
   BULK DELETE
======================================== */

export const bulkDelete = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({
        success: false,
        message: "Please provide page ids.",
      });
      return;
    }

    const result = await cmsService.bulkDelete(ids);

    res.status(200).json({
      success: true,
      message: "Pages deleted successfully.",
      data: result,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error?.message || "Bulk delete failed.",
    });
  }
};