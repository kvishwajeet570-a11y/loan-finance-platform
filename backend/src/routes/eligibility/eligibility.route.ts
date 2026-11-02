import { Router, Request, Response } from "express";
import { EligibilityService } from "../../eligibility/eligibility.service";

const router = Router();

router.post("/check", (req: Request, res: Response) => {
  const {
    monthlyIncome,
    existingEMI,
    requestedLoanAmount,
    tenureMonths,
    annualInterestRate,
  } = req.body ?? {};

  const values = [
    monthlyIncome,
    existingEMI,
    requestedLoanAmount,
    tenureMonths,
    annualInterestRate,
  ];

  if (
    values.some((value) => typeof value !== "number" || !Number.isFinite(value)) ||
    monthlyIncome <= 0 ||
    existingEMI < 0 ||
    requestedLoanAmount <= 0 ||
    !Number.isInteger(tenureMonths) ||
    tenureMonths < 1 ||
    tenureMonths > 360 ||
    annualInterestRate < 0 ||
    annualInterestRate > 100
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid eligibility inputs. Check income, EMI, loan amount, tenure and interest rate.",
    });
  }

  try {
    const result = EligibilityService.checkEligibility({
      monthlyIncome,
      existingEMI,
      requestedLoanAmount,
      tenureMonths,
      annualInterestRate,
    });

    return res.json({
      success: true,
      data: result,
      disclaimer: "Preliminary estimate only. This is not a lender approval or offer.",
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Eligibility calculation failed.",
    });
  }
});

export default router;