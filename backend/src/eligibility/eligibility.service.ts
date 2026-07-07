// src/services/eligibility.service.ts

export interface EligibilityInput {
  monthlyIncome: number;
  existingEMI: number;
  requestedLoanAmount: number;
  tenureMonths: number;
  annualInterestRate: number;
}

export interface EligibilityResult {
  eligible: boolean;
  maxEligibleEMI: number;
  availableEMI: number;
  maxEligibleLoanAmount: number;
  foir: number;
  emi: number;
  approvalScore: number;
  remarks: string;
}

export class EligibilityService {
  static calculateEMI(
    principal: number,
    annualRate: number,
    tenureMonths: number
  ): number {
    const monthlyRate = annualRate / 12 / 100;

    const emi =
      (principal *
        monthlyRate *
        Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1);

    return Number(emi.toFixed(2));
  }

  static calculateEligibleLoanAmount(
    availableEMI: number,
    annualRate: number,
    tenureMonths: number
  ): number {
    const monthlyRate = annualRate / 12 / 100;

    const amount =
      availableEMI *
      ((Math.pow(1 + monthlyRate, tenureMonths) - 1) /
        (monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)));

    return Number(amount.toFixed(2));
  }

  static checkEligibility(
    data: EligibilityInput
  ): EligibilityResult {
    const {
      monthlyIncome,
      existingEMI,
      requestedLoanAmount,
      tenureMonths,
      annualInterestRate,
    } = data;

    // FOIR = 50%
    const maxEligibleEMI = monthlyIncome * 0.5;

    const availableEMI =
      maxEligibleEMI - existingEMI;

    const emi = this.calculateEMI(
      requestedLoanAmount,
      annualInterestRate,
      tenureMonths
    );

    const maxEligibleLoanAmount =
      this.calculateEligibleLoanAmount(
        availableEMI,
        annualInterestRate,
        tenureMonths
      );

    const eligible =
      emi <= availableEMI &&
      availableEMI > 0;

    let approvalScore = 0;

    if (monthlyIncome >= 100000)
      approvalScore += 40;
    else if (monthlyIncome >= 50000)
      approvalScore += 30;
    else if (monthlyIncome >= 25000)
      approvalScore += 20;

    if (existingEMI === 0)
      approvalScore += 30;
    else if (existingEMI <= monthlyIncome * 0.1)
      approvalScore += 20;
    else if (existingEMI <= monthlyIncome * 0.2)
      approvalScore += 10;

    if (eligible)
      approvalScore += 30;

    let remarks = "Rejected";

    if (approvalScore >= 80)
      remarks = "Highly Eligible";
    else if (approvalScore >= 60)
      remarks = "Eligible";
    else if (approvalScore >= 40)
      remarks = "Conditionally Eligible";

    return {
      eligible,
      maxEligibleEMI: Number(
        maxEligibleEMI.toFixed(2)
      ),
      availableEMI: Number(
        availableEMI.toFixed(2)
      ),
      maxEligibleLoanAmount,
      foir: 50,
      emi,
      approvalScore,
      remarks,
    };
  }
}