import { Request, Response } from "express";
import insuranceService from "../../services/insurance/insurance.service";

/* =========================================
   INSURANCE POLICY CRUD
========================================= */

export const createInsurance = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const insurance = await insuranceService.createInsurance(req.body);

    res.status(201).json({
      success: true,
      message: "Insurance policy created successfully",
      data: insurance,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error?.message || "Failed to create insurance",
    });
  }
};

export const getAllInsurances = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await insuranceService.getInsurances({
      page: Number(req.query.page || 1),
      limit: Number(req.query.limit || 10),
      search: String(req.query.search || ""),
      type: String(req.query.type || ""),
    });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch insurances",
    });
  }
};

export const getInsuranceById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const insurance = await insuranceService.getInsuranceById(
      String(req.params.id)
    );

    if (!insurance) {
      return void res.status(404).json({
        success: false,
        message: "Insurance not found",
      });
    }

    res.status(200).json({
      success: true,
      data: insurance,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch insurance",
    });
  }
};

export const updateInsurance = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const insurance = await insuranceService.updateInsurance(
      String(req.params.id),
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Insurance updated successfully",
      data: insurance,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to update insurance",
    });
  }
};

export const deleteInsurance = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await insuranceService.deleteInsurance(String(req.params.id));

    res.status(200).json({
      success: true,
      message: "Insurance deleted successfully",
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to delete insurance",
    });
  }
};

/* =========================================
   APPLICATIONS
========================================= */

export const approveInsurance = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await insuranceService.approveInsurance(
      String(req.params.id)
    );

    res.status(200).json({
      success: true,
      message: "Application approved",
      data: result,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Approval failed",
    });
  }
};

export const rejectInsurance = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await insuranceService.rejectInsurance(
      String(req.params.id),
      req.body.reason
    );

    res.status(200).json({
      success: true,
      message: "Application rejected",
      data: result,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Rejection failed",
    });
  }
};

export const getUserPolicies = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const policies = await insuranceService.getUserPolicies(
      String(req.params.userId)
    );

    res.status(200).json({
      success: true,
      data: policies,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch policies",
    });
  }
};

/* =========================================
   CLAIMS
========================================= */

export const createClaim = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const claim = await insuranceService.createClaim({
      applicationId: String(req.params.id),
      ...req.body,
    });

    res.status(201).json({
      success: true,
      message: "Claim created successfully",
      data: claim,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to create claim",
    });
  }
};

export const getPolicyClaims = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const claims = await insuranceService.getPolicyClaims(
      String(req.params.id)
    );

    res.status(200).json({
      success: true,
      data: claims,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch claims",
    });
  }
};

export const approveClaim = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const claim = await insuranceService.approveClaim(
      String(req.params.claimId)
    );

    res.status(200).json({
      success: true,
      data: claim,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Claim approval failed",
    });
  }
};

export const rejectClaim = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const claim = await insuranceService.rejectClaim(
      String(req.params.claimId),
      req.body.reason
    );

    res.status(200).json({
      success: true,
      data: claim,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Claim rejection failed",
    });
  }
};

/* =========================================
   ANALYTICS
========================================= */

export const getInsuranceAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const analytics =
      await insuranceService.getInsuranceAnalytics();

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