import { Request, Response } from "express";
import creditScoreService from "../../services/credit-score/creditScore.service";

export const checkCreditScore = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { panNo } = req.body;

    const result =
      await creditScoreService.checkCreditScore(
        panNo
      );

    res.status(200).json({
      success: true,
      message: "Credit score fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllCreditScores = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const search = String(req.query.search || "");

    const result =
      await creditScoreService.getAllCreditScores({
        page,
        limit,
        search,
      });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch records",
    });
  }
};

export const getCreditScoreById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data =
      await creditScoreService.getCreditScoreById(
        req.params.id
      );

    if (!data) {
      res.status(404).json({
        success: false,
        message: "Record not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch record",
    });
  }
};

export const deleteCreditScore = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await creditScoreService.softDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Record deleted successfully",
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to delete record",
    });
  }
};

export const getCreditAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const analytics =
      await creditScoreService.getAnalytics();

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