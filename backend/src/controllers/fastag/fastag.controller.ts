import { Request, Response } from "express";
import fastagService from "../../services/fastag/fastag.service";

export const getFastags = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const search = String(req.query.search || "");
    const status = String(req.query.status || "");

    const result = await fastagService.getFastags({
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
    const fastag = await fastagService.getFastagById(
      req.params.id
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
    const fastag = await fastagService.createFastag(
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
    const fastag = await fastagService.activateFastag(
      req.params.id
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
    const fastag = await fastagService.blockFastag(
      req.params.id
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
  try {
    const recharge =
      await fastagService.rechargeFastag({
        fastagId: req.params.id,
        amount: Number(req.body.amount),
      });

    res.status(200).json({
      success: true,
      message: "Recharge successful",
      data: recharge,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Recharge failed",
    });
  }
};

export const getFastagAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const analytics =
      await fastagService.getAnalytics();

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