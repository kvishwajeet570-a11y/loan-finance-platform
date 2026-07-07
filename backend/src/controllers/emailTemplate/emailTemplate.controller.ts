import { Request, Response } from "express";
import emailTemplateService from "../../services/email-template/emailTemplate.service";

export const getTemplates = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const search = String(req.query.search || "");

    const result =
      await emailTemplateService.getTemplates({
        page,
        limit,
        search,
      });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch templates",
    });
  }
};

export const getTemplateById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const template =
      await emailTemplateService.getTemplateById(
        req.params.id
      );

    if (!template) {
      return void res.status(404).json({
        success: false,
        message: "Template not found",
      });
    }

    res.status(200).json({
      success: true,
      data: template,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch template",
    });
  }
};

export const createTemplate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const template =
      await emailTemplateService.createTemplate(
        req.body
      );

    res.status(201).json({
      success: true,
      message: "Template created successfully",
      data: template,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateTemplate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const template =
      await emailTemplateService.updateTemplate(
        req.params.id,
        req.body
      );

    res.status(200).json({
      success: true,
      message: "Template updated successfully",
      data: template,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const toggleTemplateStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const template =
      await emailTemplateService.toggleStatus(
        req.params.id
      );

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: template,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to update status",
    });
  }
};

export const previewTemplate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const preview =
      await emailTemplateService.previewTemplate(
        req.params.id,
        req.body.variables || {}
      );

    res.status(200).json({
      success: true,
      data: preview,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Preview failed",
    });
  }
};

export const sendTestEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await emailTemplateService.sendTestEmail({
      templateId: req.params.id,
      email: req.body.email,
    });

    res.status(200).json({
      success: true,
      message: "Test email sent successfully",
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to send test email",
    });
  }
};

export const deleteTemplate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await emailTemplateService.softDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Template deleted successfully",
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};

export const getTemplateAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const analytics =
      await emailTemplateService.getAnalytics();

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Analytics failed",
    });
  }
};