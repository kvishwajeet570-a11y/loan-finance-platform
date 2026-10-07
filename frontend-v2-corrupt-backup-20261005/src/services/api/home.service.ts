import api from "@/lib/api";
import type {
  LoanApplication,
  LoanApplicationPayload,
} from "@/types/home";

export interface LoanApplicationResponse {
  success: boolean;
  message?: string;
  loan?: LoanApplication;
  data?: LoanApplication;
}

export async function applyForLoan(
  payload: LoanApplicationPayload
): Promise<LoanApplicationResponse> {
  const response = await api.post("/loan", payload);

  const body = response.data;

  return {
    success: Boolean(body?.success),
    message: body?.message,
    loan: body?.loan,
    data: body?.data,
  };
}
