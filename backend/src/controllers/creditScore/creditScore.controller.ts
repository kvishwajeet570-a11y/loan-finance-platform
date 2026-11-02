import { Request, Response } from "express";
import creditScoreService from "../../services/creditScore/creditScore.service";
export const checkCreditScore = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const panNo = String(req.body?.panNo ?? "").trim().toUpperCase();

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(panNo)) {
      res.status(400).json({
        success: false,
        message: "Please provide a valid PAN number.",
      });
      return;
    }

    const userId = String((req as any).user?.id ?? (req as any).user?.userId ?? "");
    if (!userId) {
      res.status(401).json({ success: false, message: "Authenticated user ID missing. Please login again." });
      return;
    }

    const result = await creditScoreService.checkCreditScore(panNo);
    const saved = await creditScoreService.saveCreditScore({
      userId,
      monthlyIncome: 0,
      existingEMI: 0,
      loanDefaults: 0,
      creditCardUtilization: 0,
      creditHistoryYears: 0,
    });

    res.status(200).json({
      success: true,
      message: "Demo score saved successfully. No verified bureau report was fetched.",
      data: {
        id: saved.id,
        score: saved.score,
        grade: result.grade,
        bureau: "DEMO",
        verified: false,
        checkedAt: result.checkedAt,
        savedToDatabase: true,
      },
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: error instanceof Error
        ? error.message
        : "Credit score request failed.",
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
    const id = String(req.params.id);

const data =
  await creditScoreService.getCreditScoreById(id);

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
    const id = String(req.params.id);

    await creditScoreService.softDelete(id);

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


export const getMyCreditScoreHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // User identity must come only from the verified JWT middleware.
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
      return;
    }

    const data = await creditScoreService.getScoreHistory(userId);

    res.status(200).json({
      success: true,
      total: data.length,
      data,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: error instanceof Error
        ? error.message
        : "Failed to fetch your credit score history.",
    });
  }
};

/**
 * DSA demo check: returns a demo result without saving to Customer CreditScore history.
 * This is not a verified bureau report.
 */
export const checkDsaCreditScore = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const panNo = String(req.body?.panNo ?? "").trim().toUpperCase();

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(panNo)) {
      res.status(400).json({
        success: false,
        message: "Please provide a valid PAN number.",
      });
      return;
    }

    const result = await creditScoreService.checkCreditScore(panNo);

    res.status(200).json({
      success: true,
      message: "Demo score generated. It was not saved to Customer credit history.",
      data: {
        score: result.score,
        grade: result.grade,
        bureau: "DEMO",
        verified: false,
        checkedAt: result.checkedAt,
        savedToDatabase: false,
      },
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: error instanceof Error
        ? error.message
        : "DSA credit score request failed.",
    });
  }
};

