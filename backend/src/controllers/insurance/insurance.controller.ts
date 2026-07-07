import { Request, Response } from "express";
import insuranceService from "../../services/insurance/insurance.service";

export const getPolicies = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const search = String(req.query.search || "");
    const type = String(req.query.type || "");

    const result = await insuranceService.getPolicies({
      page,
      limit,
      search,
      type,
    });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch policies",
    });
  }
};

export const getPolicyById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const policy = await insuranceService.getPolicyById(
      req.params.id
    );

    if (!policy) {
      return void res.status(404).json({
        success: false,
        message: "Policy not found",
      });
    }

    res.status(200).json({
      success: true,
      data: policy,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch policy",
    });
  }
};

export const createPolicy = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const policy = await insuranceService.createPolicy(
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Policy created successfully",
      data: policy,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const approvePolicy = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const policy = await insuranceService.approvePolicy(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Policy approved successfully",
      data: policy,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Approval failed",
    });
  }
};

export const rejectPolicy = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const policy = await insuranceService.rejectPolicy(
      req.params.id,
      req.body.reason
    );

    res.status(200).json({
      success: true,
      message: "Policy rejected",
      data: policy,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Rejection failed",
    });
  }
};

export const renewPolicy = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const policy = await insuranceService.renewPolicy(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Policy renewed successfully",
      data: policy,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Renewal failed",
    });
  }
};

export const getInsuranceAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const analytics =
      await insuranceService.getAnalytics();

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