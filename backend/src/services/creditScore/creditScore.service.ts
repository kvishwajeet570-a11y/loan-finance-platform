import prisma from "../../prisma/prisma";

interface CreditScoreInput {
  userId: string;
  monthlyIncome: number;
  existingEMI: number;
  loanDefaults: number;
  creditCardUtilization: number;
  creditHistoryYears: number;
}

class CreditScoreService {
  /**
   * Calculate Credit Score
   */
  async calculateCreditScore(
    data: CreditScoreInput
  ) {
    let score = 300;

    // Income Score
    if (data.monthlyIncome >= 100000)
      score += 150;
    else if (data.monthlyIncome >= 50000)
      score += 100;
    else if (data.monthlyIncome >= 25000)
      score += 50;

    // Existing EMI Impact
    if (data.existingEMI < 10000)
      score += 100;
    else if (data.existingEMI < 30000)
      score += 50;

    // Credit Utilization
    if (data.creditCardUtilization < 30)
      score += 150;
    else if (
      data.creditCardUtilization < 50
    )
      score += 75;

    // Loan Defaults
    score -= data.loanDefaults * 50;

    // Credit History
    score +=
      data.creditHistoryYears * 20;

    score = Math.max(
      300,
      Math.min(score, 900)
    );

    return score;
  }

  /**
   * Save Credit Score
   */
  async saveCreditScore(
    data: CreditScoreInput
  ) {
    const score =
      await this.calculateCreditScore(
        data
      );

    return prisma.creditScore.create({
      data: {
        userId: data.userId,
        score,
        monthlyIncome:
          data.monthlyIncome,
        existingEMI:
          data.existingEMI,
        loanDefaults:
          data.loanDefaults,
        creditCardUtilization:
          data.creditCardUtilization,
        creditHistoryYears:
          data.creditHistoryYears,
      },
    });
  }

  /**
   * Latest Score
   */
  async getLatestScore(userId: string) {
    return prisma.creditScore.findFirst({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Score History
   */
  async getScoreHistory(
    userId: string
  ) {
    return prisma.creditScore.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Credit Grade
   */
  getCreditGrade(score: number) {
    if (score >= 800)
      return "EXCELLENT";

    if (score >= 750)
      return "VERY_GOOD";

    if (score >= 700)
      return "GOOD";

    if (score >= 650)
      return "FAIR";

    return "POOR";
  }

  /**
   * Loan Eligibility
   */
  async checkLoanEligibility(
    userId: string
  ) {
    const latest =
      await this.getLatestScore(userId);

    if (!latest) {
      throw new Error(
        "Credit score not found"
      );
    }

    return {
      score: latest.score,
      grade: this.getCreditGrade(
        latest.score
      ),
      eligible:
        latest.score >= 650,
      maxLoanAmount:
        latest.score >= 800
          ? 5000000
          : latest.score >= 750
          ? 2500000
          : latest.score >= 700
          ? 1000000
          : latest.score >= 650
          ? 500000
          : 0,
    };
  }

  /**
   * Dashboard Statistics
   */
  async getScoreStats() {
    const [
      totalChecks,
      averageScore,
      excellentScores,
      poorScores,
    ] = await Promise.all([
      prisma.creditScore.count(),

      prisma.creditScore.aggregate({
        _avg: {
          score: true,
        },
      }),

      prisma.creditScore.count({
        where: {
          score: {
            gte: 800,
          },
        },
      }),

      prisma.creditScore.count({
        where: {
          score: {
            lt: 650,
          },
        },
      }),
    ]);

    return {
      totalChecks,
      averageScore:
        averageScore._avg.score || 0,
      excellentScores,
      poorScores,
    };
  }

  /**
   * Risk Analysis
   */
  async getRiskAnalysis(
    userId: string
  ) {
    const latest =
      await this.getLatestScore(userId);

    if (!latest) {
      throw new Error(
        "Credit score not found"
      );
    }

    let riskLevel = "HIGH";

    if (latest.score >= 800)
      riskLevel = "LOW";
    else if (latest.score >= 700)
      riskLevel = "MEDIUM";

    return {
      score: latest.score,
      riskLevel,
      recommendation:
        riskLevel === "LOW"
          ? "Instant Approval"
          : riskLevel === "MEDIUM"
          ? "Manual Verification"
          : "High Risk Customer",
    };
  }
}

export default new CreditScoreService();