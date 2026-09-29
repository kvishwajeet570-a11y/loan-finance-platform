import { Request, Response } from "express";
import faqService from "../../services/faq/faq.service";

export const getFAQs = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const search = String(req.query.search || "");
    const category = String(req.query.category || "");

    const result = await faqService.getFAQs({
      page,
      limit,
      search,
      category,
    });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch FAQs",
    });
  }
};

export const getFAQById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const faq = await faqService.getFAQById(
      String(req.params.id)
    );

    if (!faq) {
      res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: faq,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch FAQ",
    });
  }
};

export const createFAQ = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const faq = await faqService.createFAQ(req.body);

    res.status(201).json({
      success: true,
      message: "FAQ created successfully",
      data: faq,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateFAQ = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const faq = await faqService.updateFAQ(
      String(req.params.id),
      req.body
    );

    res.status(200).json({
      success: true,
      message: "FAQ updated successfully",
      data: faq,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const toggleFAQStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const faq = await faqService.publishFAQ(
      String(req.params.id)
    );

    res.status(200).json({
      success: true,
      message: "FAQ status updated",
      data: faq,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to update status",
    });
  }
};

export const deleteFAQ = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await faqService.deleteFAQ(
      String(req.params.id)
    );

    res.status(200).json({
      success: true,
      message: "FAQ deleted successfully",
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to delete FAQ",
    });
  }
};

export const getFAQAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const analytics = await faqService.getFAQStats();

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

/* ==========================================================
   ROUTE COMPATIBILITY EXPORTS
========================================================== */

export const createFaq = createFAQ;
export const getFaqById = getFAQById;
export const getAllFaqs = getFAQs;
export const updateFaq = updateFAQ;
export const deleteFaq = deleteFAQ;

export const getFaqBySlug = getFAQById;

export const publishFaq = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = await faqService.publishFAQ(
      String(req.params.id)
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Publish failed",
    });
  }
};

export const unpublishFaq = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = await faqService.unpublishFAQ(
      String(req.params.id)
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Unpublish failed",
    });
  }
};

export const getPublishedFaqs = getFAQs;
export const getFeaturedFaqs = getFAQs;
export const getFaqsByCategory = getFAQs;
export const searchFaqs = getFAQs;

export const incrementFaqView = getFAQById;

export { getFAQAnalytics as getFaqAnalytics };

export const getFaqDashboard = getFAQAnalytics;

export const getPopularFaqs = getFAQs;
export const getRecentFaqs = getFAQs;

export const exportFaqExcel = getFAQAnalytics;
export const exportFaqPdf = getFAQAnalytics;

export const bulkDeleteFaqs = deleteFAQ;
export const bulkPublishFaqs = publishFaq;