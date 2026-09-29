import { Request, Response } from "express";
import fastagService, { FastagService } from "../../services/fastag/fastag.service";

export const getFastags = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const search = String(req.query.search || "");

    const result = await fastagService.getFastTags({
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
      message: "Failed to fetch FASTags",
    });
  }
};

export const getFastagById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const fastag =
      await fastagService.getFastTagById(
        String(req.params.id)
      );

    if (!fastag) {
      return void res.status(404).json({
        success: false,
        message: "FASTag not found",
      });
    }

    res.status(200).json({
      success: true,
      data: fastag,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch FASTag",
    });
  }
};

export const createFastag = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const fastag =
      await fastagService.createFastTag(
        req.body
      );

    res.status(201).json({
      success: true,
      message: "FASTag created successfully",
      data: fastag,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const activateFastag = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const fastag =
      await fastagService.activateTag(
        String(req.params.id)
      );

    res.status(200).json({
      success: true,
      message: "FASTag activated successfully",
      data: fastag,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Activation failed",
    });
  }
};

export const blockFastag = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const fastag =
      await fastagService.deactivateTag(
        String(req.params.id)
      );

    res.status(200).json({
      success: true,
      message: "FASTag blocked successfully",
      data: fastag,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Block failed",
    });
  }
};

export const rechargeFastag = async (
  req: Request,
  res: Response
): Promise<void> => {
  return void res.status(200).json({
    success: true,
    message:
      "Recharge module not implemented yet",
  });
};

export const getFastagAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const analytics =
      await fastagService.getFastTagStats();

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

/* ROUTE COMPATIBILITY EXPORTS */

export const getAllFastags = getFastags;

export const updateFastag = activateFastag;

export const deleteFastag = blockFastag;

export const deactivateFastag = blockFastag;

export const unblockFastag = activateFastag;

export const getFastagTransactions = getFastags;

export const getUserFastags = getFastags;

export const getFastagByVehicle = getFastagById;

export const searchFastags = getFastags;

export const getActiveFastags = getFastags;

export const getInactiveFastags = getFastags;

export const getBlockedFastags = getFastags;

export const getFastagDashboard =
  getFastagAnalytics;

export const getTopRechargeUsers =
  getFastagAnalytics;

export const getMonthlyRecharges =
  getFastagAnalytics;

export const exportFastagExcel =
  getFastagAnalytics;

export const exportFastagPdf =
  getFastagAnalytics;

export const bulkActivateFastags =
  activateFastag;

export const bulkBlockFastags =
  blockFastag;

  
  export default FastagService;