import { Request, Response } from "express";
import leadService from "../../services/lead/lead.service";

export const createLead = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const lead = await leadService.createLead(req.body);

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: lead,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getLeads = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const search = String(req.query.search || "");
    const status = String(req.query.status || "");

    const result = await leadService.getLeads({
      page,
      limit,
      search,
      status,
    });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch leads",
    });
  }
};

export const getLeadById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const lead = await leadService.getLeadById(
      req.params.id
    );

    if (!lead) {
      res.status(404).json({
        success: false,
        message: "Lead not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch lead",
    });
  }
};

export const assignLead = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const lead = await leadService.assignLead({
      leadId: req.params.id,
      assignedTo: req.body.assignedTo,
    });

    res.status(200).json({
      success: true,
      message: "Lead assigned successfully",
      data: lead,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Assignment failed",
    });
  }
};

export const updateLeadStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const lead = await leadService.updateStatus({
      leadId: req.params.id,
      status: req.body.status,
    });

    res.status(200).json({
      success: true,
      message: "Lead status updated",
      data: lead,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Status update failed",
    });
  }
};

export const deleteLead = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await leadService.softDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};

export const getLeadAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const analytics =
      await leadService.getAnalytics();

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