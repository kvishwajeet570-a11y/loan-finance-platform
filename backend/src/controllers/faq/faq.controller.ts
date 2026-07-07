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
  } catch (error) {
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
      req.params.id
    );

    if (!faq) {
      return void res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
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
    const faq = await faqService.createFAQ(
      req.body
    );

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
      req.params.id,
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
    const faq = await faqService.toggleStatus(
      req.params.id
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
    await faqService.softDelete(
      req.params.id
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
    const analytics =
      await faqService.getAnalytics();

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