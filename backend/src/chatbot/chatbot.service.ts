import axios from "axios";

export class ChatbotService {
  async sendMessage(message: string) {
    try {
      const response = await axios.post(
        process.env.GEMINI_API_URL as string,
        {
          contents: [
            {
              parts: [{ text: message }],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": process.env.GEMINI_API_KEY,
          },
        }
      );

      return {
        success: true,
        reply:
          response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "No response generated",
      };
    } catch (error: any) {
      console.error("Chatbot Error:", error.message);

      return {
        success: false,
        message: "Unable to process request",
      };
    }
  }

  async loanAssistant(query: string) {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes("personal loan")) {
      return {
        success: true,
        answer:
          "Personal Loan available from ₹50,000 to ₹40 Lakhs.",
      };
    }

    if (lowerQuery.includes("home loan")) {
      return {
        success: true,
        answer:
          "Home Loan available up to ₹5 Crore with attractive interest rates.",
      };
    }

    if (lowerQuery.includes("business loan")) {
      return {
        success: true,
        answer:
          "Business Loan available up to ₹2 Crore without collateral in selected cases.",
      };
    }

    return this.sendMessage(query);
  }
}

export default new ChatbotService();