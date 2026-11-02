import type { Request, Response } from "express";
import { generateMarketingAnswer } from "./ai.service";

export async function marketingAssistant(req: Request, res: Response) {
  const question = typeof req.body?.question === "string"
    ? req.body.question.trim()
    : "";
  const loanType = typeof req.body?.loanType === "string"
    ? req.body.loanType.trim().slice(0, 80)
    : "General Loans";

  if (!question) {
    return res.status(400).json({
      success: false,
      message: "Please enter a marketing question."
    });
  }

  if (question.length > 2000) {
    return res.status(400).json({
      success: false,
      message: "Question is too long. Keep it under 2000 characters."
    });
  }

  try {
    const answer = await generateMarketingAnswer(question, loanType);
    return res.json({ success: true, answer });
  } catch (error: unknown) {
    const err = error as {
      message?: string;
      response?: { status?: number; data?: unknown };
      code?: string;
    };

    if (err.message === "GEMINI_API_KEY_MISSING") {
      return res.status(503).json({
        success: false,
        message: "AI is not configured yet. Add GEMINI_API_KEY to the backend .env file."
      });
    }

    if (err.code === "ECONNABORTED") {
      return res.status(504).json({
        success: false,
        message: "AI request timed out. Please try again."
      });
    }

    console.error("Marketing AI request failed:", {
      status: err.response?.status,
      code: err.code,
      message: err.message,
      details: JSON.stringify((err.response?.data as any)?.error || err.response?.data || null)
    });

    return res.status(502).json({
      success: false,
      message: "AI could not generate a response. Check the backend logs and API configuration, then try again."
    });
  }
}
