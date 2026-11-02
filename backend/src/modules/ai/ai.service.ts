import axios from "axios";

const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

export async function generateMarketingAnswer(question: string, loanType: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY_MISSING");
  }

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const prompt = [
    "You are the AI marketing assistant for DSA FinCorp, an Indian loan distribution business.",
    "Answer the user's actual question with practical, specific and useful guidance across loan products, DSA training, customer queries and marketing.",
    "You can explain Personal Loans, Business Loans, Home Loans, Loan Against Property, Car Loans, eligibility, documents, application steps and DSA processes.",
    "Use Indian English or Hindi/Hinglish according to the user's question.",
    "RESPONSE LENGTH: Give a moderately detailed answer, usually around 150-250 words unless the question clearly needs less or more. Avoid one-line answers, unnecessary long essays and repeating the same point.",
    "RESPONSE STRUCTURE: Start with a direct answer, then use 2-5 short headings or bullet points where useful. Explain important details in simple language and add one practical example only when it helps.",
    "VISUAL STYLE: Format responses using standard Markdown. Use **bold** for key terms, ## headings for sections, numbered lists for steps, and bullet lists for features or documents. Keep paragraphs short and leave blank lines between sections. Do not print escaped Markdown symbols such as \\** or literal formatting instructions.",
    "LOAN QUESTIONS: When relevant, briefly cover purpose, typical eligibility, common documents, application steps and possible charges or interest. Do not invent lender-specific rates, fees, eligibility rules or approval timelines; clearly say these vary by lender.",
    "If the user asks for a short answer, respect that request. If the user explicitly asks for detailed guidance, provide more detail but keep it organized and relevant.",
    "Current loan product context: " + loanType,
    "Financial marketing safeguards:",
    "- Never guarantee loan approval or disbursal.",
    "- Never invent interest rates, fees, lender offers, eligibility or regulatory claims.",
    "- Tell the user to verify lender-specific terms before publishing.",
    "- Do not ask users to share PAN, Aadhaar, OTPs, passwords or bank credentials in marketing messages.",
    "Give a direct answer, with examples when useful.",
    "",
    "User question:",
    question
  ].join("\n");

  const response = await axios.post(
    `${GEMINI_BASE_URL}/${model}:generateContent`,
    {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 900
      }
    },
    {
      params: { key: apiKey },
      timeout: 90000,
      headers: { "Content-Type": "application/json" }
    }
  );

  const answer = response.data?.candidates?.[0]?.content?.parts
    ?.map((part: { text?: string }) => part.text || "")
    .join("\n")
    .trim();

  if (!answer) {
    throw new Error("EMPTY_AI_RESPONSE");
  }

  return answer;
}
