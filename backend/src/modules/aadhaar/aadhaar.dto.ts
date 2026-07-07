export interface AiRequestDto {
  userId: string;

  prompt: string;

  module:
    | "loan"
    | "eligibility"
    | "credit-score"
    | "document-analysis"
    | "customer-support"
    | "fraud-detection"
    | "kyc";

  language?: "en" | "hi";

  metadata?: {
    loanType?: string;
    loanAmount?: number;
    monthlyIncome?: number;
    employmentType?: string;
    city?: string;
    state?: string;
    creditScore?: number;
  };
}

export interface AiResponseDto {
  success: boolean;

  module: string;

  response: string;

  confidenceScore: number;

  recommendations?: string[];

  riskLevel?: "LOW" | "MEDIUM" | "HIGH";

  createdAt: Date;
}