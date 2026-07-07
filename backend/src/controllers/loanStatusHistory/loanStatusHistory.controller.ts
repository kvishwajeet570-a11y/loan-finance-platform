import { Request, Response } from "express";
import loanStatusHistoryService from "../../services/loan-status-history/loanStatusHistory.service";

export const getLoanStatusHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const loanId = req.params.loanId;

    const history =
      await loanStatusHistoryService.getByLoanId(
        loanId
      );

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch loan status history",
    });
  }
};

export const createStatusEntry = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const history =
      await loanStatusHistoryService.create({
        loanId: req.body.loanId,
        status: req.body.status,
        remarks: req.body.remarks,
        changedBy: req.user?.id,
      });

    res.status(201).json({
      success: true,
      message: "Status history created",
      data: history,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateLoanStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const history =
      await loanStatusHistoryService.updateLoanStatus({
        loanId: req.params.loanId,
        status: req.body.status,
        remarks: req.body.remarks,
        changedBy: req.user?.id,
      });

    res.status(200).json({
      success: true,
      message: "Loan status updated successfully",
      data: history,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getStatusAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const analytics =
      await loanStatusHistoryService.getAnalytics();

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Analytics fetch failed",
    });
  }
};