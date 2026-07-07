import { Request, Response } from "express";
import dsaService from "../../services/dsa/dsa.service";

export const getDSAs = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const search = String(req.query.search || "");

    const result = await dsaService.getDSAs({
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
      message: "Failed to fetch DSAs",
    });
  }
};

export const getDSAById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const dsa = await dsaService.getDSAById(
      req.params.id
    );

    if (!dsa) {
      return void res.status(404).json({
        success: false,
        message: "DSA not found",
      });
    }

    res.status(200).json({
      success: true,
      data: dsa,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch DSA",
    });
  }
};

export const createDSA = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const dsa = await dsaService.createDSA(
      req.body
    );

    res.status(201).json({
      success: true,
      message: "DSA created successfully",
      data: dsa,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const approveDSA = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const dsa = await dsaService.approveDSA(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "DSA approved successfully",
      data: dsa,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Approval failed",
    });
  }
};

export const rejectDSA = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const dsa = await dsaService.rejectDSA(
      req.params.id,
      req.body.reason
    );

    res.status(200).json({
      success: true,
      message: "DSA rejected",
      data: dsa,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Rejection failed",
    });
  }
};

export const blockDSA = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const dsa = await dsaService.blockDSA(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "DSA blocked successfully",
      data: dsa,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Block failed",
    });
  }
};

export const getDSAAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const analytics =
      await dsaService.getAnalytics();

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