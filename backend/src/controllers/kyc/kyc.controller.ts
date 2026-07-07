import { Request, Response } from "express";
import kycService from "../../services/kyc/kyc.service";

export const getKYCs = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const status = String(req.query.status || "");
    const search = String(req.query.search || "");

    const result = await kycService.getKYCs({
      page,
      limit,
      status,
      search,
    });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch KYC records",
    });
  }
};

export const getKYCById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const kyc = await kycService.getKYCById(
      req.params.id
    );

    if (!kyc) {
      return void res.status(404).json({
        success: false,
        message: "KYC not found",
      });
    }

    res.status(200).json({
      success: true,
      data: kyc,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch KYC",
    });
  }
};

export const submitKYC = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const kyc = await kycService.submitKYC({
      ...req.body,
      documents: req.files,
    });

    res.status(201).json({
      success: true,
      message: "KYC submitted successfully",
      data: kyc,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const approveKYC = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const kyc = await kycService.approveKYC(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "KYC approved successfully",
      data: kyc,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Approval failed",
    });
  }
};

export const rejectKYC = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const kyc = await kycService.rejectKYC(
      req.params.id,
      req.body.reason
    );

    res.status(200).json({
      success: true,
      message: "KYC rejected",
      data: kyc,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Rejection failed",
    });
  }
};

export const getKYCAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const analytics =
      await kycService.getAnalytics();

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