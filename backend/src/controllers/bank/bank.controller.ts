import { Request, Response } from "express";
import bankService from "../../services/bank/bank.service";

export const getBanks = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const search = String(req.query.search || "");
    const status = String(req.query.status || "");

    const result = await bankService.getBanks({
      page,
      limit,
      search,
      status,
    });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("[GET_BANKS_ERROR]", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch banks",
    });
  }
};

export const getBankById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const bank = await bankService.getBankById(
      req.params.id
    );

    if (!bank) {
      res.status(404).json({
        success: false,
        message: "Bank not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: bank,
    });
  } catch (error) {
    console.error("[GET_BANK_BY_ID_ERROR]", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch bank",
    });
  }
};

export const createBank = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const bank = await bankService.createBank(
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Bank created successfully",
      data: bank,
    });
  } catch (error) {
    console.error("[CREATE_BANK_ERROR]", error);

    res.status(500).json({
      success: false,
      message: "Failed to create bank",
    });
  }
};

export const updateBank = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const bank = await bankService.updateBank(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Bank updated successfully",
      data: bank,
    });
  } catch (error) {
    console.error("[UPDATE_BANK_ERROR]", error);

    res.status(500).json({
      success: false,
      message: "Failed to update bank",
    });
  }
};

export const deleteBank = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await bankService.deleteBank(req.params.id);

    res.status(200).json({
      success: true,
      message: "Bank deleted successfully",
    });
  } catch (error) {
    console.error("[DELETE_BANK_ERROR]", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete bank",
    });
  }
};

export const getBankAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const analytics =
      await bankService.getBankAnalytics();

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error(
      "[BANK_ANALYTICS_ERROR]",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
    });
  }
};