import { Request, Response } from "express";
import investmentService from "../../services/investment/investment.service";

export const getInvestments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const search = String(req.query.search || "");
    const type = String(req.query.type || "");

    const result = await investmentService.getInvestments({
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
      message: "Failed to fetch investments",
    });
  }
};

export const getInvestmentById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const investment =
      await investmentService.getInvestmentById(
        req.params.id
      );

    if (!investment) {
      return void res.status(404).json({
        success: false,
        message: "Investment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: investment,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch investment",
    });
  }
};

export const createInvestment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const investment =
      await investmentService.createInvestment(
        req.body
      );

    res.status(201).json({
      success: true,
      message: "Investment created successfully",
      data: investment,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const approveInvestment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const investment =
      await investmentService.approveInvestment(
        req.params.id
      );

    res.status(200).json({
      success: true,
      message: "Investment approved successfully",
      data: investment,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Approval failed",
    });
  }
};

export const rejectInvestment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const investment =
      await investmentService.rejectInvestment(
        req.params.id,
        req.body.reason
      );

    res.status(200).json({
      success: true,
      message: "Investment rejected",
      data: investment,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Rejection failed",
    });
  }
};

export const closeInvestment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const investment =
      await investmentService.closeInvestment(
        req.params.id
      );

    res.status(200).json({
      success: true,
      message: "Investment closed successfully",
      data: investment,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Closure failed",
    });
  }
};

export const getInvestmentAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const analytics =
      await investmentService.getAnalytics();

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